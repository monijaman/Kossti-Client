# 🚀 Next.js Deployment on Contabo VPS (Nginx + PM2 + Multi Sites)

This guide explains how to deploy a Next.js app on a Contabo VPS using:
- Nginx (reverse proxy)
- PM2 (process manager)
- Hostinger domain DNS
- Multiple site hosting support
- SSL setup

---

# 🧱 Architecture

Internet → Domain (Hostinger DNS) → Contabo VPS → Nginx → Next.js (PM2)

kossti.com → localhost:3000  
site2.com → localhost:3001  
site3.com → localhost:3002  

---

# 🔐 Step 1: Connect to VPS

ssh root@YOUR_VPS_IP

---

# 📦 Step 2: Update server

apt update && apt upgrade -y

---

# 🟢 Step 3: Install Node.js

curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

node -v
npm -v

---

# ⚙️ Step 4: Install PM2

npm install -g pm2

---

# 🌐 Step 5: Install Nginx

apt install nginx -y
systemctl enable nginx
systemctl start nginx

---

# 📁 Step 6: Upload project

mkdir -p /var/www
cd /var/www
git clone https://github.com/your-repo/kossti.git

---

# 📦 Step 7: Install & build Next.js

cd /var/www/kossti
npm install
npm run build

---

# 🚀 Step 8: Start with PM2

pm2 start npm --name kossti -- start

OR

PORT=3001 pm2 start npm --name kossti -- start

---

# 📊 Step 9: Check PM2

pm2 list

---

# 🧪 Step 10: Test locally

curl http://localhost:3000

---

# 🌍 Step 11: Nginx config

server {
    listen 80;
    server_name kossti.com www.kossti.com;

    location / {
        proxy_pass http://localhost:3000;
    }

    location ~* \.env {
        deny all;
    }

    location ~ /\. {
        deny all;
    }
}

---

# 🌐 Step 12: DNS

A record:
@ → VPS_IP
www → VPS_IP

---

# 🔒 Step 13: SSL

apt install certbot python3-certbot-nginx -y
certbot --nginx -d kossti.com -d www.kossti.com

---

# ❌ 502 ERROR FIX

Cause: backend not running

Fix:
pm2 logs kossti
pm2 restart all
