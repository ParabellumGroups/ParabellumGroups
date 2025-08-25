# Guide d'Installation - Logiciel de Facturation Parabellum

## 🚀 Installation Rapide

### Prérequis Système
- **Node.js** : Version 18.0.0 ou supérieure
- **pnpm** : Version 8.0.0 ou supérieure
- **Git** : Pour le clonage du repository
- **Navigateur moderne** : Chrome, Firefox, Safari, Edge

### Vérification des Prérequis
```bash
# Vérifier Node.js
node --version
# Doit afficher v18.0.0 ou supérieur

# Vérifier ppnpm
pnpm --version
# Doit afficher 8.0.0 ou supérieur

# Vérifier Git
git --version
```

## 📥 Installation du Projet

### 1. Clonage du Repository
```bash
git clone https://github.com/parabellum-groups/facturation-app.git
cd facturation-app
```

### 2. Installation Backend

```bash
# Naviguer vers le dossier backend
cd backend

# Installer les dépendances
pnpm install

# Copier le fichier d'environnement
cp .env.example .env

# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate dev

# Insérer les données de démonstration
pnpm run seed

# Démarrer le serveur de développement
pnpm run dev
```

Le backend sera accessible sur `http://localhost:3001`

### 3. Installation Frontend

```bash
# Ouvrir un nouveau terminal et naviguer vers le frontend
cd frontend

# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## ⚙️ Configuration

### Configuration Backend (.env)

Éditez le fichier `backend/.env` avec vos paramètres :

```bash
# Base de données
DATABASE_URL="file:./database.sqlite"

# JWT - IMPORTANT: Changez ces valeurs en production
JWT_SECRET="votre-secret-jwt-super-securise-changez-moi"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# Serveur
PORT=3001
NODE_ENV="development"

# Email (Optionnel - pour l'envoi de factures)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-mot-de-passe-app"

# Informations entreprise
COMPANY_NAME="Parabellum Groups"
COMPANY_EMAIL="contact@parabellum.com"
COMPANY_PHONE="+33 1 23 45 67 89"
```

### Configuration Frontend (.env)

Créez un fichier `frontend/.env` :

```bash
VITE_API_URL="http://localhost:3001/api/v1"
VITE_APP_NAME="Parabellum Facturation"
```

## 🗄️ Base de Données

### Initialisation
```bash
cd backend

# Générer le client Prisma
npx prisma generate

# Créer et appliquer les migrations
npx prisma migrate dev --name init

# Insérer les données de test
pnpm run seed
```

### Visualisation
```bash
# Ouvrir Prisma Studio pour visualiser la base
npx prisma studio
```

Accessible sur `http://localhost:5555`

### Reset de la Base (si nécessaire)
```bash
# Supprimer la base et recréer
rm database.sqlite
npx prisma migrate dev
pnpm run seed
```

## 👤 Comptes de Démonstration

Après le seeding, ces comptes sont disponibles :

| Rôle | Email | Mot de passe | Service |
|------|-------|--------------|---------|
| **Directeur Général** | dg@parabellum.com | password123 | Direction |
| **Administrateur** | admin@parabellum.com | password123 | Direction |
| **Resp. Commercial** | resp.commercial@parabellum.com | password123 | Commercial |
| **Commercial** | commercial@parabellum.com | password123 | Commercial |
| **Resp. Progitek** | resp.progitek@parabellum.com | password123 | Progitek |
| **Développeur** | dev@parabellum.com | password123 | Progitek |
| **Comptable** | comptable@parabellum.com | password123 | Comptabilité |

## 🔧 Scripts Disponibles

### Backend
```bash
pnpm run dev          # Serveur de développement avec hot-reload
pnpm run build        # Build pour la production
pnpm run start        # Démarrage en production
pnpm run test         # Exécution des tests
pnpm run migrate      # Migrations de base de données
pnpm run generate     # Génération du client Prisma
pnpm run seed         # Insertion des données de test
```

### Frontend
```bash
pnpm run dev          # Serveur de développement
pnpm run build        # Build pour la production
pnpm run preview      # Aperçu du build de production
pnpm run lint         # Vérification du code
```

## 🐛 Résolution des Problèmes

### Erreur de Port Occupé
```bash
# Changer le port backend dans .env
PORT=3002

# Ou tuer le processus occupant le port
npx kill-port 3001
```

### Erreur de Base de Données
```bash
# Régénérer la base
cd backend
rm database.sqlite
npx prisma migrate dev
pnpm run seed
```

### Erreur de Dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
pnpm install
```

### Erreur de CORS
Vérifiez que l'URL frontend est correcte dans la configuration CORS du backend.

## 🚀 Déploiement en Production

### 1. Préparation
```bash
# Build du frontend
cd frontend
pnpm run build

# Build du backend
cd ../backend
pnpm run build
```

### 2. Variables d'Environnement Production
```bash
# Backend production
NODE_ENV="production"
JWT_SECRET="secret-production-tres-securise"
DATABASE_URL="file:./production.sqlite"
PORT=3001

# Configuration email production
SMTP_HOST="votre-smtp-production.com"
SMTP_USER="production@parabellum.com"
SMTP_PASS="mot-de-passe-securise"
```

### 3. Démarrage Production
```bash
# Backend
cd backend
pnpm run start

# Frontend (servir les fichiers statiques)
cd frontend
pnpm run preview
# Ou utiliser un serveur web comme nginx
```

## 📊 Monitoring et Logs

### Logs Backend
Les logs sont stockés dans `backend/logs/` :
- `combined.log` : Tous les logs
- `error.log` : Erreurs uniquement

### Monitoring de la Base
```bash
# Taille de la base
ls -lh backend/database.sqlite

# Statistiques Prisma
cd backend
npx prisma db seed
```

## 🔄 Mise à Jour

### Mise à Jour des Dépendances
```bash
# Backend
cd backend
pnpm update

# Frontend
cd frontend
pnpm update
```

### Migrations de Base
```bash
cd backend
npx prisma migrate dev
```

## 📞 Support

### Logs de Debug
```bash
# Activer les logs détaillés
DEBUG=* pnpm run dev
```

### Vérification de l'Installation
```bash
# Test de l'API
curl http://localhost:3001/health

# Test du frontend
curl http://localhost:5173
```

### Contacts Support
- **Email** : support@parabellum.com
- **Documentation** : Dossier `docs/`
- **Issues** : Repository GitHub

---

**Installation réussie !** 🎉

Votre logiciel de facturation Parabellum Groups est maintenant opérationnel. Connectez-vous avec l'un des comptes de démonstration pour explorer toutes les fonctionnalités.