# Modélisation de la Base de Données - Logiciel de Facturation

## Introduction

Cette section présente la modélisation complète de la base de données SQLite pour le logiciel de facturation. Le schéma de données est conçu pour supporter toutes les fonctionnalités identifiées dans les spécifications fonctionnelles tout en garantissant l'intégrité, la performance et la scalabilité du système.

## Principes de Conception

### Normalisation
La base de données respecte les principes de normalisation jusqu'à la troisième forme normale (3NF) pour éviter la redondance des données et garantir la cohérence. Certaines dénormalisations contrôlées sont appliquées pour optimiser les performances des requêtes fréquentes.

### Intégrité Référentielle
Toutes les relations entre tables sont protégées par des contraintes de clés étrangères avec gestion appropriée des suppressions en cascade ou restriction selon la logique métier.

### Évolutivité
Le schéma est conçu pour permettre l'ajout de nouvelles fonctionnalités sans modification majeure de la structure existante. Des champs de métadonnées extensibles sont prévus pour les évolutions futures.

## Tables Prin### Table `services` - Gestion des Services

Cette table définit les différents services au sein de l'entreprise (Commercial, Progitek, Ressources Humaines, Comptabilité, Direction Générale, etc.).

```sql
CREATE TABLE services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Table `users` - Gestion des Utilisateurs

Cette table centralise tous les utilisateurs du système avec leurs informations d'authentification et de profil, incluant leur appartenance à un service.

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM(\'admin\', \'general_director\', \'service_manager\', \'employee\', \'accountant\') DEFAULT \'employee\',
    service_id INTEGER, -- Lien vers la table services
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    preferences JSON,
    avatar_url VARCHAR(500),
    FOREIGN KEY (service_id) REFERENCES services(id)
);
```
**Champs Clés** :
- `id` : Identifiant unique auto-incrémenté
- `email` : Adresse email unique servant d'identifiant de connexion
- `password_hash` : Mot de passe haché avec bcrypt
- `role` : Rôle définissant les permissions d'accès
- `preferences` : Préférences utilisateur stockées en JSON
- `is_active` : Statut actif/inactif pour désactivation temporaire

### Table `companies` - Informations de l'Entreprise

Cette table contient les informations légales et commerciales de l'entreprise utilisatrice du logiciel.

```sql
CREATE TABLE companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    siret VARCHAR(14),
    vat_number VARCHAR(20),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    postal_code VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'France',
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    bank_name VARCHAR(255),
    bank_iban VARCHAR(34),
    bank_bic VARCHAR(11),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`### Table `customers` - Gestion des Clients

Cette table stocke toutes les informations des clients avec support des adresses multiples, et peut être liée à un service spécifique.

```sql
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_number VARCHAR(20) UNIQUE NOT NULL,
    type ENUM(\'individual\', \'company\') DEFAULT \'company\',
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    siret VARCHAR(14),
    vat_number VARCHAR(20),
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    website VARCHAR(255),
    payment_terms INTEGER DEFAULT 30,
    payment_method ENUM(\'transfer\', \'check\', \'card\', \'cash\') DEFAULT \'transfer\',
    credit_limit DECIMAL(10,2) DEFAULT 0,
    discount_rate DECIMAL(5,2) DEFAULT 0,
    category VARCHAR(100),
    tags JSON,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    service_id INTEGER, -- Lien vers la table services pour l\'appartenance du client à un service
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (service_id) REFERENCES services(id)
);
````customer_addresses` - Adresses des Clients

Table séparée pour gérer les adresses multiples (facturation, livraison) des clients.

```sql
CREATE TABLE customer_addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    type ENUM('billing', 'shipping', 'other') NOT NULL,
    name VARCHAR(255),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    postal_code VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'France',
    is_default BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
```

### Table `products` - Catalogue Produits/Services

Cette table centralise tous les produits et services proposés par l'entreprise.

