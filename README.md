# Rino Oktavian Ridwan - Portfolio Backend

Backend API untuk website portofolio pribadi. Dibangun dengan **NestJS**, **TypeORM**, dan **MySQL**.

---

## 🔗 Related Links

| Project | Link |
|---------|------|
| **Frontend Repository** | [github.com/rinooktavianridwan/rinooktavianridwan](https://github.com/rinooktavianridwan/rinooktavianridwan) |
| **Live Website** | [rinooktavianridwan.site](https://rinooktavianridwan.site) |

---

## 🛠 Tech Stack

- **Framework**: NestJS 11 (TypeScript)
- **Database**: MySQL dengan TypeORM
- **Authentication**: JWT + Passport
- **Package Manager**: pnpm 10
- **Validation**: class-validator + Zod
- **Testing**: Jest + Supertest

---

## 🚀 Quick Start

### Prasyarat
- Node.js 20+
- pnpm 10 (`corepack enable && corepack prepare pnpm@10.29.3 --activate`)
- MySQL 8+

### Instalasi

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env dengan konfigurasi database Anda

# Generate migration (opsional, jika schema berubah)
pnpm migration:generate src/infrastructures/database/migrations/NamaMigration

# Run migration
pnpm migration:run
```

### Development

```bash
# Watch mode
pnpm start:dev

# Build
pnpm build

# Production mode
pnpm start:prod
```

### Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:cov
```

### Lint & Format

```bash
pnpm lint
pnpm format
```

---

## 📦 Deployment

Project ini dikonfigurasi untuk deploy via **Docker** + **docker-compose**.

```bash
# Build image
docker compose -f docker-compose.prod.yml build

# Run container
docker compose -f docker-compose.prod.yml up -d
```

CI/CD menggunakan **Jenkins** (lihat `Jenkinsfile`).

---

## 📁 Project Structure

```
src/
├── common/           # Shared utilities, decorators, guards
├── config/           # Configuration modules
├── infrastructures/  # Database, external services
├── modules/          # Feature modules (auth, users, portfolio, etc.)
└── main.ts           # Application entry point
```

---

## 📄 License

Private project - All rights reserved.