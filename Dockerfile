FROM nginx:mainline-alpine-slim

COPY ./dist/ /wwwroot/

RUN rm -rf /etc/nginx || true
COPY ./docker/nginx/config/ /etc/nginx/

RUN rm -rf /docker-entrypoint.d/* || true

EXPOSE 80