```sql
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('product', 'service', 'subscription') DEFAULT 'product',
    category VARCHAR(100),
    unit VARCHAR(20) DEFAULT 'pièce',
    price_ht DECIMAL(10,2) NOT NULL,
    vat_rate DECIMAL(5,2) DEFAULT 20.00,
    cost_price DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    stock_alert_threshold INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    weight DECIMAL(8,3),
    dimensions VARCHAR(50),
    image_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Table `product_prices` - Tarification Multiple

Table pour gérer différents niveaux de prix selon les catégories de clients.

```sql
CREATE TABLE product_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    customer_category VARCHAR(100),
    min_quantity INTEGER DEFAULT 1,
    price_ht DECIMAL(10,2) NOT NULL,
    valid_from DATE,
    valid_until DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE### Table `quotes` - Gestion des Devis

Cette table stocke tous les devis avec leur statut et leurs conditions, intégrant le workflow de validation par service et hiérarchie.

```sql
CREATE TABLE quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL,
    customer_address_id INTEGER,
    status ENUM(\'draft\', \'submitted_for_service_approval\', \'approved_by_service_manager\', \'rejected_by_service_manager\', \'submitted_for_dg_approval\', \'approved_by_dg\', \'rejected_by_dg\', \'accepted_by_client\', \'rejected_by_client\', \'expired\') DEFAULT \'draft\',
    quote_date DATE NOT NULL,
    valid_until DATE NOT NULL,
    subtotal_ht DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_vat DECIMAL(10,2) DEFAULT 0,
    total_ttc DECIMAL(10,2) DEFAULT 0,
    terms TEXT,
    notes TEXT,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sent_at DATETIME,
    submitted_for_service_approval_at DATETIME,
    service_manager_approved_by INTEGER, -- ID de l\'utilisateur (responsable de service) qui a approuvé
    service_manager_approval_date DATETIME,
    service_manager_comments TEXT,
    dg_approved_by INTEGER, -- ID de l\'utilisateur (Directeur Général) qui a approuvé
    dg_approval_date DATETIME,
    dg_comments TEXT,
    accepted_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (customer_address_id) REFERENCES customer_addresses(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (service_manager_approved_by) REFERENCES users(id),
    FOREIGN KEY (dg_approved_by) REFERENCES users(id)
);
```## Table `quote_items` - Lignes de Devis

Table détaillant les produits/services inclus dans chaque devis.

