FROM 486456986266.dkr.ecr.us-west-1.amazonaws.com/crm/arya-node-api-service:ab9cc2e-1882
ENV BASE_DIR=/opt/capillary/cosmic/api/
RUN mkdir -p $BASE_DIR
RUN mkdir -p /mnt/downloads
COPY src $BASE_DIR/src
COPY tsconfig.json $BASE_DIR
COPY package.json $BASE_DIR
COPY tsconfig.build.json $BASE_DIR
COPY dist $BASE_DIR/dist
COPY node_modules $BASE_DIR/node_modules
COPY node_modules/@capillarytech/arya-common-utils/config/* /etc/capillary/php-config-util/
COPY newrelic.js $BASE_DIR
WORKDIR $BASE_DIR
EXPOSE 3000
CMD ["npm", "run", "start:prod"]