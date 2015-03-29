apt-get update
apt-get install -y nginx
if [ -f /etc/nginx/sites-enabled/default ]; then
  rm /etc/nginx/sites-enabled/default
  rm /etc/nginx/sites-available/default
fi
cp /var/www/kenthackenough-ui-main/config/main.khe.conf /etc/nginx/sites-available
ln -s /etc/nginx/sites-available/main.khe.conf /etc/nginx/sites-enabled
service nginx reload
echo "---------------------------------------------"
echo "| See application at http://localhost:4000/ |"
echo "---------------------------------------------"