```sql
CREATE TABLE quote_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote_id INTEGER NOT NULL,
    product_id INTEGER,
    description VARCHAR(500) NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    unit_price_ht DECIMAL(10,2) NOT NULL,
    discount_rate DECIMAL(5,2) DEFAULT 0,
    vat_rate DECIMAL(5,2) NOT NULL,
    total_ht DECIMAL(10,2) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Table `invoices` - Gestion des Factures

Table principale pour toutes les factures émises.

```sql
CREATE TABLE invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL,
    customer_address_id INTEGER,
    quote_id INTEGER,
    type ENUM('invoice', 'credit_note', 'proforma') DEFAULT 'invoice',
    status ENUM('draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled') DEFAULT 'draft',
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal_ht DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_vat DECIMAL(10,2) DEFAULT 0,
    total_ttc DECIMAL(10,2) DEFAULT 0,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    balance_due DECIMAL(10,2) DEFAULT 0,
    payment_terms INTEGER DEFAULT 30,
    late_fee_rate DECIMAL(5,2) DEFAULT 0,
    terms TEXT,
    notes TEXT,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sent_at DATETIME,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (customer_address_id) REFERENCES customer_addresses(id),
    FOREIGN KEY (quote_id) REFERENCES quotes(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Table `invoice_items` - Lignes de Factures

Table détaillant les produits/services facturés.

```sql
CREATE TABLE invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    product_id INTEGER,
    description VARCHAR(500) NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    unit_price_ht DECIMAL(10,2) NOT NULL,
    discount_rate DECIMAL(5,2) DEFAULT 0,
    vat_rate DECIMAL(5,2) NOT NULL,
    total_ht DECIMAL(10,2) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Table `payments` - Suivi des Paiements

Cette table enregistre tous les paiements reçus avec leur affectation aux factures.

```sql
CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payment_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('transfer', 'check', 'card', 'cash', 'other') NOT NULL,
    reference VARCHAR(100),
    notes TEXT,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Table `payment_allocations` - Affectation des Paiements

Table de liaison pour affecter les paiements aux factures (gestion des paiements partiels).

```sql
CREATE TABLE payment_allocations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payment_id INTEGER NOT NULL,
    invoice_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);
```

### Table `recurring_invoices` - Facturation Récurrente

Configuration des factures récurrentes pour les abonnements.

```sql
CREATE TABLE recurring_invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    frequency ENUM('monthly', 'quarterly', 'yearly') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    next_invoice_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    subtotal_ht DECIMAL(10,2) DEFAULT 0,
    total_vat DECIMAL(10,2) DEFAULT 0,
    total_ttc DECIMAL(10,2) DEFAULT 0,
    terms TEXT,
    notes TEXT,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Table `recurring_invoice_items` - Lignes de Facturation Récurrente

Détail des éléments facturés de manière récurrente.

```sql
CREATE TABLE recurring_invoice_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recurring_invoice_id INTEGER NOT NULL,
    product_id INTEGER,
    description VARCHAR(500) NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    unit_price_ht DECIMAL(10,2) NOT NULL,
    vat_rate DECIMAL(5,2) NOT NULL,
    total_ht DECIMAL(10,2) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (recurring_invoice_id) REFERENCES recurring_invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Table `reminders` - Gestion des Relances

Suivi des relances automatiques et manuelles pour les factures impayées.

```sql
CREATE TABLE reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    type ENUM('friendly', 'formal', 'final', 'legal') NOT NULL,
    sent_date DATE NOT NULL,
    due_date DATE,
    amount_due DECIMAL(10,2) NOT NULL,
    late_fees DECIMAL(10,2) DEFAULT 0,
    status ENUM('sent', 'read', 'paid', 'ignored') DEFAULT 'sent',
    email_subject VARCHAR(255),
    email_body TEXT,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Table `documents` - Gestion des Documents

Stockage des métadonnées des documents générés (PDF des factures, devis, etc.).

```sql
CREATE TABLE documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type ENUM('quote', 'invoice', 'credit_note', 'reminder', 'report') NOT NULL,
    reference_id INTEGER NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    generated_by INTEGER NOT NULL,
    FOREIGN KEY (generated_by) REFERENCES users(id)
);
```

### Table `audit_logs` - Journal d'Audit

Traçabilité de toutes les actions sensibles effectuées dans le système.

```sql
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Table `settings` - Configuration Système

Paramètres globaux de configuration du système.

```sql
CREATE TABLE settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category VARCHAR(50) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value TEXT,
    description TEXT,
    type ENUM('string', 'integer', 'decimal', 'boolean', 'json') DEFAULT 'string',
    updated_by INTEGER,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, key),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);
```


## Relations et Contraintes

### Relations Principales

Le schéma de base de données établit plusieurs types de relations pour assurer l'intégrité et la cohérence des données :

#### Relations Un-à-Plusieurs (1:N)

**Utilisateurs vers Entités Créées** : Chaque utilisateur peut créer plusieurs clients, devis, factures et paiements. Cette relation permet de tracer l'origine de chaque enregistrement et d'implémenter des contrôles d'accès basés sur le créateur.

**Clients vers Documents** : Un client peut avoir plusieurs devis, factures et paiements associés. Cette relation centrale permet de reconstituer l'historique complet des interactions commerciales avec chaque client.

**Devis/Factures vers Lignes** : Chaque devis ou facture peut contenir plusieurs lignes de produits ou services. Cette structure permet une facturation détaillée avec calculs automatiques des totaux.

