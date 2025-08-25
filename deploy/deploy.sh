#!/bin/bash

# 🚀 Script de Déploiement Parabellum Groups
# Usage: ./deploy.sh [environment]
# Exemple: ./deploy.sh production

set -e  # Arrêt en cas d'erreur

# Variables
ENVIRONMENT=${1:-production}
APP_DIR="/var/www/parabellum-groups"
BACKUP_DIR="/var/backups/parabellum"
DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/parabellum/deploy_$DATE.log"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a $LOG_FILE
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a $LOG_FILE
    exit 1
}

# Vérifications préliminaires
check_prerequisites() {
    log "Vérification des prérequis..."
    
    # Vérifier que nous sommes dans le bon répertoire
    if [ ! -f "package.json" ]; then
        error "Fichier package.json non trouvé. Êtes-vous dans le bon répertoire ?"
    fi
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js n'est pas installé"
    fi
    
    # Vérifier PM2
    if ! command -v pm2 &> /dev/null; then
        error "PM2 n'est pas installé"
    fi
    
    # Vérifier PostgreSQL
    if ! systemctl is-active --quiet postgresql; then
        error "PostgreSQL n'est pas en cours d'exécution"
    fi
    
    success "Prérequis validés"
}

# Sauvegarde avant déploiement
backup_system() {
    log "Création de la sauvegarde..."
    
    # Créer le dossier de sauvegarde
    sudo mkdir -p $BACKUP_DIR
    
    # Sauvegarde base de données
    log "Sauvegarde de la base de données..."
    sudo -u postgres pg_dump parabellum_db | gzip > $BACKUP_DIR/db_$DATE.sql.gz
    
    # Sauvegarde fichiers uploads
    if [ -d "$APP_DIR/Back-end/uploads" ]; then
        log "Sauvegarde des fichiers uploads..."
        tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C $APP_DIR/Back-end uploads/
    fi
    
    # Sauvegarde configuration
    if [ -f "$APP_DIR/Back-end/.env" ]; then
        cp $APP_DIR/Back-end/.env $BACKUP_DIR/env_$DATE.backup
    fi
    
    success "Sauvegarde créée dans $BACKUP_DIR"
}

# Mise à jour du code source
update_source() {
    log "Mise à jour du code source..."
    
    cd $APP_DIR
    
    # Stash des modifications locales
    git stash push -m "Auto-stash before deploy $DATE"
    
    # Récupération des dernières modifications
    git fetch origin
    git checkout main
    git pull origin main
    
    success "Code source mis à jour"
}

# Déploiement Backend
deploy_backend() {
    log "Déploiement du Backend..."
    
    cd $APP_DIR/Back-end
    
    # Installation des dépendances
    log "Installation des dépendances Backend..."
    npm ci --production
    
    # Génération du client Prisma
    log "Génération du client Prisma..."
    npx prisma generate
    
    # Application des migrations
    log "Application des migrations de base de données..."
    npx prisma migrate deploy
    
    # Build de production
    log "Build de production Backend..."
    npm run build
    
    success "Backend déployé"
}

# Déploiement Frontend
deploy_frontend() {
    log "Déploiement du Frontend..."
    
    cd $APP_DIR
    
    # Installation des dépendances
    log "Installation des dépendances Frontend..."
    npm ci
    
    # Build de production
    log "Build de production Frontend..."
    npm run build
    
    # Vérification du build
    if [ ! -d "dist" ]; then
        error "Le build Frontend a échoué - dossier dist non trouvé"
    fi
    
    success "Frontend déployé"
}

# Redémarrage des services
restart_services() {
    log "Redémarrage des services..."
    
    # Redémarrage PM2
    if pm2 list | grep -q "parabellum-api"; then
        log "Redémarrage de l'application PM2..."
        pm2 reload parabellum-api --update-env
    else
        log "Démarrage initial de l'application PM2..."
        cd $APP_DIR/Back-end
        pm2 start ecosystem.config.js --env $ENVIRONMENT
    fi
    
    # Sauvegarde de la configuration PM2
    pm2 save
    
    # Redémarrage Nginx
    log "Rechargement de la configuration Nginx..."
    sudo nginx -t
    sudo systemctl reload nginx
    
    success "Services redémarrés"
}

# Tests post-déploiement
run_health_checks() {
    log "Exécution des tests de santé..."
    
    # Attendre que l'API soit prête
    sleep 10
    
    # Test API Health
    log "Test de l'endpoint de santé..."
    if curl -f -s http://localhost:3001/api/health > /dev/null; then
        success "API opérationnelle"
    else
        error "L'API ne répond pas correctement"
    fi
    
    # Test Frontend
    log "Test du Frontend..."
    if curl -f -s http://localhost > /dev/null; then
        success "Frontend accessible"
    else
        warning "Frontend pourrait avoir des problèmes"
    fi
    
    # Test base de données
    log "Test de la base de données..."
    cd $APP_DIR/Back-end
    if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
        success "Base de données accessible"
    else
        error "Problème de connexion à la base de données"
    fi
    
    success "Tests de santé terminés"
}

# Nettoyage post-déploiement
cleanup() {
    log "Nettoyage post-déploiement..."
    
    # Nettoyage des anciennes sauvegardes (garder 7 jours)
    find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete 2>/dev/null || true
    find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete 2>/dev/null || true
    
    # Nettoyage des logs PM2
    pm2 flush
    
    # Nettoyage du cache npm
    npm cache clean --force
    
    success "Nettoyage terminé"
}

# Fonction de rollback
rollback() {
    warning "Rollback en cours..."
    
    # Arrêter l'application
    pm2 stop parabellum-api
    
    # Restaurer la dernière sauvegarde
    LATEST_BACKUP=$(ls -t $BACKUP_DIR/db_*.sql.gz | head -1)
    if [ -n "$LATEST_BACKUP" ]; then
        log "Restauration de la base de données : $LATEST_BACKUP"
        zcat $LATEST_BACKUP | sudo -u postgres psql parabellum_db
    fi
    
    # Revenir au commit précédent
    cd $APP_DIR
    git reset --hard HEAD~1
    
    # Redéployer la version précédente
    deploy_backend
    deploy_frontend
    restart_services
    
    warning "Rollback terminé"
}

# Fonction principale
main() {
    log "🚀 Début du déploiement Parabellum Groups - Environnement: $ENVIRONMENT"
    
    # Créer le dossier de logs
    sudo mkdir -p /var/log/parabellum
    sudo chown $USER:$USER /var/log/parabellum
    
    # Trap pour gérer les erreurs
    trap 'error "Déploiement échoué. Consultez les logs : $LOG_FILE"' ERR
    
    # Exécution des étapes
    check_prerequisites
    backup_system
    update_source
    deploy_backend
    deploy_frontend
    restart_services
    run_health_checks
    cleanup
    
    success "🎉 Déploiement terminé avec succès !"
    log "📊 Statistiques du déploiement :"
    log "   - Durée : $(($(date +%s) - START_TIME)) secondes"
    log "   - Version : $(git rev-parse --short HEAD)"
    log "   - Environnement : $ENVIRONMENT"
    log "   - Logs : $LOG_FILE"
}

# Gestion des arguments
case "$1" in
    "rollback")
        rollback
        ;;
    "health")
        run_health_checks
        ;;
    "backup")
        backup_system
        ;;
    *)
        START_TIME=$(date +%s)
        main
        ;;
esac