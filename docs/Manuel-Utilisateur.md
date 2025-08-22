# Manuel Utilisateur - Logiciel de Facturation Parabellum

## 🎯 Introduction

Bienvenue dans le logiciel de facturation Parabellum Groups ! Ce manuel vous guide dans l'utilisation de toutes les fonctionnalités selon votre rôle dans l'entreprise.

## 🔑 Première Connexion

### Accès à l'Application
1. Ouvrez votre navigateur web
2. Accédez à l'URL : `http://localhost:5173` (développement)
3. Vous arrivez sur la page de connexion

### Connexion
1. Saisissez votre **email professionnel**
2. Entrez votre **mot de passe**
3. Cliquez sur **"Se connecter"**

### Comptes de Démonstration
Pour tester l'application, utilisez ces comptes :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Directeur Général | dg@parabellum.com | password123 |
| Responsable Commercial | resp.commercial@parabellum.com | password123 |
| Commercial | commercial@parabellum.com | password123 |
| Comptable | comptable@parabellum.com | password123 |

## 🏠 Tableau de Bord

Après connexion, vous accédez au **tableau de bord** adapté à votre rôle :

### Dashboard Directeur Général
- **Vue globale** de tous les services
- **Indicateurs consolidés** : CA, factures, clients
- **Graphiques d'évolution** du chiffre d'affaires
- **Devis en attente** de validation finale
- **Activité récente** de l'entreprise

### Dashboard Responsable de Service
- **Indicateurs de son service** uniquement
- **Équipe et performance** du service
- **Devis à valider** de ses employés
- **Clients du service**

### Dashboard Employé
- **Ses propres indicateurs** : devis créés, factures
- **Devis en cours** de validation
- **Clients assignés**
- **Objectifs personnels**

### Dashboard Comptable
- **Factures validées** en attente de paiement
- **Paiements reçus** du mois
- **Dépenses** et trésorerie
- **Créances clients**

## 👥 Gestion des Clients

### Accéder aux Clients
1. Cliquez sur **"Clients"** dans le menu latéral
2. Vous voyez la liste de vos clients (filtrée par service si nécessaire)

### Créer un Nouveau Client
1. Cliquez sur **"Nouveau Client"**
2. Remplissez le formulaire :
   - **Type** : Entreprise ou Particulier
   - **Nom/Raison sociale** (obligatoire)
   - **Email et téléphone**
   - **Adresse de facturation** (obligatoire)
3. Ajoutez des **adresses supplémentaires** si nécessaire
4. Configurez les **conditions commerciales**
5. Cliquez sur **"Créer le client"**

### Modifier un Client
1. Dans la liste, cliquez sur l'icône **"Modifier"** (crayon)
2. Modifiez les informations nécessaires
3. Cliquez sur **"Mettre à jour"**

### Consulter un Client
1. Cliquez sur l'icône **"Voir"** (œil) ou sur le nom du client
2. Consultez :
   - **Informations complètes**
   - **Statistiques** (factures, CA, impayés)
   - **Historique** des factures et devis
   - **Adresses** enregistrées

## 📄 Gestion des Devis

### Créer un Devis
1. Allez dans **"Devis"** → **"Nouveau Devis"**
2. **Sélectionnez le client** destinataire
3. **Ajoutez des articles** :
   - Sélectionnez un produit du catalogue OU
   - Saisissez une description personnalisée
   - Indiquez quantité et prix unitaire
   - Le système calcule automatiquement les totaux
4. **Personnalisez** :
   - Date du devis et validité
   - Conditions commerciales
   - Notes internes
5. **Sauvegardez** en brouillon

### Soumettre un Devis pour Validation
1. Depuis votre devis en brouillon
2. Cliquez sur **"Soumettre pour validation"**
3. Le devis est envoyé à votre responsable de service
4. Vous recevrez une notification de la décision