**Produits vers Lignes** : Un produit peut apparaître dans plusieurs devis et factures, permettant le suivi des ventes par produit et l'analyse de performance.

#### Relations Plusieurs-à-Plusieurs (N:M)

**Paiements vers Factures** : Un paiement peut être affecté à plusieurs factures (paiement groupé) et une facture peut être réglée par plusieurs paiements (paiements partiels). Cette relation est gérée par la table de liaison `payment_allocations`.

### Contraintes d'Intégrité

#### Contraintes de Clés Primaires
Toutes les tables disposent d'une clé primaire auto-incrémentée garantissant l'unicité de chaque enregistrement. Cette approche simplifie les relations et améliore les performances des jointures.

#### Contraintes d'Unicité
- Numéros de documents (devis, factures, paiements) : unicité garantie pour éviter les doublons
- Emails utilisateurs : unicité requise pour l'authentification
- SKU produits : codes produits uniques pour éviter les confusions
- Numéros clients : identifiants uniques pour chaque client

#### Contraintes de Clés Étrangères
Toutes les relations sont protégées par des contraintes de clés étrangères avec différentes stratégies :
- **CASCADE** : Suppression en cascade pour les lignes de détail (quote_items, invoice_items)
- **RESTRICT** : Restriction de suppression pour préserver l'intégrité historique (clients avec factures)
- **SET NULL** : Mise à NULL pour les références optionnelles

#### Contraintes de Validation
- Montants : valeurs positives obligatoires pour les prix et totaux
- Dates : cohérence entre dates de création, échéance et paiement
- Statuts : valeurs limitées aux énumérations définies
- Formats : validation des emails, numéros de téléphone et codes postaux

### Index et Optimisations

#### Index Primaires
Chaque table dispose d'un index clustered sur sa clé primaire, optimisant les accès directs et les jointures.

#### Index Secondaires Recommandés

```sql
-- Index pour les recherches fréquentes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_customers_active ON customers(is_active);

-- Index pour les documents
CREATE INDEX idx_quotes_customer ON quotes(customer_id);
CREATE INDEX idx_quotes_date ON quotes(quote_date);
CREATE INDEX idx_quotes_status ON quotes(status);

CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

-- Index pour les produits
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_active ON products(is_active);

-- Index pour les paiements
CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- Index composites pour les requêtes complexes
CREATE INDEX idx_invoices_customer_status ON invoices(customer_id, status);
CREATE INDEX idx_invoices_date_status ON invoices(invoice_date, status);
```

#### Optimisations Spécifiques SQLite

**Pragma Optimizations** : Configuration des paramètres SQLite pour optimiser les performances :
```sql
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = 10000;
PRAGMA temp_store = MEMORY;
```

**Analyse Statistiques** : Mise à jour régulière des statistiques pour l'optimiseur de requêtes :
```sql
ANALYZE;
```

## Triggers et Procédures

### Triggers de Mise à Jour Automatique

#### Trigger de Calcul des Totaux
```sql
CREATE TRIGGER update_quote_totals 
AFTER INSERT OR UPDATE OR DELETE ON quote_items
BEGIN
    UPDATE quotes SET 
        subtotal_ht = (
            SELECT COALESCE(SUM(total_ht), 0) 
            FROM quote_items 
            WHERE quote_id = NEW.quote_id OR quote_id = OLD.quote_id
        ),
        total_vat = (
            SELECT COALESCE(SUM(total_ht * vat_rate / 100), 0) 
            FROM quote_items 
            WHERE quote_id = NEW.quote_id OR quote_id = OLD.quote_id
        )
    WHERE id = NEW.quote_id OR id = OLD.quote_id;
    
    UPDATE quotes SET 
        total_ttc = subtotal_ht + total_vat - discount_amount
    WHERE id = NEW.quote_id OR id = OLD.quote_id;
END;
```

