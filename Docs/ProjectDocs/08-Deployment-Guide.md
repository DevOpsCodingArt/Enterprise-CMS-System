# Deployment & Infrastructure Guide

This document outlines the deployment process and infrastructure setup for **Prime One** — a SaaS multi-tenant ISP CMS platform.

## 1. Local Ubuntu Server Setup

### System Requirements

#### Minimum Hardware Specs (Development / Testing)
- **CPU:** 2 Cores
- **RAM:** 4 GB
- **Storage:** 40 GB SSD

#### Recommended Specs (Production)
- **CPU:** 4-8 Cores
- **RAM:** 16 GB+ (to handle PostgreSQL and Node.js instances efficiently)
- **Storage:** 100 GB+ SSD / NVMe
- **OS:** Ubuntu 22.04 LTS or 24.04 LTS (Recommended for long-term support)

### Initial Server Configuration

Run these commands on a fresh Ubuntu installation to configure the basics:

```bash
# 1. System Update
sudo apt update && sudo apt upgrade -y

# 2. Create a non-root user (e.g., 'deployer')
sudo adduser deployer
# Add to sudo group
sudo usermod -aG sudo deployer

# Switch to the new user
su - deployer

# 3. SSH Key Setup (Run on your local machine to copy your key to the server)
# ssh-copy-id deployer@<server_ip>
# Ensure SSH directory exists on server if doing manually:
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# 4. Firewall Configuration (UFW)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable

# 5. Static IP Configuration (if not configured by hosting provider)
# Edit /etc/netplan/00-installer-config.yaml or equivalent
# Example configuration:
# network:
#   version: 2
#   ethernets:
#     eth0:
#       dhcp4: no
#       addresses: [192.168.1.100/24]
#       gateway4: 192.168.1.1
#       nameservers:
#         addresses: [8.8.8.8, 1.1.1.1]
# Apply changes:
# sudo netplan apply

# 6. Timezone Setup
sudo timedatectl set-timezone UTC
```

### Install Required Software

```bash
# 1. Install Node.js via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20

# 2. Install Podman and Podman Compose
sudo apt update
sudo apt install -y podman podman-compose

# 3. Install Git
sudo apt install -y git

# 4. Install PM2 (Process Manager)
npm install -g pm2
pm2 startup ubuntu
```

---

## 2. Podman Compose Configuration

Below is the complete `podman-compose.yml` file to manage PostgreSQL and Redis using Podman instead of Docker.

```yaml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:16-3.4
    container_name: primeone_db
    environment:
      POSTGRES_DB: primeone
      POSTGRES_USER: primeone_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD} # Defined in .env
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U primeone_user -d primeone"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: primeone_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --requirepass ${REDIS_PASSWORD} # Defined in .env
    restart: always
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

### Configuration Details:
- **postgres**: Uses PostGIS extension. Bound to port `5432`. Healthchecks ensure it's fully started before dependent services connect.
- **redis**: Minimal Alpine image. Protected by a password defined via `redis-server --requirepass`. Bound to port `6379`.
- **volumes**: Persistent data storage to survive container restarts.

---

## 3. Domain & SSL Setup with Cloudflare

### Buy a Domain
- **Registrars**: Namecheap or Cloudflare Registrar (Recommended).
- **Cost**: Around $10-15/year for a `.com` domain.

### Cloudflare Setup
1. **Create Account**: Sign up at [Cloudflare](https://dash.cloudflare.com) and add your domain.
2. **Update Nameservers**: At your registrar, change nameservers to those provided by Cloudflare.
3. **DNS Records**:
   - `A` Record: `primeone.pk` → `Your Static IP` (Proxied)
   - `A` Record: `api.primeone.pk` → `Your Static IP` (Proxied)
4. **SSL/TLS Settings**:
   - Set encryption mode to **Full (Strict)**.
   - Go to Edge Certificates: Enable **Always Use HTTPS** and **Automatic HTTPS Rewrites**.
5. **Security Settings**:
   - Enable **Bot Fight Mode**.
   - **Under Attack Mode**: Enable only during active DDoS attacks.

### Cloudflare Tunnel (Alternative)
If your server IP is dynamic or not public-facing, use Cloudflare Tunnel to expose your server securely.

```bash
# 1. Install cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb

