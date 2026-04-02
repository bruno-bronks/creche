#!/bin/bash

# Configuration
REPO_URL="https://github.com/bruno-bronks/creche.git"
APP_DIR="/var/www/creche"
NGINX_CONF="/etc/nginx/sites-available/creche"

# 1. Update and Install Dependencies
echo "Step 1: Updating system and installing dependencies..."
apt update
apt install -y nginx git nodejs npm

# 2. Setup App Directory
echo "Step 2: Cloning repository..."
if [ -d "$APP_DIR" ]; then
    echo "Directory exists, pulling latest changes..."
    cd $APP_DIR
    git pull
else
    echo "Cloning fresh repository..."
    git clone $REPO_URL $APP_DIR
fi

# 3. Configure Nginx
echo "Step 3: Configuring Nginx..."
cat <<EOF > $NGINX_CONF
server {
    listen 5500;
    server_name 148.230.79.134;

    root $APP_DIR;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }

    location ~ /\. {
        deny all;
    }

    error_page 404 /index.html;
}
EOF

# 4. Enable Configuration
ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 5. Check and Restart Nginx
echo "Step 4: Restarting Nginx..."
nginx -t && systemctl restart nginx

echo "------------------------------------------------"
echo "Deployment Complete!"
echo "You can access the system at: http://148.230.79.134:5500"
echo "------------------------------------------------"
