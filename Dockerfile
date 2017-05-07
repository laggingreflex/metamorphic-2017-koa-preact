FROM mhart/alpine-node

RUN apk add --update bash

# RUN apt-get update
# RUN apt-get install -y git
# RUN apt-get install -y vim

# # If you have native dependencies, you'll need extra tools
# RUN apk add --no-cache make gcc g++ python
# RUN npm -g i -s --depth=0 node-gyp

RUN npm -g i -s --depth=0 yarn

WORKDIR /app

ENV NODE_ENV=production
# RUN echo NODE_ENV=$NODE_ENV

# This installs node_modules in the *image*
ADD package.json .
RUN yarn

# This creates a volume that contains a copy of node_modules from the image, and mounts it in the container (http://jdlm.info/articles/2016/03/06/lessons-building-node-app-docker.html#the-nodemodules-volume-trick)
VOLUME /app/node_modules

CMD bash -li