# 2. Login to Cloudflare
cloudflared tunnel login

# 3. Create a tunnel
cloudflared tunnel create primeone-tunnel

# 4. Route traffic
cloudflared tunnel route dns primeone-tunnel primeone.pk
cloudflared tunnel route dns primeone-tunnel api.primeone.pk

# 5. Create config.yml in ~/.cloudflared/
# tunnel: <tunnel_id>
# credentials-file: /root/.cloudflared/<tunnel_id>.json
# ingress:
#   - hostname: primeone.pk
#     service: http://localhost:3000
#   - hostname: api.primeone.pk
#     service: http://localhost:4000
#   - service: http_status:404

# 6. Run as a service
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

---

## 4. Reverse Proxy Setup

### Using Caddy (Recommended)
Caddy automatically handles SSL certificates and is much simpler than Nginx.

```bash
# Install Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

**Edit `/etc/caddy/Caddyfile`**:
```text
primeone.pk {
    reverse_proxy localhost:3000
}

api.primeone.pk {
    reverse_proxy localhost:4000
}
```

Reload Caddy: `sudo systemctl reload caddy`.

### Using Nginx (Alternative)
If you prefer Nginx:

```nginx
# /etc/nginx/sites-available/primeone

server {
    listen 80;
    server_name primeone.pk api.primeone.pk;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.primeone.pk;

    ssl_certificate /etc/ssl/certs/cloudflare_origin.pem;
    ssl_certificate_key /etc/ssl/private/cloudflare_origin.key;

    client_max_body_size 50M;
    gzip on;
    gzip_types text/plain application/json;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl http2;
    server_name primeone.pk;

    ssl_certificate /etc/ssl/certs/cloudflare_origin.pem;
    ssl_certificate_key /etc/ssl/private/cloudflare_origin.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 5. Application Deployment

### Environment Files

#### Backend (`.env`)
```env
PORT=4000
DATABASE_URL=postgresql://primeone_user:securepassword@localhost:5432/primeone
REDIS_URL=redis://:securepassword@localhost:6379
JWT_SECRET=supersecretjwtkey
FRONTEND_URL=https://primeone.pk
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=primeone-assets
CLOUDFLARE_R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
FCM_SERVER_KEY=your_fcm_server_key
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=re_your_api_key
SMTP_FROM="Prime One <noreply@primeone.pk>"
```

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=https://api.primeone.pk
NEXT_PUBLIC_SITE_URL=https://primeone.pk
```

### Backend (NestJS)

```bash
git clone <repo_url> /var/www/primeone
cd /var/www/primeone/backend
npm install
npm run build
npm run db:push    # Drizzle ORM migrations
npm run db:seed    # Seed initial data
pm2 start dist/main.js --name "primeone-api"
pm2 save
```

### Frontend (Next.js)

```bash
cd /var/www/primeone/frontend
npm install
npm run build
pm2 start npm --name "primeone-web" -- run start
pm2 save
```

---

## 6. Cloudflare R2 Setup

1. **Create Bucket**: In Cloudflare Dashboard → R2 → Create bucket (`primeone-assets`).
2. **Generate API Tokens**: 
   - Manage R2 API Tokens → Create API token.
   - Set Permissions to **Edit**.
   - Copy **Access Key ID** and **Secret Access Key**.
3. **CORS Configuration**:
   - In bucket settings, add CORS policy to allow your domains (`https://primeone.pk`).
4. **Public Access**: Enable Public Access or Custom Domain if files should be publicly readable without pre-signed URLs.

---

## 7. Firebase Cloud Messaging (FCM) Setup

1. **Create Project**: Go to [Firebase Console](https://console.firebase.google.com/), create a new project.
2. **Add App**: Add your Flutter Android app (provide package name).
3. **Download Config**: Download `google-services.json` and place it in the Flutter app's `android/app/` directory.
4. **Generate Server Key**:
   - Go to Project Settings → Cloud Messaging.
   - Manage Service Accounts → Generate new private key JSON.
5. **Backend Config**: Use the downloaded JSON file in the NestJS backend to initialize the Firebase Admin SDK.

---

## 8. Email Service Setup

For production, avoid Gmail. Use specialized services:
- **Resend** (Recommended): 100 free emails/day. Very developer-friendly.
- **Brevo (Sendinblue)**: 300 free emails/day.

**SMTP Config (Resend)**:
- Host: `smtp.resend.com`
- Port: `465` (Secure)
- Username: `resend`
- Password: `<your_resend_api_key>`

---

## 9. Database Backup Strategy

Create a bash script `/usr/local/bin/db-backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/primeone"
DATE=$(date +%Y-%m-%d)
FILENAME="primeone_backup_$DATE.sql"

mkdir -p $BACKUP_DIR
podman exec primeone_db pg_dump -U primeone_user primeone > $BACKUP_DIR/$FILENAME

# Keep last 7 days
find $BACKUP_DIR -type f -name "*.sql" -mtime +7 -exec rm {} \;

# Optional: Upload to R2 via AWS CLI
# aws s3 cp $BACKUP_DIR/$FILENAME s3://primeone-assets/backups/ --endpoint-url https://<account_id>.r2.cloudflarestorage.com
```

Make executable and add to cron:
```bash
sudo chmod +x /usr/local/bin/db-backup.sh
crontab -e
# Add: 0 2 * * * /usr/local/bin/db-backup.sh
```

### Restore Procedure:
```bash
cat /var/backups/primeone/primeone_backup_YYYY-MM-DD.sql | podman exec -i primeone_db psql -U primeone_user -d primeone
```

---

## 10. Monitoring & Logging

- **PM2**: `pm2 monit` (Live dashboard), `pm2 logs` (Application logs).
- **PostgreSQL**: Access DB and run `SELECT * FROM pg_stat_activity;`.
- **Redis**: `podman exec -it primeone_redis redis-cli -a ${REDIS_PASSWORD} info`.
- **Log Rotation**: PM2 handles this via `pm2 install pm2-logrotate`.
- **Uptime**: Use **UptimeRobot** (Free tier) to monitor `https://api.primeone.pk/health`.

---

## 11. Security Hardening

- **Firewall**: Ensure UFW only allows 80, 443, and your custom SSH port.
- **Fail2Ban**: 
  ```bash
  sudo apt install fail2ban
  sudo systemctl enable fail2ban
  sudo systemctl start fail2ban
  ```
- **Database/Cache Isolation**: Do NOT map PostgreSQL `5432` or Redis `6379` to external interfaces. Only map to localhost or keep them isolated within Podman networks.
- **Auto Updates**: Enable unattended upgrades for security patches.
  ```bash
  sudo apt install unattended-upgrades
  sudo dpkg-reconfigure --priority=low unattended-upgrades
  ```

---

## 12. Migration to Cloud VPS (Future)

When scaling to a VPS (Hetzner, DigitalOcean):
1. **Provision VPS**: Install Ubuntu 22.04/24.04.
2. **Setup Environment**: Repeat steps 1-4 of this guide on the new server.
3. **Database Migration**: 
   - Run a fresh DB backup on the local server.
   - Transfer using `scp`: `scp primeone_backup.sql deployer@new_vps_ip:/tmp/`
   - Restore on the new VPS.
4. **Code Deployment**: Clone repos and start services via PM2.
5. **DNS Update**: Go to Cloudflare Dashboard and change the `A` records to point to the new VPS IP.
6. **Testing**: Wait for DNS propagation and test all services.

---

## 13. Troubleshooting Guide

- **Podman Containers won't start:**
  Check logs: `podman logs primeone_db` or `podman logs primeone_redis`. Check if ports are already in use.
- **Database Connection Refused:**
  Ensure the database URL in `.env` uses `localhost` and the correct port. Ensure the Podman container is running (`podman ps`).
- **WebSocket connection failing:**
  If using Nginx, ensure `Upgrade` and `Connection` headers are set. With Caddy, WebSockets are supported out-of-the-box.
- **FCM Notifications not working:**
  Check if the server key is correct. Inspect the NestJS backend logs (`pm2 logs primeone-api`) for Firebase SDK errors.
- **File Uploads Failing:**
  Check Nginx `client_max_body_size` or Cloudflare upload limits (100MB on free plan). Verify R2 API keys and CORS policy.