#### Trigger de Mise à Jour des Stocks
```sql
CREATE TRIGGER update_product_stock 
AFTER INSERT ON invoice_items
WHEN NEW.product_id IS NOT NULL
BEGIN
    UPDATE products SET 
        stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.product_id;
END;
```

#### Trigger d'Audit
```sql
CREATE TRIGGER audit_invoice_changes 
AFTER UPDATE ON invoices
BEGIN
    INSERT INTO audit_logs (
        user_id, action, table_name, record_id, 
        old_values, new_values, created_at
    ) VALUES (
        NEW.updated_by, 'UPDATE', 'invoices', NEW.id,
        json_object('status', OLD.status, 'total_ttc', OLD.total_ttc),
        json_object('status', NEW.status, 'total_ttc', NEW.total_ttc),
        CURRENT_TIMESTAMP
    );
END;
```

### Vues Métier

#### Vue des Factures avec Détails Client
```sql
CREATE VIEW v_invoices_details AS
SELECT 
    i.id,
    i.invoice_number,
    i.invoice_date,
    i.due_date,
    i.status,
    i.total_ttc,
    i.paid_amount,
    i.balance_due,
    c.name as customer_name,
    c.email as customer_email,
    c.payment_terms,
    CASE 
        WHEN i.due_date < date('now') AND i.balance_due > 0 THEN 'overdue'
        WHEN i.balance_due = 0 THEN 'paid'
        ELSE i.status
    END as computed_status
FROM invoices i
JOIN customers c ON i.customer_id = c.id
WHERE c.is_active = 1;
```

#### Vue des Statistiques Clients
```sql
CREATE VIEW v_customer_stats AS
SELECT 
    c.id,
    c.name,
    COUNT(DISTINCT i.id) as total_invoices,
    COALESCE(SUM(i.total_ttc), 0) as total_revenue,
    COALESCE(SUM(i.balance_due), 0) as outstanding_balance,
    MAX(i.invoice_date) as last_invoice_date,
    AVG(julianday(p.payment_date) - julianday(i.invoice_date)) as avg_payment_days
FROM customers c
LEFT JOIN invoices i ON c.id = i.customer_id
LEFT JOIN payment_allocations pa ON i.id = pa.invoice_id
LEFT JOIN payments p ON pa.payment_id = p.id
WHERE c.is_active = 1
GROUP BY c.id, c.name;
```

## Stratégie de Sauvegarde et Récupération

### Sauvegarde Automatique
La base SQLite sera sauvegardée quotidiennement avec rotation des sauvegardes sur 30 jours. Un script automatisé effectuera :
- Sauvegarde complète de la base de données
- Vérification de l'intégrité du fichier de sauvegarde
- Compression et archivage sécurisé
- Notification en cas d'échec

### Procédure de Récupération
En cas de corruption ou de perte de données :
1. Arrêt du service applicatif
2. Restauration depuis la dernière sauvegarde valide
3. Rejeu des transactions depuis les logs d'audit si nécessaire
4. Vérification de l'intégrité des données restaurées
5. Redémarrage du service

### Migration et Évolution du Schéma
Un système de versioning du schéma permet les migrations automatiques :
- Scripts de migration numérotés séquentiellement
- Sauvegarde automatique avant chaque migration
- Rollback automatique en cas d'échec
- Validation post-migration

Cette modélisation de base de données fournit une fondation solide et évolutive pour le logiciel de facturation, garantissant l'intégrité des données, les performances optimales et la facilité de maintenance.



### Table `employees` - Gestion des Employés

Cette table stocke les informations des employés pour la gestion de la paie.

