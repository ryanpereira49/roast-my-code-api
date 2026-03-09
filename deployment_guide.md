# VPS Deployment Guide

This guide explains how to deploy the **Roast My Code API** to a Linux VPS (Ubuntu/Debian) for production use.

## 1. Prerequisites

Ensure your VPS has the following installed:
- **Node.js** (v20 or higher)
- **NPM**
- **Git**
- **PM2** (Process Manager 2) - Install with `npm install -g pm2`

## 2. Setup the Project

Clone the repository and install dependencies:

```bash
git clone https://github.com/ryanpereira49/roast-my-code-api.git
cd roast-my-code-api
npm install
```

## 3. Environment Variables

Create a `.env` file and add your Gemini API Key:

```bash
cp .env.example .env
nano .env 
# Add: GEMINI_API_KEY=your_key_here
```

## 4. Build and Start

The project uses TypeScript, so it must be compiled before running in production.

```bash
# Compile TypeScript to JavaScript
npm run build

# Start the application with PM2
pm2 start dist/index.js --name "roast-api"

# (Optional) Ensure it starts on reboot
pm2 save
pm2 startup
```

## 5. Reverse Proxy (Nginx) - Optional but Recommended

To expose the API on port 80/443 with a domain:

1. Install Nginx: `sudo apt install nginx`
2. Create a config: `sudo nano /etc/nginx/sites-available/roast-api`
3. Add the following:

```nginx
server {
    listen 80;
    server_name yourdomain.com; # Or your IP

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

4. Enable it: `sudo ln -s /etc/nginx/sites-available/roast-api /etc/nginx/sites-enabled/`
5. Test and Restart: `sudo nginx -t && sudo systemctl restart nginx`

## 6. Update API

To update the code on your VPS in the future:

```bash
git pull
npm install
npm run build
pm2 restart roast-api
```
