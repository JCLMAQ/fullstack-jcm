# Copilot Instructions pour FullStack App

## Architecture du Projet

Cette application est un **monorepo Nx** avec une architecture fullstack basée sur **ZenStack + Prisma + NestJS + Angular**.

### Structure Clé
- **Apps** : `apps/backend/nest-app` (NestJS) + `apps/frontend/app-jcm` (Angular)
- **Libs** : Bibliothèques partagées par domaine (`libs/backend/*`, `libs/frontend/*`)
- **Prisma** : Schéma de base de données centralisé dans `libs/db/prisma/schema.prisma`
- **Scripts** : Utilitaires de configuration dans `scripts/`

## Stack Technique Spécifique

### Prisma (Couche Données)
- **Schéma principal** : `libs/db/prisma/schema.prisma`
- **Génération** : `pnpm run prisma:generate`

### NestJS (Backend)
- **IAM/Auth** : Module d'authentification complet dans `libs/backend/iam` + `libs/backend/auths`
- **Guards multiples** : Authentication, Roles, Permissions, Policies (tous actifs par défaut)
- **Configuration** : Variables d'environnement via `DbConfigService` et base de données

### Angular (Frontend)
- **Configuration dynamique** : Script `scripts/setenv.ts` génère `environment.ts` depuis `.env`
- **Proxy** : Script `scripts/setproxyconfig.ts` génère `proxy.config.json`
- **Démarrage** : Utilise toujours les scripts de config avant le serve

## Workflows de Développement

### Démarrage Complet
```bash
# 1. Base de données
pnpm run db:docker:up

# 2. Backend (génère config proxy)
pnpm run start:backend:dev

# 3. Frontend (génère environment + proxy)
pnpm run start:frontend:dev
```

### Modifications Schema
1. Modifier `libs/db/prisma/schema.prisma`
2. `pnpm run start:prisma` (génère + migre)
3. Redémarrer les services

### Seeding
- Configuration : `pnpm run seed-param`
- Données de test : `pnpm run seed-faker`
- Organisation : `pnpm run seed-org`

## Conventions Spécifiques

### Structure des Modules
- **Repository Pattern** : Services utilisent des repositories (ex: `TasksRepository`)
- **CRUD Services** : Services générés automatiquement dans `libs/db/prisma/generated/`
- **Validation** : `class-validator` + `ValidationPipe` global
- **Sérialisation** : `ClassSerializerInterceptor` global

### Gestion des Utilisateurs
- **Auth Multi-mode** : Password + Passwordless + 2FA
- **Soft Delete** : `isDeleted` + `isDeletedDT` 
- **Validation Email** : `AccountValidation` + tokens
<!-- - **Rôles/Permissions** : Système complet avec politiques ZenStack -->

### Configuration
- **Priorité ENV** : Environnement > Base de données (`DbConfigService.searchConfigParamEnvFirst`)
- **Scripts requis** : Toujours exécuter les scripts de config avant développement
- **Proxy requis** : Frontend doit utiliser proxy pour API calls

## Points d'Intégration Critiques

<!-- ### ZenStack Middleware
Route `/zen` expose automatiquement toutes les entités via REST avec politiques d'accès.
Headers requis : `x-user-id`, `x-user-role` -->

### Services Prisma
- `PrismaService` : Service de base
- `EnhancedPrismaService` : Avec politiques ZenStack (recommandé)
- Import : `@db/prisma` pour le service, `@prisma/client` pour les types

### Configuration Environment
Variables critiques à définir dans `.env` :
- `DATABASE_URL`, `API_*`, `NEST_SERVER_*`
- Utiliser `dotenvx` pour les commandes de base