```sql
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE, -- Lien vers la table users si l'employé est aussi un utilisateur
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address_line1 VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(100) DEFAULT 'France',
    hire_date DATE NOT NULL,
    job_title VARCHAR(100),
    department VARCHAR(100),
    salary_base DECIMAL(10,2) NOT NULL,
    contract_type ENUM('CDI', 'CDD', 'Stage', 'Freelance') DEFAULT 'CDI',
    is_active BOOLEAN DEFAULT TRUE,
    bank_name VARCHAR(255),
    bank_iban VARCHAR(34),
    bank_bic VARCHAR(11),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Table `salaries` - Historique des Salaires

Cette table enregistre les détails de chaque paie versée aux employés.

```sql
CREATE TABLE salaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    pay_date DATE NOT NULL,
    gross_salary DECIMAL(10,2) NOT NULL,
    net_salary DECIMAL(10,2) NOT NULL,
    social_contributions DECIMAL(10,2) DEFAULT 0,
    tax_deductions DECIMAL(10,2) DEFAULT 0,
    bonuses DECIMAL(10,2) DEFAULT 0,
    deductions DECIMAL(10,2) DEFAULT 0,
    status ENUM('draft', 'paid', 'cancelled') DEFAULT 'draft',
    payroll_period_start DATE,
    payroll_period_end DATE,
    notes TEXT,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Table `expenses` - Gestion des Dépenses

Cette table enregistre toutes les dépenses de l'entreprise.

```sql
CREATE TABLE expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    expense_number VARCHAR(20) UNIQUE NOT NULL,
    supplier_id INTEGER, -- Lien vers une future table suppliers si nécessaire
    category VARCHAR(100) NOT NULL,
    description TEXT,
    amount_ht DECIMAL(10,2) NOT NULL,
    vat_amount DECIMAL(10,2) DEFAULT 0,
    total_ttc DECIMAL(10,2) NOT NULL,
    expense_date DATE NOT NULL,
    payment_date DATE,
    payment_method ENUM('transfer', 'card', 'cash', 'check', 'other') DEFAULT 'card',
    status ENUM('pending', 'paid', 'reimbursed') DEFAULT 'pending',
    receipt_url VARCHAR(500),
    notes TEXT,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Table `suppliers` - Gestion des Fournisseurs

Cette table stocke les informations des fournisseurs.

```sql
CREATE TABLE suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address_line1 VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(10),
    country VARCHAR(100),
    vat_number VARCHAR(20),
    bank_name VARCHAR(255),
    bank_iban VARCHAR(34),
    bank_bic VARCHAR(11),
    payment_terms INTEGER DEFAULT 30,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Table `accounting_entries` - Écritures Comptables

Cette table enregistre toutes les écritures comptables générées par le système.

```sql
CREATE TABLE accounting_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_date DATE NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    debit DECIMAL(10,2) DEFAULT 0,
    credit DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    source_document_type ENUM('invoice', 'quote', 'payment', 'expense', 'salary', 'other') NOT NULL,
    source_document_id INTEGER NOT NULL,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Table `cash_flow` - Suivi de Trésorerie / Caisse

Cette table enregistre les mouvements de trésorerie (entrées/sorties de caisse).

```sql
CREATE TABLE cash_flow (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_date DATE NOT NULL,
    type ENUM('inflow', 'outflow') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    source_document_type ENUM('invoice', 'payment', 'expense', 'salary', 'other') NOT NULL,
    source_document_id INTEGER NOT NULL,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Table `quote_approvals` - Suivi des Approbations de Devis

Cette table enregistre les différentes étapes d'approbation pour chaque devis, permettant de tracer le workflow hiérarchique (responsable de service, directeur général).

```sql
CREATE TABLE quote_approvals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote_id INTEGER NOT NULL,
    approver_id INTEGER NOT NULL, -- L'ID de l'utilisateur qui a effectué l'action (responsable de service ou DG)
    approval_level ENUM(\'service_manager\', \'general_director\') NOT NULL, -- Niveau d'approbation
    status ENUM(\'pending\', \'approved\', \'rejected\') DEFAULT \'pending\',
    approval_date DATETIME,
    comments TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id),
    UNIQUE(quote_id, approval_level) -- Un seul enregistrement par devis et par niveau d'approbation
);
```