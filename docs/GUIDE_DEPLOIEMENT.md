# 🚀 GUIDE DE DÉPLOIEMENT - PARABELLUM GROUPS

## 📋 Prérequis Serveur VPS Ubuntu

### Spécifications Minimales
- **OS** : Ubuntu 20.04 LTS ou supérieur
- **RAM** : 4 GB minimum (8 GB recommandé)
- **CPU** : 2 vCPU minimum
- **Stockage** : 50 GB SSD minimum
- **Bande passante** : 100 Mbps

### Accès Requis
- Accès root ou sudo
- Connexion SSH
- Nom de domaine (optionnel)

## 🛠️ Installation des Dépendances

### 1. Mise à jour du système
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl wget git unzip software-properties-common -y
```

### 2. Installation Node.js 18+
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y
node --version  # Vérifier version 18+
npm --version
```

### 3. Installation PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configuration utilisateur
sudo -u postgres psql
CREATE DATABASE parabellum_db;
CREATE USER parabellum_user WITH PASSWORD 'votre_mot_de_passe_securise';
GRANT ALL PRIVILEGES ON DATABASE parabellum_db TO parabellum_user;
\q
```

### 4. Installation Redis (Cache)
```bash
sudo apt install redis-server -y
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test Redis
redis-cli ping  # Doit retourner PONG
```

### 5. Installation Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
sudo ufw allow 'Nginx Full'
```

### 6. Installation PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

## 📁 Déploiement de l'Application

### 1. Clonage du Projet
```bash
cd /var/www
sudo git clone https://github.com/votre-repo/parabellum-groups.git
sudo chown -R $USER:$USER parabellum-groups
cd parabellum-groups
```

### 2. Configuration Backend
```bash
cd Back-end

# Installation des dépendances
npm install

# Configuration environnement
cp .env.example .env
nano .env
```

**Fichier .env de production :**
```env
# Base de données
DATABASE_URL="postgresql://parabellum_user:votre_mot_de_passe@localhost:5432/parabellum_db"

# JWT
JWT_SECRET="votre-cle-jwt-super-securisee-256-bits"
JWT_REFRESH_SECRET="votre-cle-refresh-super-securisee-256-bits"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# Application
NODE_ENV="production"
PORT=3001
FRONTEND_URL="https://votre-domaine.com"
ALLOWED_ORIGINS="https://votre-domaine.com"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379

# Sécurité
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Entreprise
COMPANY_NAME="Parabellum Groups"
COMPANY_ADDRESS="Abidjan, Côte d'Ivoire"
COMPANY_PHONE="+225 07 07 07 07 07"
COMPANY_EMAIL="contact@parabellum.com"
```

### 3. Initialisation Base de Données
```bash
# Génération du client Prisma
npx prisma generate

# Application du schéma
npx prisma db push

# Données de démonstration
npm run db:seed

# Build de production
npm run build
```

### 4. Configuration Frontend
```bash
cd ../

# Installation des dépendances
npm install

# Configuration environnement
cp .env.example .env
nano .env
```

**Fichier .env frontend :**
```env
VITE_API_URL=https://votre-domaine.com/api/v1
VITE_APP_NAME="Parabellum Groups"
VITE_APP_VERSION="1.0.0"
```

### 5. Build Frontend
```bash
npm run build
```

## ⚙️ Configuration Nginx

### 1. Configuration du Site
```bash
sudo nano /etc/nginx/sites-available/parabellum
```

**Fichier de configuration Nginx :**
```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    
    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;
    
    # Certificats SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;
    
    # Configuration SSL sécurisée
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Headers de sécurité
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Frontend (React)
    location / {
        root /var/www/parabellum-groups/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache des assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API Backend
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Documentation API
    location /api-docs {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Logs
    access_log /var/log/nginx/parabellum_access.log;
    error_log /var/log/nginx/parabellum_error.log;
}
```

### 2. Activation du Site
```bash
sudo ln -s /etc/nginx/sites-available/parabellum /etc/nginx/sites-enabled/
sudo nginx -t  # Test de configuration
sudo systemctl reload nginx
```

## 🔐 Configuration SSL avec Let's Encrypt

### 1. Installation Certbot
```bash
sudo apt install snapd -y
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### 2. Génération du Certificat
```bash
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

