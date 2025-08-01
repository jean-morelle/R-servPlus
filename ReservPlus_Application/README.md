# 🚀 **RÉSERVPLUS** - Plateforme de Réservation de Services

[![Angular](https://img.shields.io/badge/Angular-17-red.svg)](https://angular.io/)
[![.NET](https://img.shields.io/badge/.NET-8-blue.svg)](https://dotnet.microsoft.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple.svg)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Une solution moderne et complète pour la gestion de réservations de services**

## 📋 **Table des matières**

- [🎯 Vue d'ensemble](#-vue-densemble)
- [🏗️ Architecture](#️-architecture)
- [⚡ Fonctionnalités](#-fonctionnalités)
- [🚀 Installation](#-installation)
- [👥 Rôles utilisateurs](#-rôles-utilisateurs)
- [🔧 Configuration](#-configuration)
- [📱 Utilisation](#-utilisation)
- [🛠️ Développement](#️-développement)
- [📊 API Documentation](#-api-documentation)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)

---

## 🎯 **Vue d'ensemble**

**RéservPlus** est une plateforme web moderne qui connecte les prestataires de services avec leurs clients. L'application offre une solution complète pour la gestion des rendez-vous, des disponibilités et des paiements.

### **🎯 Objectifs**
- ✅ Simplifier la gestion des réservations
- ✅ Optimiser l'organisation des prestataires
- ✅ Améliorer l'expérience client
- ✅ Automatiser les processus de paiement
- ✅ Fournir des analyses et statistiques

### **🌟 Points forts**
- 🏗️ Architecture moderne (Angular 17 + .NET 8)
- 🔐 Sécurité renforcée (JWT + RBAC)
- 📱 Interface responsive
- ⚡ Performance optimisée
- 🎨 Design professionnel

---

## 🏗️ **Architecture**

### **Frontend (Angular 17)**
```
┌─────────────────────────────────┐
│         Angular 17              │
├─────────────────────────────────┤
│         Bootstrap 5             │
├─────────────────────────────────┤
│      Material Icons             │
├─────────────────────────────────┤
│        TypeScript               │
└─────────────────────────────────┘
```

### **Backend (.NET 8)**
```
┌─────────────────────────────────┐
│         .NET 8 API              │
├─────────────────────────────────┤
│    Entity Framework Core        │
├─────────────────────────────────┤
│        SQL Server               │
├─────────────────────────────────┤
│         JWT Auth                │
└─────────────────────────────────┘
```

### **Technologies utilisées**

| Frontend | Backend | Base de données | Outils |
|----------|---------|----------------|--------|
| Angular 17 | .NET 8 | SQL Server | Git |
| Bootstrap 5 | Entity Framework | Migrations | Visual Studio |
| TypeScript | JWT | Code-first | VS Code |
| RxJS | Swagger | Relations | npm |

---

## ⚡ **Fonctionnalités**

### **🔐 Authentification & Autorisation**
- [x] Inscription/Connexion sécurisée
- [x] Gestion des rôles (Admin, Prestataire, User)
- [x] Tokens JWT pour la sécurité
- [x] Protection des routes avec guards

### **📅 Gestion des réservations**
- [x] Création de réservations en temps réel
- [x] Gestion des disponibilités
- [x] Confirmation/Annulation automatique
- [x] Notifications par email

### **💰 Système de paiement**
- [x] Intégration de passerelles de paiement
- [x] Historique des transactions
- [x] Facturation automatique
- [x] Rapports financiers

### **📊 Tableau de bord**
- [x] Statistiques en temps réel
- [x] Graphiques et analyses
- [x] Actions rapides
- [x] Activité récente

### **💬 Communication**
- [x] Chat en ligne intégré
- [x] Notifications push
- [x] Messagerie interne
- [x] Support client

---

## 🚀 **Installation**

### **Prérequis**
- [Node.js](https://nodejs.org/) 18+
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/sql-server) 2022
- [Visual Studio Code](https://code.visualstudio.com/) (recommandé)

### **Installation Frontend**

```bash
# Cloner le projet
git clone [repository-url]
cd ReservPlus_Application

# Installer les dépendances
npm install

# Démarrer l'application
npm start
```

### **Installation Backend**

```bash
# Naviguer vers le dossier backend
cd RéservPlus

# Restaurer les packages
dotnet restore

# Appliquer les migrations
dotnet ef database update

# Démarrer l'API
dotnet run --urls "http://localhost:5266"
```

### **URLs d'accès**
- 🌐 **Frontend** : http://localhost:52533
- 🔌 **API** : http://localhost:5266
- 📚 **Swagger** : http://localhost:5266/swagger

---

## 👥 **Rôles utilisateurs**

### **👨‍💼 Administrateur**
**Permissions :**
- 🎛️ Gestion complète de la plateforme
- 📊 Accès aux rapports et statistiques
- 👥 Création/modification des utilisateurs
- ⚙️ Configuration système

**Interface :**
- Tableau de bord administratif
- Gestion des utilisateurs
- Gestion des prestataires
- Rapports et analyses
- Paramètres système

### **🛠️ Prestataire**
**Permissions :**
- 🛠️ Gestion de ses services
- 📅 Planification des disponibilités
- 📋 Gestion des réservations
- 💰 Suivi des paiements

**Interface :**
- Tableau de bord prestataire
- Gestion des services
- Planning des disponibilités
- Réservations clients
- Suivi financier

### **👤 Utilisateur**
**Permissions :**
- 🔍 Consultation des services
- 📝 Création de réservations
- 👤 Gestion du profil
- 💳 Historique des paiements

**Interface :**
- Recherche de services
- Réservation en ligne
- Profil personnel
- Historique des rendez-vous
- Système d'évaluation

---

## 🔧 **Configuration**

### **Variables d'environnement**

Créer un fichier `.env` dans le dossier frontend :

```env
# API Configuration
API_URL=http://localhost:5266
API_TIMEOUT=30000

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h

# Database
DB_CONNECTION_STRING=Server=localhost;Database=ReservPlus;Trusted_Connection=true;

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

### **Configuration de la base de données**

Dans `appsettings.json` du backend :

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=ReservPlus;Trusted_Connection=true;"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-here",
    "Issuer": "ReservPlus",
    "Audience": "ReservPlusUsers",
    "ExpirationHours": 24
  }
}
```

---

## 📱 **Utilisation**

### **Première connexion**

1. **Accéder à l'application** : http://localhost:52533
2. **Créer un compte** : Cliquer sur "S'inscrire"
3. **Se connecter** : Utiliser vos identifiants
4. **Choisir un rôle** : Admin, Prestataire ou Utilisateur

### **Comptes de démonstration**

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@reservplus.com | admin123 |
| Prestataire | prestataire@reservplus.com | presta123 |
| Utilisateur | user@reservplus.com | user123 |

### **Navigation**

- **Accueil** : Page d'accueil avec présentation
- **Tableau de bord** : Vue d'ensemble personnalisée
- **Services** : Gestion des services (Prestataire)
- **Réservations** : Gestion des rendez-vous
- **Profil** : Informations personnelles
- **Paramètres** : Configuration (Admin)

---

## 🛠️ **Développement**

### **Structure du projet**

```
ReservPlus_Application/
├── src/
│   ├── app/
│   │   ├── components/          # Composants Angular
│   │   ├── services/           # Services Angular
│   │   ├── guards/             # Guards de sécurité
│   │   ├── models/             # Interfaces TypeScript
│   │   └── directives/         # Directives personnalisées
│   ├── assets/                 # Ressources statiques
│   └── styles.css              # Styles globaux
├── package.json                # Dépendances npm
└── angular.json               # Configuration Angular

RéservPlus/
├── Controllers/               # Contrôleurs API
├── Models/                    # Modèles de données
├── Services/                  # Services métier
├── Data/                      # Contexte Entity Framework
└── Program.cs                 # Point d'entrée
```

### **Commandes de développement**

```bash
# Frontend
npm start              # Démarrer en mode développement
npm run build          # Construire pour la production
npm run test           # Exécuter les tests
npm run lint           # Vérifier le code

# Backend
dotnet run             # Démarrer l'API
dotnet test            # Exécuter les tests
dotnet build           # Construire le projet
dotnet ef migrations   # Gérer les migrations
```

### **Tests**

```bash
# Tests Frontend
npm run test

# Tests Backend
dotnet test

# Tests d'intégration
dotnet test --filter Category=Integration
```

---

## 📊 **API Documentation**

### **Endpoints principaux**

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/login` | Connexion utilisateur |
| POST | `/api/auth/register` | Inscription utilisateur |
| GET | `/api/users` | Liste des utilisateurs |
| GET | `/api/prestataires` | Liste des prestataires |
| GET | `/api/reservations` | Liste des réservations |
| POST | `/api/reservations` | Créer une réservation |

### **Authentification**

Tous les endpoints protégés nécessitent un token JWT dans le header :

```
Authorization: Bearer <your-jwt-token>
```

### **Documentation Swagger**

Accéder à la documentation interactive : http://localhost:5266/swagger

---

## 🤝 **Contribution**

### **Comment contribuer**

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### **Standards de code**

- **Frontend** : ESLint + Prettier
- **Backend** : StyleCop + EditorConfig
- **Tests** : Couverture minimale 80%
- **Documentation** : Commentaires en français

### **Workflow Git**

```
main
├── develop
│   ├── feature/user-management
│   ├── feature/payment-integration
│   └── bugfix/login-issue
└── hotfix/security-patch
```

---

## 📄 **Licence**

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 📞 **Contact**

**Équipe de développement RéservPlus**

- 📧 **Email** : contact@reservplus.com
- 📞 **Téléphone** : +33 1 23 45 67 89
- 🌍 **Localisation** : Lomé-Togo
- 🕒 **Support** : Disponible 24/7

---

## 🙏 **Remerciements**

- [Angular](https://angular.io/) - Framework frontend
- [.NET](https://dotnet.microsoft.com/) - Framework backend
- [Bootstrap](https://getbootstrap.com/) - Framework CSS
- [Material Icons](https://material.io/icons/) - Icônes
- [Entity Framework](https://docs.microsoft.com/ef/) - ORM

---

*© 2024 RéservPlus - Tous droits réservés*

---

<div align="center">

**⭐ Si ce projet vous plaît, n'oubliez pas de le star ! ⭐**

</div>
