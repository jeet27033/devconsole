FROM amd64/nginx

# Setting up base directory for devconsole UI
ENV BASE_DIR=/var/www/capillary/devconsole/ui
RUN echo $BASE_DIR

# creating base dir
RUN mkdir -p $BASE_DIR

# Copying generated dist directory at the time of deployer build to base directory 
COPY dist $BASE_DIR

# devconsole UI app nginx rule
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Working directory
WORKDIR $BASE_DIR

# Exposing port 80
EXPOSE 80

# nginx startup
CMD ["nginx", "-g", "daemon off;"]