### Valider un Devis (Responsables)
1. Accédez à **"Validations"** dans le menu
2. Consultez les **devis en attente**
3. Pour chaque devis :
   - **Voir les détails** complets
   - **Approuver** : Le devis passe au DG
   - **Rejeter** : Avec commentaires obligatoires
   - **Demander des modifications**

### Validation Finale (Directeur Général)
1. Les devis approuvés par les responsables arrivent automatiquement
2. **Validation finale** avant envoi au client
3. Une fois approuvé, le devis peut être envoyé et converti en facture

## 🧾 Gestion des Factures

### Convertir un Devis en Facture
1. Depuis un devis **"Approuvé par DG"** et **"Accepté par client"**
2. Cliquez sur **"Convertir en facture"**
3. La facture est générée automatiquement
4. Vous pouvez la modifier avant envoi

### Créer une Facture Directe
1. **"Factures"** → **"Nouvelle Facture"**
2. Même processus que pour les devis
3. La facture est immédiatement définitive

### Envoyer une Facture
1. Depuis une facture en brouillon
2. Cliquez sur **"Envoyer au client"**
3. La facture est envoyée par email automatiquement
4. Le statut passe à **"Envoyée"**

### Suivre les Paiements
1. Les factures impayées sont **automatiquement identifiées**
2. Consultez les **échéances** dans le dashboard
3. Les **relances automatiques** sont programmées

## 💳 Gestion des Paiements

### Enregistrer un Paiement
1. **"Paiements"** → **"Nouveau Paiement"**
2. **Sélectionnez le client**
3. **Saisissez le montant** reçu
4. **Choisissez le mode** de paiement
5. **Affectez aux factures** concernées
6. Le système met à jour automatiquement les soldes

### Paiements Partiels
- Un paiement peut être **réparti** sur plusieurs factures
- Une facture peut être **payée en plusieurs fois**
- Le système **calcule automatiquement** les soldes restants

## 👨‍💼 Gestion des Employés

### Accéder à la Gestion RH
1. Menu **"Employés"** (réservé DG et Admin)
2. Vue d'ensemble de tous les employés

### Créer un Employé
1. **"Nouvel Employé"**
2. **Informations personnelles** : nom, prénom, contact
3. **Adresse** complète
4. **Informations professionnelles** :
   - Poste et département
   - Date d'embauche
   - Type de contrat (CDI, CDD, Stage, Freelance)
   - Salaire de base
5. **Informations bancaires** pour les virements

### Gérer les Salaires
1. Depuis la fiche employé → **"Gérer les salaires"**
2. **"Nouveau Salaire"** :
   - Date de paiement
   - Période de paie (boutons mois courant/précédent)
   - Salaire brut (pré-rempli)
   - Cotisations sociales (calculées automatiquement)
   - Impôts prélevés
   - Primes et déductions
   - **Salaire net calculé automatiquement**

### Gérer les Congés
1. Depuis la fiche employé → **"Gérer les congés"**
2. **"Nouveau Congé"** :
   - Type : Payés, Sans solde, Maladie, Formation
   - Dates de début et fin
   - **Durée calculée automatiquement**
   - Motif et commentaires
   - Statut d'approbation

## 💸 Gestion des Dépenses

### Enregistrer une Dépense
1. **"Dépenses"** → **"Nouvelle Dépense"**
2. **Sélectionnez le fournisseur** (optionnel)
3. **Catégorie** : Fournitures, Services, Déplacements...
4. **Montants** :
   - Montant HT
   - TVA (si applicable)
   - Total TTC calculé automatiquement
5. **Dates** : dépense et paiement
6. **Mode de paiement** et justificatifs

### Gérer les Fournisseurs
1. **"Fournisseurs"** → **"Nouveau Fournisseur"**
2. **Informations générales** et contact
3. **Adresse** et informations fiscales
4. **Coordonnées bancaires** pour les paiements
5. **Délai de paiement** négocié

## 📊 Comptabilité

