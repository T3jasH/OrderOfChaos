server {
	listen 80;
	listen [::]:80;

  root /var/www/html/build;

	# Add index.php to the list if you are using PHP
	index index.html index.htm index.nginx-debian.html;

	server_name chaostesttrial.iecsemanipal.com;

	location / {
		# First attempt to serve request as file, then
		# as directory, then fall back to displaying a 404.
		# try_files @api $uri /index.html;
		try_files $uri /index.html =404;
	}

  location /api {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  location /.well-known {
    default_type text/plain;
  }
}
