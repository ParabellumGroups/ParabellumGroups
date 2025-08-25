#!/bin/bash

# 🛠️ Script d'Installation Serveur Ubuntu pour Parabellum Groups
# Usage: ./setup-server.sh

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Vérification des prérequis
check_system() {
    log "Vérification du système..."
    
    # Vérifier Ubuntu
    if ! grep -q "Ubuntu" /etc/os-release; then
        error "Ce script est conçu pour Ubuntu"
    fi
    
    # Vérifier les privilèges sudo
    if ! sudo -n true 2>/dev/null; then
        error "Privilèges sudo requis"
    fi
    
    success "Système compatible"
}

# Mise à jour du système
update_system() {
    log "Mise à jour du système..."
    
    sudo apt update
    sudo apt upgrade -y
    sudo apt install curl wget git unzip software-properties-common build-essential -y
    
    success "Système mis à jour"
}

# Installation Node.js
install_nodejs() {
    log "Installation de Node.js 18..."
    
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install nodejs -y
    
    # Vérification
    NODE_VERSION=$(node --version)
    NPM_VERSION=$(npm --version)
    
    log "Node.js installé : $NODE_VERSION"
    log "npm installé : $NPM_VERSION"
    
    success "Node.js configuré"
}

# Installation PostgreSQL
install_postgresql() {
    log "Installation de PostgreSQL..."
    
    sudo apt install postgresql postgresql-contrib -y
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Configuration de base
    sudo -u postgres psql << EOF
CREATE DATABASE parabellum_db;
CREATE USER parabellum_user WITH PASSWORD 'ParabellumSecure2025!';
GRANT ALL PRIVILEGES ON DATABASE parabellum_db TO parabellum_user;
ALTER USER parabellum_user CREATEDB;
\q
EOF
    
    success "PostgreSQL configuré"
}

# Installation Redis
install_redis() {
    log "Installation de Redis..."
    
    sudo apt install redis-server -y
    
    # Configuration sécurisée
    sudo sed -i 's/# requirepass foobared/requirepass ParabellumRedis2025!/' /etc/redis/redis.conf
    sudo sed -i 's/bind 127.0.0.1 ::1/bind 127.0.0.1/' /etc/redis/redis.conf
    
    sudo systemctl restart redis-server
    sudo systemctl enable redis-server
    
    # Test
    if redis-cli -a ParabellumRedis2025! ping | grep -q PONG; then
        success "Redis configuré"
    else
        warning "Redis installé mais test échoué"
    fi
}

# Installation Nginx
install_nginx() {
    log "Installation de Nginx..."
    
    sudo apt install nginx -y
    sudo systemctl start nginx
    sudo systemctl enable nginx
    
    # Configuration de base
    sudo rm -f /etc/nginx/sites-enabled/default
    
    success "Nginx installé"
}

# Installation PM2
install_pm2() {
    log "Installation de PM2..."
    
    sudo npm install -g pm2
    
    # Configuration des logs
    sudo mkdir -p /var/log/pm2
    sudo chown $USER:$USER /var/log/pm2
    
    success "PM2 installé"
}

# Configuration du firewall
setup_firewall() {
    log "Configuration du firewall..."
    
    sudo ufw --force enable
    sudo ufw allow ssh
    sudo ufw allow 'Nginx Full'
    sudo ufw deny 3001  # Bloquer accès direct à l'API
    
    success "Firewall configuré"
}

# Installation SSL avec Let's Encrypt
install_ssl() {
    log "Installation de Certbot pour SSL..."
    
    sudo apt install snapd -y
    sudo snap install core
    sudo snap refresh core
    sudo snap install --classic certbot
    sudo ln -sf /snap/bin/certbot /usr/bin/certbot
    
    success "Certbot installé"
    warning "N'oubliez pas de configurer SSL avec : sudo certbot --nginx -d votre-domaine.com"
}

# Création des dossiers
create_directories() {
    log "Création des dossiers..."
    
    sudo mkdir -p /var/www/parabellum-groups
    sudo mkdir -p /var/backups/parabellum
    sudo mkdir -p /var/log/parabellum
    
    # Permissions
    sudo chown -R $USER:$USER /var/www/parabellum-groups
    sudo chown -R $USER:$USER /var/backups/parabellum
    sudo chown -R $USER:$USER /var/log/parabellum
    
    success "Dossiers créés"
}

