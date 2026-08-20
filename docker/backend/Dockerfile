#Builder Stage
FROM node:alpine3.21 

RUN addgroup -S sysuser --gid 2100 && \
    adduser -S sysuser --uid 2101 -G sysuser

WORKDIR /app/backend

#sorting dependencies before the whole backend app
COPY Backend/package*.json /app/backend/
RUN npm ci

COPY --chown=sysuser:sysuser Backend /app/backend/

#${} these values are provided by the CI pipeline
LABEL org.opencontainers.image.version=${VERSION}\
      org.opencontainers.image.authors="sanrosebhetuwal@gmail.com"\
      org.opencontainers.image.description="Backend API"\
      org.openconatiners.image.created=${BUILD_TIME}


RUN mkdir -p logs && chown -R sysuser:sysuser /app/backend

USER sysuser:sysuser

EXPOSE 3000

CMD [ "npm", "run", "start" ]