### 3. Renouvellement Automatique
```bash
sudo crontab -e
# Ajouter cette ligne :
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔄 Configuration PM2

### 1. Fichier de Configuration
```bash
cd /var/www/parabellum-groups/Back-end
nano ecosystem.config.js
```

**Fichier ecosystem.config.js :**
```javascript
module.exports = {
  apps: [{
    name: 'parabellum-api',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/pm2/parabellum-error.log',
    out_file: '/var/log/pm2/parabellum-out.log',
    log_file: '/var/log/pm2/parabellum-combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

### 2. Démarrage de l'Application
```bash
# Créer les dossiers de logs
sudo mkdir -p /var/log/pm2
sudo chown $USER:$USER /var/log/pm2

# Démarrer l'application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔥 Configuration Firewall

### UFW (Uncomplicated Firewall)
```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 5432  # PostgreSQL (si accès externe nécessaire)
sudo ufw status
```

## 📊 Monitoring et Logs

### 1. Configuration des Logs
```bash
# Rotation des logs Nginx
sudo nano /etc/logrotate.d/nginx

# Logs PM2
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### 2. Monitoring avec PM2
```bash
# Monitoring en temps réel
pm2 monit

# Statut des processus
pm2 status

# Logs en temps réel
pm2 logs parabellum-api
```

## 🔄 Scripts de Déploiement

### 1. Script de Déploiement
```bash
nano deploy.sh
chmod +x deploy.sh
```

**Script deploy.sh :**
```bash
#!/bin/bash

echo "🚀 Déploiement Parabellum Groups"

# Variables
APP_DIR="/var/www/parabellum-groups"
BACKUP_DIR="/var/backups/parabellum"

# Sauvegarde
echo "📦 Sauvegarde de la base de données..."
sudo -u postgres pg_dump parabellum_db > $BACKUP_DIR/db_$(date +%Y%m%d_%H%M%S).sql

# Mise à jour du code
echo "📥 Mise à jour du code..."
cd $APP_DIR
git pull origin main

# Backend
echo "🔧 Mise à jour Backend..."
cd Back-end
npm install --production
npx prisma generate
npx prisma db push
npm run build

# Frontend
echo "🎨 Mise à jour Frontend..."
cd ..
npm install
npm run build

# Redémarrage des services
echo "🔄 Redémarrage des services..."
pm2 restart parabellum-api
sudo systemctl reload nginx

echo "✅ Déploiement terminé avec succès !"
```

### 2. Script de Sauvegarde
```bash
nano backup.sh
chmod +x backup.sh
```

**Script backup.sh :**
```bash
#!/bin/bash

BACKUP_DIR="/var/backups/parabellum"
DATE=$(date +%Y%m%d_%H%M%S)

# Créer le dossier de sauvegarde
mkdir -p $BACKUP_DIR

# Sauvegarde base de données
echo "📦 Sauvegarde base de données..."
sudo -u postgres pg_dump parabellum_db | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Sauvegarde fichiers uploads
echo "📁 Sauvegarde fichiers..."
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/parabellum-groups/Back-end/uploads/

# Sauvegarde configuration
echo "⚙️ Sauvegarde configuration..."
cp /var/www/parabellum-groups/Back-end/.env $BACKUP_DIR/env_$DATE.backup

# Nettoyage (garder 30 jours)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "✅ Sauvegarde terminée : $BACKUP_DIR"
```

### 3. Cron Jobs
```bash
sudo crontab -e
```

**Tâches automatisées :**
```cron
# Sauvegarde quotidienne à 2h du matin
0 2 * * * /var/www/parabellum-groups/backup.sh

# Nettoyage des logs PM2 hebdomadaire
0 3 * * 0 pm2 flush

# Redémarrage hebdomadaire (dimanche 4h)
0 4 * * 0 pm2 restart parabellum-api
```

## 🔒 Sécurisation du Serveur

### 1. Configuration SSH
```bash
sudo nano /etc/ssh/sshd_config
```

**Modifications recommandées :**
```
Port 2222                    # Changer le port par défaut
PermitRootLogin no          # Désactiver root login
PasswordAuthentication no   # Utiliser uniquement les clés SSH
PubkeyAuthentication yes
```

### 2. Fail2Ban (Protection contre les attaques)
```bash
sudo apt install fail2ban -y
sudo nano /etc/fail2ban/jail.local
```

**Configuration Fail2Ban :**
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = 2222

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
```

### 3. Configuration Firewall Avancée
```bash
# Règles spécifiques
sudo ufw deny 3001  # Bloquer accès direct à l'API
sudo ufw allow 2222  # SSH sur port personnalisé
sudo ufw allow from 10.0.0.0/8 to any port 5432  # PostgreSQL réseau local uniquement
```

## 📈 Optimisations Performance

### 1. Configuration PostgreSQL
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
```

**Optimisations recommandées :**
```conf
# Mémoire
shared_buffers = 1GB
effective_cache_size = 3GB
work_mem = 64MB

# Connexions
max_connections = 200

# Logs
log_min_duration_statement = 1000
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```

### 2. Configuration Redis
```bash
sudo nano /etc/redis/redis.conf
```

**Optimisations :**
```conf
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### 3. Optimisation Nginx
```bash
sudo nano /etc/nginx/nginx.conf
```

**Configuration performance :**
```nginx
worker_processes auto;
worker_connections 1024;

http {
    # Compression
    gzip on;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # Cache
    open_file_cache max=1000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    
    # Buffers
    client_body_buffer_size 128k;
    client_max_body_size 10m;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;
    
    # Timeouts
    client_body_timeout 12;
    client_header_timeout 12;
    keepalive_timeout 15;
    send_timeout 10;
}
```

## 🔍 Monitoring et Alertes

### 1. Monitoring PM2
```bash
# Installation du module de monitoring
pm2 install pm2-server-monit

# Configuration des alertes
pm2 set pm2-server-monit:monitoring true
pm2 set pm2-server-monit:refresh_rate 5000
```

### 2. Script de Health Check
```bash
nano healthcheck.sh
chmod +x healthcheck.sh
```

**Script healthcheck.sh :**
```bash
#!/bin/bash

# Variables
API_URL="http://localhost:3001/api/health"
LOG_FILE="/var/log/parabellum/healthcheck.log"
EMAIL="admin@parabellum.com"

# Test API
response=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)

if [ $response -eq 200 ]; then
    echo "$(date): API OK" >> $LOG_FILE
else
    echo "$(date): API DOWN - Code: $response" >> $LOG_FILE
    # Redémarrage automatique
    pm2 restart parabellum-api
    # Alerte email (optionnel)
    echo "API Parabellum DOWN - Redémarrage automatique effectué" | mail -s "Alerte Parabellum" $EMAIL
fi
```

### 3. Cron Health Check
```bash
# Vérification toutes les 5 minutes
*/5 * * * * /var/www/parabellum-groups/healthcheck.sh
```

## 🔄 Procédures de Maintenance

### 1. Mise à Jour de l'Application
```bash
# Utiliser le script de déploiement
./deploy.sh
```

### 2. Sauvegarde Manuelle
```bash
# Utiliser le script de sauvegarde
./backup.sh
```

### 3. Restauration
```bash
# Restauration base de données
sudo -u postgres psql parabellum_db < /var/backups/parabellum/db_YYYYMMDD_HHMMSS.sql

# Restauration fichiers
tar -xzf /var/backups/parabellum/uploads_YYYYMMDD_HHMMSS.tar.gz -C /
```

## 🚨 Dépannage

### Problèmes Courants

#### API ne répond pas
```bash
# Vérifier le statut PM2
pm2 status

# Vérifier les logs
pm2 logs parabellum-api

# Redémarrer si nécessaire
pm2 restart parabellum-api
```

#### Base de données inaccessible
```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql

# Vérifier les connexions
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"

# Redémarrer si nécessaire
sudo systemctl restart postgresql
```

#### Nginx erreur 502
```bash
# Vérifier la configuration
sudo nginx -t

# Vérifier les logs
sudo tail -f /var/log/nginx/error.log

# Redémarrer Nginx
sudo systemctl restart nginx
```

## 📞 Support

### Contacts Techniques
- **Email** : dev@parabellum.com
- **Documentation** : https://docs.parabellum.com
- **Support** : +225 07 07 07 07 07

### Ressources
- **Logs Application** : `/var/www/parabellum-groups/Back-end/logs/`
- **Logs Nginx** : `/var/log/nginx/`
- **Logs PM2** : `pm2 logs`
- **Monitoring** : `pm2 monit`

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2025  
**Équipe DevOps** : Parabellum Groups