#!/bin/bash

# 📦 Script de Sauvegarde Parabellum Groups
# Usage: ./backup.sh [type]
# Types: full, db, files, config

set -e

# Variables
BACKUP_DIR="/var/backups/parabellum"
APP_DIR="/var/www/parabellum-groups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_TYPE=${1:-full}
RETENTION_DAYS=30

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Créer le dossier de sauvegarde
create_backup_dir() {
    sudo mkdir -p $BACKUP_DIR
    sudo chown $USER:$USER $BACKUP_DIR
}

# Sauvegarde base de données
backup_database() {
    log "Sauvegarde de la base de données..."
    
    # Dump avec compression
    sudo -u postgres pg_dump \
        --verbose \
        --clean \
        --no-acl \
        --no-owner \
        parabellum_db | gzip > $BACKUP_DIR/db_$DATE.sql.gz
    
    # Vérification de l'intégrité
    if gzip -t $BACKUP_DIR/db_$DATE.sql.gz; then
        success "Base de données sauvegardée : db_$DATE.sql.gz"
    else
        error "Erreur lors de la sauvegarde de la base de données"
    fi
    
    # Statistiques
    DB_SIZE=$(du -h $BACKUP_DIR/db_$DATE.sql.gz | cut -f1)
    log "Taille de la sauvegarde DB : $DB_SIZE"
}

# Sauvegarde des fichiers
backup_files() {
    log "Sauvegarde des fichiers..."
    
    # Uploads
    if [ -d "$APP_DIR/Back-end/uploads" ]; then
        tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz \
            -C $APP_DIR/Back-end uploads/
        success "Fichiers uploads sauvegardés : uploads_$DATE.tar.gz"
    fi
    
    # Logs
    if [ -d "/var/log/parabellum" ]; then
        tar -czf $BACKUP_DIR/logs_$DATE.tar.gz \
            -C /var/log parabellum/
        success "Logs sauvegardés : logs_$DATE.tar.gz"
    fi
    
    # Certificats SSL
    if [ -d "/etc/letsencrypt/live" ]; then
        sudo tar -czf $BACKUP_DIR/ssl_$DATE.tar.gz \
            -C /etc/letsencrypt live/ archive/
        success "Certificats SSL sauvegardés : ssl_$DATE.tar.gz"
    fi
}

# Sauvegarde configuration
backup_config() {
    log "Sauvegarde de la configuration..."
    
    # Variables d'environnement
    if [ -f "$APP_DIR/Back-end/.env" ]; then
        cp $APP_DIR/Back-end/.env $BACKUP_DIR/backend_env_$DATE.backup
    fi
    
    if [ -f "$APP_DIR/.env" ]; then
        cp $APP_DIR/.env $BACKUP_DIR/frontend_env_$DATE.backup
    fi
    
    # Configuration Nginx
    if [ -f "/etc/nginx/sites-available/parabellum" ]; then
        sudo cp /etc/nginx/sites-available/parabellum $BACKUP_DIR/nginx_$DATE.conf
    fi
    
    # Configuration PM2
    if [ -f "$APP_DIR/Back-end/ecosystem.config.js" ]; then
        cp $APP_DIR/Back-end/ecosystem.config.js $BACKUP_DIR/pm2_$DATE.config.js
    fi
    
    # Package.json pour traçabilité des versions
    cp $APP_DIR/package.json $BACKUP_DIR/frontend_package_$DATE.json
    cp $APP_DIR/Back-end/package.json $BACKUP_DIR/backend_package_$DATE.json
    
    success "Configuration sauvegardée"
}

# Sauvegarde complète
backup_full() {
    log "🚀 Début de la sauvegarde complète..."
    
    backup_database
    backup_files
    backup_config
    
    # Créer une archive complète
    log "Création de l'archive complète..."
    tar -czf $BACKUP_DIR/parabellum_full_$DATE.tar.gz \
        -C $BACKUP_DIR \
        db_$DATE.sql.gz \
        uploads_$DATE.tar.gz \
        logs_$DATE.tar.gz \
        *_$DATE.backup \
        *_$DATE.conf \
        *_$DATE.config.js \
        *_$DATE.json
    
    success "Archive complète créée : parabellum_full_$DATE.tar.gz"
}

