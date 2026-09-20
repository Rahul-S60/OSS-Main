# Open Source Companion

Open Source Companion is an open-source contribution platform built with Next.js 16 (App Router, React 19, Server Actions), PostgreSQL, Prisma ORM, and Auth.js v5 (GitHub OAuth).

---

## Tech Stack
- **Framework**: Next.js 16.3.5 (App Router, Turbopack, Standalone Output)
- **Frontend**: React 19, Tailwind CSS v4, Framer Motion, Lucide React
- **Database**: PostgreSQL 15
- **ORM**: Prisma 5.22.0
- **Authentication**: Auth.js / NextAuth v5 (GitHub OAuth provider)
- **Containerization**: Docker multi-stage build, Docker Compose

---

# Docker Deployment

## Requirements
- [Docker](https://docs.docker.com/get-docker/) (v24+)
- [Docker Compose](https://docs.docker.com/compose/) (v2.20+)
- [Git](https://git-scm.com/)

---

## Environment Variables

Copy the template file:
```bash
cp .env.example .env
```

Configure the following variables in `.env`:

| Variable | Description | Example / Default |
|---|---|---|
| `POSTGRES_USER` | PostgreSQL username | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password | Strong random password |
| `POSTGRES_DB` | Database name | `opensource_companion` |
| `DATABASE_URL` | Full connection string for the app | `postgresql://postgres:password@postgres:5432/opensource_companion?schema=public` |
| `AUTH_SECRET` | NextAuth encryption key (min 32 chars) | Generate with `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` | GitHub OAuth App Client ID | From GitHub Developer Settings |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App Client Secret | From GitHub Developer Settings |
| `AUTH_URL` | Canonical URL of the application | `http://localhost:3000` (Local) / `https://your-domain.com` (Prod) |
| `NEXTAUTH_URL` | Canonical URL fallback | `http://localhost:3000` (Local) / `https://your-domain.com` (Prod) |
| `AUTH_TRUST_HOST` | Trust proxy headers behind Docker/Nginx | `true` |
| `GITHUB_TOKEN` | (Optional) GitHub Personal Access Token | Increases GitHub Search API rate limit |

> [!WARNING]
> Never commit `.env` or any real API tokens into Git. Only `.env.example` should be tracked.

---

## Local Docker Setup

1. **Clone the repository and prepare environment**:
   ```bash
   git clone <repo-url>
   cd opensource-companion
   cp .env.example .env
   # Edit .env with your credentials
   ```

2. **Build and start the application stack**:
   ```bash
   docker compose build
   docker compose up -d
   ```

3. **Check container health and status**:
   ```bash
   docker compose ps
   ```
   Both `opensource_companion_postgres` and `opensource_companion_app` should display `(healthy)`.

4. **Inspect live logs**:
   ```bash
   docker compose logs -f app
   docker compose logs -f postgres
   ```

5. **Access the application**:
   - Web App: [http://localhost:3000](http://localhost:3000)
   - Healthcheck: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## Prisma Migrations

### Automatic Migration on Startup
The container entrypoint script automatically applies all pending migrations using:
```bash
npx prisma migrate deploy
```
This runs before `node server.js` starts.

### Manual Migration Check or Deployment
To manually verify or run migrations inside the running container:
```bash
# Check migration status
docker compose exec app npx prisma migrate status

# Deploy migrations manually
docker compose exec app npx prisma migrate deploy
```

### Baselining an Existing Populated Database
If connecting to an existing database that already contains tables created outside Prisma Migrate:
```bash
docker compose exec app npx prisma migrate resolve --applied 20260920000000_init
```

> [!CAUTION]
> In production, **never** run `prisma migrate dev` or `prisma db push`. Always use `prisma migrate deploy`.

---

## Database Persistence & Teardown

- PostgreSQL data is stored on a persistent named Docker volume: `opensource_companion_postgres_data`.
- To safely stop the containers without losing database data:
  ```bash
  docker compose down
  ```
- Starting the stack again preserves all existing users, issues, and contributions:
  ```bash
  docker compose up -d
  ```

> [!CAUTION]
> Running `docker compose down -v` will **DESTROY** the PostgreSQL data volume. Do not use `-v` unless you intentionally want to wipe the database.

---

# AWS EC2 / Linux VPS Deployment

Follow this guide to deploy Open Source Companion onto an Ubuntu Linux VPS or AWS EC2 instance.

```text
Internet
   │  HTTPS (:443)
   ▼
Nginx (Reverse Proxy & SSL via Let's Encrypt)
   │  HTTP (:3000)
   ▼
Docker Network (opensource_companion_network)
   ├── Next.js App (:3000)
   └── PostgreSQL (:5432 private)
```

### 1. Launch Instance & Configure Firewall (Security Groups)
- Launch an **Ubuntu 22.04 / 24.04 LTS** instance (t3.small or larger recommended).
- Allow inbound traffic in Security Group / Firewall:
  - Port `22` (SSH)
  - Port `80` (HTTP)
  - Port `443` (HTTPS)
  - **Do NOT open port 5432** to the public internet.

### 2. Install Docker & Docker Compose
SSH into your instance and run:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg lsb-release

# Install Docker Engine
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Enable Docker for current user
sudo usermod -aG docker $USER
newgrp docker
```

### 3. Deploy the Application
```bash
git clone <repository-url>
cd <repository-directory>

cp .env.example .env
nano .env
```
In `.env`, set:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<strong-random-password>
POSTGRES_DB=opensource_companion

DATABASE_URL="postgresql://postgres:<strong-random-password>@postgres:5432/opensource_companion?schema=public"

AUTH_SECRET=<generate-via-openssl-rand-base64-32>

AUTH_GITHUB_ID=<your-production-github-client-id>
AUTH_GITHUB_SECRET=<your-production-github-client-secret>

AUTH_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
AUTH_TRUST_HOST=true
```

Build and launch the stack:
```bash
docker compose build --no-cache
docker compose up -d
```

Verify containers are healthy:
```bash
docker compose ps
docker compose logs -f app
```

---

# Domain, HTTPS, and Reverse Proxy

In production, terminate SSL at Nginx and forward traffic to the Next.js container on port 3000.

### 1. Install Nginx and Certbot
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### 2. Configure Nginx
Create `/etc/nginx/sites-available/opensource-companion`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/opensource-companion /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Obtain Free SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

# GitHub OAuth Configuration

Create a GitHub OAuth Application under **GitHub Settings -> Developer Settings -> OAuth Apps**:

### Local Development
- **Application Name**: Open Source Companion (Local)
- **Homepage URL**: `http://localhost:3000`
- **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

### Production Deployment
- **Application Name**: Open Source Companion (Production)
- **Homepage URL**: `https://your-domain.com`
- **Authorization callback URL**: `https://your-domain.com/api/auth/callback/github`

---

# Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| `sh: prisma: not found` | `.bin` folder not in PATH | Ensure Dockerfile copies `node_modules/.bin` and invoke CLI via `npx prisma` or `node ./node_modules/prisma/build/index.js`. |
| Container shows `(unhealthy)` | Alpine resolves `localhost` to IPv6 `::1` | Healthcheck must target `http://127.0.0.1:3000/api/health`. |
| `UntrustedHost` OAuth error | Reverse proxy forwarded host not trusted | Set `AUTH_TRUST_HOST=true` in environment variables and `trustHost: true` in `auth.ts`. |
| Port 3000 already in use | Host node process running | Run `Stop-Process` or `kill $(lsof -t -i:3000)`. |
| PostgreSQL connection refused | Container not yet ready | Docker Compose handles readiness via `service_healthy` and `pg_isready`. |
| Missing tables on startup | Fresh DB without migrations | Entrypoint automatically runs `npx prisma migrate deploy`. Verify with `docker compose exec app npx prisma migrate status`. |