# Installation des outils de monitoring
install_monitoring() {
    log "Installation des outils de monitoring..."
    
    # htop pour monitoring système
    sudo apt install htop iotop nethogs -y
    
    # fail2ban pour sécurité
    sudo apt install fail2ban -y
    
    # Configuration fail2ban
    sudo tee /etc/fail2ban/jail.local > /dev/null << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
EOF
    
    sudo systemctl restart fail2ban
    sudo systemctl enable fail2ban
    
    success "Outils de monitoring installés"
}

# Optimisation système
optimize_system() {
    log "Optimisation du système..."
    
    # Optimisation PostgreSQL
    sudo tee -a /etc/postgresql/*/main/postgresql.conf > /dev/null << EOF

# Optimisations Parabellum
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 16MB
maintenance_work_mem = 64MB
max_connections = 200
EOF
    
    # Optimisation Redis
    echo 'vm.overcommit_memory = 1' | sudo tee -a /etc/sysctl.conf
    
    # Limites système
    sudo tee -a /etc/security/limits.conf > /dev/null << EOF
# Limites pour Parabellum
$USER soft nofile 65536
$USER hard nofile 65536
EOF
    
    success "Système optimisé"
}

# Création du script de déploiement
create_deploy_script() {
    log "Création du script de déploiement..."
    
    cat > /var/www/parabellum-groups/deploy.sh << 'EOF'
#!/bin/bash
# Script de déploiement automatique

set -e

APP_DIR="/var/www/parabellum-groups"
BACKUP_DIR="/var/backups/parabellum"
DATE=$(date +%Y%m%d_%H%M%S)

echo "🚀 Début du déploiement..."

# Sauvegarde
echo "📦 Sauvegarde..."
sudo -u postgres pg_dump parabellum_db > $BACKUP_DIR/db_$DATE.sql

# Mise à jour du code
echo "📥 Mise à jour du code..."
cd $APP_DIR
git pull origin main

# Backend
echo "🔧 Backend..."
cd Back-end
npm install --production
npx prisma generate
npx prisma db push
npm run build

# Frontend
echo "🎨 Frontend..."
cd ..
npm install
npm run build

# Redémarrage
echo "🔄 Redémarrage..."
pm2 restart parabellum-api
sudo systemctl reload nginx

echo "✅ Déploiement terminé !"
EOF
    
    chmod +x /var/www/parabellum-groups/deploy.sh
    
    success "Script de déploiement créé"
}

# Résumé final
show_summary() {
    log "📋 Résumé de l'installation :"
    echo ""
    echo "🔧 Services installés :"
    echo "   - Node.js $(node --version)"
    echo "   - PostgreSQL (port 5432)"
    echo "   - Redis (port 6379)"
    echo "   - Nginx (ports 80/443)"
    echo "   - PM2 (process manager)"
    echo ""
    echo "📁 Dossiers créés :"
    echo "   - Application : /var/www/parabellum-groups"
    echo "   - Sauvegardes : /var/backups/parabellum"
    echo "   - Logs : /var/log/parabellum"
    echo ""
    echo "🔐 Base de données :"
    echo "   - Nom : parabellum_db"
    echo "   - Utilisateur : parabellum_user"
    echo "   - Mot de passe : ParabellumSecure2025!"
    echo ""
    echo "🚀 Prochaines étapes :"
    echo "   1. Cloner le projet dans /var/www/parabellum-groups"
    echo "   2. Configurer les fichiers .env"
    echo "   3. Exécuter le script de déploiement"
    echo "   4. Configurer SSL avec certbot"
    echo ""
    warning "N'oubliez pas de changer les mots de passe par défaut !"
}

# Fonction principale
main() {
    log "🚀 Installation du serveur Parabellum Groups"
    
    check_system
    update_system
    install_nodejs
    install_postgresql
    install_redis
    install_nginx
    install_pm2
    setup_firewall
    install_ssl
    create_directories
    install_monitoring
    optimize_system
    create_deploy_script
    
    success "🎉 Installation terminée avec succès !"
    show_summary
}

# Exécution
main "$@"