# Nettoyage des anciennes sauvegardes
cleanup_old_backups() {
    log "Nettoyage des anciennes sauvegardes (>$RETENTION_DAYS jours)..."
    
    # Supprimer les fichiers anciens
    find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    find $BACKUP_DIR -name "*.backup" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    find $BACKUP_DIR -name "*.conf" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    find $BACKUP_DIR -name "*.json" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    
    success "Nettoyage terminé"
}

# Vérification de l'espace disque
check_disk_space() {
    log "Vérification de l'espace disque..."
    
    AVAILABLE_SPACE=$(df $BACKUP_DIR | awk 'NR==2 {print $4}')
    REQUIRED_SPACE=1048576  # 1GB en KB
    
    if [ $AVAILABLE_SPACE -lt $REQUIRED_SPACE ]; then
        warning "Espace disque faible : $(($AVAILABLE_SPACE/1024))MB disponibles"
        warning "Nettoyage forcé des anciennes sauvegardes..."
        find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
    fi
    
    success "Espace disque suffisant"
}

# Envoi de notification (optionnel)
send_notification() {
    local status=$1
    local message=$2
    
    # Email (si configuré)
    if command -v mail &> /dev/null; then
        echo "$message" | mail -s "Sauvegarde Parabellum - $status" admin@parabellum.com
    fi
    
    # Webhook Slack/Discord (si configuré)
    if [ -n "$WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$message\"}" \
            $WEBHOOK_URL
    fi
}

# Restauration
restore_backup() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        echo "Usage: ./backup.sh restore <fichier_sauvegarde>"
        echo "Sauvegardes disponibles :"
        ls -la $BACKUP_DIR/*.sql.gz 2>/dev/null || echo "Aucune sauvegarde trouvée"
        exit 1
    fi
    
    warning "⚠️  ATTENTION : Cette opération va écraser les données actuelles !"
    read -p "Êtes-vous sûr de vouloir continuer ? (oui/non): " confirm
    
    if [ "$confirm" != "oui" ]; then
        log "Restauration annulée"
        exit 0
    fi
    
    log "Restauration en cours..."
    
    # Arrêter l'application
    pm2 stop parabellum-api
    
    # Restaurer la base de données
    zcat $backup_file | sudo -u postgres psql parabellum_db
    
    # Redémarrer l'application
    pm2 start parabellum-api
    
    success "Restauration terminée"
}

# Fonction principale
main() {
    create_backup_dir
    check_disk_space
    
    case "$BACKUP_TYPE" in
        "full")
            backup_full
            ;;
        "db")
            backup_database
            ;;
        "files")
            backup_files
            ;;
        "config")
            backup_config
            ;;
        "restore")
            restore_backup $2
            return
            ;;
        *)
            echo "Usage: $0 [full|db|files|config|restore]"
            exit 1
            ;;
    esac
    
    cleanup_old_backups
    
    # Statistiques finales
    BACKUP_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
    BACKUP_COUNT=$(ls -1 $BACKUP_DIR/*.gz 2>/dev/null | wc -l)
    
    success "📊 Sauvegarde terminée !"
    log "   - Type : $BACKUP_TYPE"
    log "   - Taille totale : $BACKUP_SIZE"
    log "   - Nombre de fichiers : $BACKUP_COUNT"
    log "   - Emplacement : $BACKUP_DIR"
    
    # Notification
    send_notification "SUCCESS" "Sauvegarde $BACKUP_TYPE terminée avec succès"
}

# Gestion des signaux
trap 'error "Sauvegarde interrompue"' INT TERM

# Exécution
main "$@"