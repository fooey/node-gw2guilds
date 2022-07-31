ENV NODE_ENV production
ENV PORT 80
FROM node:16
COPY package*.json /usr/src/app/
RUN set -x \
  && cd /usr/src/app \
  && npm ci \
  && echo
WORKDIR /usr/src/app
COPY ./ /usr/src/app
RUN set -x \
  && npm run build \
  && echo
EXPOSE 80
CMD [ "npm", "start" ]
