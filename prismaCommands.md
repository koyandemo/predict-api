# Prisma CLI Commands Cheat Sheet

## Installation

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init
```

---

## Schema & Client

| Command | Description |
|---|---|
| `npx prisma init` | Initialize Prisma in your project (creates `prisma/schema.prisma`) |
| `npx prisma generate` | Generate Prisma Client from your schema |
| `npx prisma validate` | Validate your `schema.prisma` file |
| `npx prisma format` | Format your `schema.prisma` file |

---

## Migrations (Development)

| Command | Description |
|---|---|
| `npx prisma migrate dev` | Create & apply a new migration (dev) |
| `npx prisma migrate dev --name <name>` | Create migration with a custom name |
| `npx prisma migrate reset` | Reset DB and re-apply all migrations (dev) |
| `npx prisma migrate status` | Check migration status |

---

## Migrations (Production)

| Command | Description |
|---|---|
| `npx prisma migrate deploy` | Apply pending migrations (production) |
| `npx prisma migrate resolve --applied <migration>` | Mark migration as applied |
| `npx prisma migrate resolve --rolled-back <migration>` | Mark migration as rolled back |

---

## Database

| Command | Description |
|---|---|
| `npx prisma db push` | Push schema changes to DB without migration |
| `npx prisma db pull` | Introspect DB and update `schema.prisma` |
| `npx prisma db seed` | Run database seed script |
| `npx prisma db execute --file <file.sql>` | Execute a raw SQL file |

---

## Prisma Studio

| Command | Description |
|---|---|
| `npx prisma studio` | Open visual DB browser at `localhost:5555` |

---

## Introspection

| Command | Description |
|---|---|
| `npx prisma introspect` | Alias for `db pull` (deprecated, use `db pull`) |

---

## Common Flags

| Flag | Description |
|---|---|
| `--schema <path>` | Path to custom schema file |
| `--skip-generate` | Skip client generation after migrate |
| `--force-reset` | Force reset without confirmation prompt |
| `--preview-feature` | Enable preview features |

---

## Typical Workflow

```bash
# 1. Initialize project
npx prisma init

# 2. Edit prisma/schema.prisma

# 3. Create and apply migration
npx prisma migrate dev --name init

# 4. Generate client
npx prisma generate

# 5. Explore data
npx prisma studio
```

---

## Environment

Prisma reads from `.env` by default:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

Use `--schema` flag or `PRISMA_SCHEMA` env var to override the schema path.