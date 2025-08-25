# 🚀 GUIDE D'INSTALLATION - PARABELLUM GROUPS

## 📋 Prérequis

### Système
- **OS** : Ubuntu 20.04+ / Windows 10+ / macOS 10.15+
- **RAM** : 8 GB minimum
- **Stockage** : 10 GB libres
- **Réseau** : Connexion internet stable

### Logiciels Requis
- **Node.js** : Version 18 ou supérieure
- **PostgreSQL** : Version 14 ou supérieure
- **Git** : Pour le clonage du projet
- **npm** : Gestionnaire de paquets (inclus avec Node.js)

## 🛠️ Installation Locale (Développement)

### 1. Clonage du Projet
```bash
git clone https://github.com/votre-organisation/parabellum-groups.git
cd parabellum-groups
```

### 2. Configuration Base de Données
```bash
# Connexion PostgreSQL
sudo -u postgres psql

# Création de la base
CREATE DATABASE parabellum_dev;
CREATE USER parabellum_dev WITH PASSWORD 'dev_password_123';
GRANT ALL PRIVILEGES ON DATABASE parabellum_dev TO parabellum_dev;
\q
```

### 3. Configuration Backend
```bash
cd Back-end

# Installation des dépendances
npm install

# Configuration environnement
cp .env.example .env
nano .env
```

**Fichier .env développement :**
```env
DATABASE_URL="postgresql://parabellum_dev:dev_password_123@localhost:5432/parabellum_dev"
JWT_SECRET="dev-jwt-secret-change-in-production"
JWT_REFRESH_SECRET="dev-refresh-secret-change-in-production"
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:5173"
ALLOWED_ORIGINS="http://localhost:5173"
```

### 4. Initialisation Base de Données
```bash
# Génération du client Prisma
npx prisma generate

# Application du schéma
npx prisma db push

# Données de test
npm run db:seed
```

### 5. Démarrage Backend
```bash
npm run dev
```

### 6. Configuration Frontend
```bash
# Nouveau terminal
cd ../

# Installation des dépendances
npm install

# Configuration environnement
cp .env.example .env
nano .env
```

**Fichier .env frontend :**
```env
VITE_API_URL=http://localhost:3001/api/v1
VITE_APP_NAME="Parabellum Groups"
VITE_APP_VERSION="1.0.0"
```

### 7. Démarrage Frontend
```bash
npm run dev
```

## 🌐 Accès à l'Application

### URLs de Développement
- **Frontend** : http://localhost:5173
- **API** : http://localhost:3001/api/v1
- **Documentation API** : http://localhost:3001/api-docs

### Comptes de Test
| Rôle | Email | Mot de passe | Permissions |
|------|-------|--------------|-------------|
| DG | dg@parabellum.com | password123 | Validation finale |
| Admin | admin@parabellum.com | password123 | Accès complet |
| Resp. Commercial | resp.commercial@parabellum.com | password123 | Gestion service |
| Commercial | commercial@parabellum.com | password123 | Création devis |
| Comptable | comptable@parabellum.com | password123 | Gestion financière |

## 🔧 Configuration Avancée

### Redis (Cache - Optionnel)
```bash
# Installation Redis
sudo apt install redis-server

# Configuration
sudo nano /etc/redis/redis.conf
# Décommenter : requirepass your_redis_password

# Redémarrage
sudo systemctl restart redis-server

# Test
redis-cli
AUTH your_redis_password
ping  # Doit retourner PONG
```

### Variables Redis dans .env
```env
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD="your_redis_password"
ENABLE_CACHE=true
```

## 🐳 Installation avec Docker

### 1. Fichier docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: parabellum_db
      POSTGRES_USER: parabellum_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass redis_password
    ports:
      - "6379:6379"

  backend:
    build: ./Back-end
    environment:
      DATABASE_URL: postgresql://parabellum_user:secure_password@postgres:5432/parabellum_db
      REDIS_HOST: redis
      REDIS_PASSWORD: redis_password
      NODE_ENV: production
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis

  frontend:
    build: .
    environment:
      VITE_API_URL: http://localhost:3001/api/v1
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 2. Dockerfiles

**Backend Dockerfile :**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

**Frontend Dockerfile :**
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
```

### 3. Démarrage Docker
```bash
docker-compose up -d
```

## 🔍 Vérification Installation

### 1. Tests Backend
```bash
cd Back-end

# Test de connexion DB
npm run db:test

# Test des endpoints
curl http://localhost:3001/api/health
```

### 2. Tests Frontend
```bash
# Build de production
npm run build

# Preview du build
npm run preview
```

### 3. Tests d'Intégration
```bash
# Test complet du workflow
npm run test:e2e
```

## 🚨 Résolution de Problèmes

### Erreurs Courantes

#### Port déjà utilisé
```bash
# Trouver le processus
lsof -i :3001
lsof -i :5173

# Tuer le processus
kill -9 PID
```

#### Erreur de connexion PostgreSQL
```bash
# Vérifier le statut
sudo systemctl status postgresql

# Redémarrer si nécessaire
sudo systemctl restart postgresql

# Vérifier les logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

#### Erreur Prisma
```bash
# Régénérer le client
npx prisma generate

# Reset de la base (ATTENTION : perte de données)
npx prisma db push --force-reset
npm run db:seed
```

#### Erreur de permissions
```bash
# Vérifier les permissions des fichiers
ls -la

# Corriger si nécessaire
sudo chown -R $USER:$USER .
chmod +x scripts/*.sh
```

## 📚 Ressources Utiles

### Documentation
- **React** : https://react.dev
- **Prisma** : https://prisma.io/docs
- **Tailwind** : https://tailwindcss.com/docs
- **Express** : https://expressjs.com

### Outils de Développement
- **VS Code** : Extensions recommandées
  - Prisma
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Thunder Client (test API)

### Commandes Utiles
```bash
# Logs en temps réel
npm run dev:logs

# Reset complet
npm run reset:all

# Tests avec coverage
npm run test:coverage

# Analyse du bundle
npm run analyze
```

## 🔄 Mise à Jour

### 1. Mise à Jour des Dépendances
```bash
# Vérifier les versions obsolètes
npm outdated

# Mise à jour sécurisée
npm update

# Mise à jour majeure (avec précaution)
npx npm-check-updates -u
npm install
```

### 2. Migration Base de Données
```bash
# Créer une migration
npx prisma migrate dev --name nom_migration

# Appliquer en production
npx prisma migrate deploy
```

### 3. Sauvegarde Avant Mise à Jour
```bash
# Sauvegarde DB
pg_dump parabellum_dev > backup_$(date +%Y%m%d).sql

# Sauvegarde code
git stash
git pull origin main
```

---

**Support** : dev@parabellum.com  
**Documentation** : https://docs.parabellum.com  
**Version** : 1.0.0