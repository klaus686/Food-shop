# Simple static site image using nginx
FROM nginx:alpine

# Remove default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy the site into nginx's web root
COPY index.html styles.css script.js /usr/share/nginx/html/

# nginx listens on 80 by default — expose it for clarity
EXPOSE 80

# nginx's default image already runs the server in the foreground,
# so no CMD override is needed.
