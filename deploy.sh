echo "Pulling repository"
git pull origin newproject

echo "Building Client"
cd /root/code-event/client && npm run build

echo "Build Finished"
cd /root/code-event/client && cp -r build /var/www/html

sudo service nginx restart 
echo "Nginx Restarted"

pm2 restart chaos
echo "Server Restarted"
