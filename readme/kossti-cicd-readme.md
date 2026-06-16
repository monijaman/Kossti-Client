# 🚀 CI/CD for Kossti-Client (Next.js + VPS + Nginx + PM2)

This guide sets up **fully automated deployment** from GitHub → Contabo VPS.

---

# 🧱 1. VPS Setup (One Time)

```bash
sudo apt update
sudo apt install git nodejs npm -y
sudo npm install -g pm2
```

Clone project:

```bash
cd /var/www
git clone https://github.com/monijaman/Kossti-Client.git
cd Kossti-Client
npm install
npm run build
```

Start PM2:

```bash
pm2 start npm --name "kossti-client" -- start
pm2 save
pm2 startup
```

---

# 🔐 2. SSH Key Setup

## On Windows (local machine)

```bash
ssh-keygen -t ed25519 -C "github-actions"
```

Public key:
```
C:\Users\YOUR_USER\.ssh\id_ed25519.pub
```

---

## Add to VPS

```bash
ssh root@YOUR_SERVER_IP
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
```

Paste public key:

```
ssh-ed25519 AAAA... github-actions
```

Fix permissions:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

---

# 🔑 3. GitHub Secrets

Add in:
Repo → Settings → Secrets → Actions

| Key | Value |
|-----|------|
| SSH_HOST | YOUR_SERVER_IP |
| SSH_USER | root |
| SSH_PRIVATE_KEY | (your private key) |

---

# ⚙️ 4. GitHub Actions Workflow

Create:

```
.github/workflows/deploy.yml
```

```yaml
name: Deploy to VPS

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -H "${{ secrets.SSH_HOST }}" >> ~/.ssh/known_hosts

      - name: Deploy
        run: |
          ssh ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }} << 'EOF'
            cd /var/www/Kossti-Client
            git pull origin main
            npm install
            npm run build
            pm2 restart kossti-client || pm2 start npm --name "kossti-client" -- start
            pm2 save
          EOF
```

---

# 🌐 5. Nginx Config

```nginx
server {
    server_name kossti.com www.kossti.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

Reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

# 🚀 6. Deploy Flow

```text
git push → GitHub Actions → SSH VPS → pull code → build → restart PM2 → live update
```

---

# ❌ Common Issues

### SSH_HOST empty
→ Add secret correctly

### Permission denied
→ Fix authorized_keys

### build fails
```bash
npm install && npm run build
```

---

# 🎉 Done
You now have full CI/CD pipeline.
