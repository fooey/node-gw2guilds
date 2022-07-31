FROM node:16-alpine
COPY package*.json /usr/src/app/
RUN set -x \
  && cd /usr/src/app \
  && apk update \
  && apk upgrade \
  && apk add --no-cache python make gcc g++ sqlite sqlite-dev \
  && npm ci \
  && echo
WORKDIR /usr/src/app
COPY ./ /usr/src/app
RUN set -x \
  && npm run build \
  && apk del --no-cache python make gcc g++ sqlite sqlite-dev \
  && rm -rf /usr/include \
  && rm -rf /var/cache/apk/* /root/.node-gyp /usr/share/man /tmp/* \
  && echo
ENV NODE_ENV production
ENV PORT 80
EXPOSE 80
CMD [ "npm", "start" ]