### Dashboard Comptable
- **Trésorerie** : Solde et évolution
- **Créances clients** : À échéance et échues
- **Dettes fournisseurs** : Suivi des paiements
- **TVA à payer** : Calcul automatique

### Suivi de Trésorerie
- **Graphiques d'évolution** des flux
- **Prévisions** basées sur les échéances
- **Alertes** sur les seuils critiques

## ⚙️ Paramètres

### Paramètres Entreprise (DG/Admin)
1. **"Paramètres"** → Onglet **"Entreprise"**
2. Modifiez :
   - Informations légales (SIRET, TVA)
   - Coordonnées et adresse
   - Logo et identité visuelle

### Paramètres Facturation
1. Onglet **"Facturation"**
2. Configurez :
   - Préfixes des numéros (FAC-, DEV-, PAY-)
   - Délais de paiement par défaut
   - Taux de TVA et pénalités
   - Mentions légales

### Paramètres Email
1. Onglet **"Email"**
2. Configuration SMTP :
   - Serveur et port
   - Identifiants de connexion
   - Test de la configuration

## 🔍 Recherche et Filtres

### Recherche Globale
- **Barre de recherche** disponible sur toutes les listes
- Recherche dans **tous les champs** pertinents
- **Suggestions automatiques** pendant la saisie

### Filtres Avancés
- **Bouton "Filtres"** sur chaque liste
- **Filtres multiples** combinables
- **Sauvegarde** des filtres favoris
- **Reset** rapide des filtres

## 📱 Utilisation Mobile

### Navigation Mobile
- **Menu hamburger** en haut à gauche
- **Navigation par onglets** en bas d'écran
- **Swipe gestures** pour les actions rapides

### Fonctionnalités Optimisées
- **Consultation** des données en déplacement
- **Validation** des devis sur mobile
- **Enregistrement** rapide des paiements
- **Notifications push** (à venir)

## 🆘 Aide et Support

### Aide Contextuelle
- **Points d'interrogation** sur les champs complexes
- **Tooltips** explicatifs
- **Messages d'erreur** détaillés

### Raccourcis Clavier
- `Ctrl + N` : Nouveau (client, devis, facture)
- `Ctrl + S` : Sauvegarder
- `Ctrl + F` : Rechercher
- `Esc` : Fermer les modales

### Support Technique
- **Email** : support@parabellum.com
- **Documentation** : Menu "Aide"
- **Logs d'erreur** : Envoyés automatiquement

## 🔒 Sécurité et Bonnes Pratiques

### Mots de Passe
- **Minimum 8 caractères**
- **Changement régulier** recommandé
- **Déconnexion automatique** après inactivité

### Données Sensibles
- **Sauvegarde automatique** quotidienne
- **Chiffrement** des données sensibles
- **Accès tracé** dans les logs d'audit

### Permissions
- **Accès limité** selon votre rôle
- **Données filtrées** par service
- **Actions autorisées** uniquement

---

## 📋 Checklist de Démarrage

### Pour les Directeurs/Administrateurs
- [ ] Configurer les informations entreprise
- [ ] Créer les utilisateurs et affecter les services
- [ ] Paramétrer la facturation (préfixes, TVA)
- [ ] Configurer l'envoi d'emails
- [ ] Importer les clients existants

### Pour les Responsables de Service
- [ ] Vérifier les employés de son service
- [ ] Configurer les produits/services
- [ ] Former l'équipe au workflow de validation
- [ ] Définir les objectifs de service

### Pour les Employés
- [ ] Se familiariser avec l'interface
- [ ] Créer ses premiers clients
- [ ] Tester la création de devis
- [ ] Comprendre le processus de validation

### Pour les Comptables
- [ ] Vérifier les paramètres de TVA
- [ ] Configurer les fournisseurs
- [ ] Tester l'enregistrement des paiements
- [ ] Explorer les rapports financiers

---

**Bonne utilisation du logiciel Parabellum Groups !** 🚀

Pour toute question, n'hésitez pas à consulter cette documentation ou à contacter le support technique.