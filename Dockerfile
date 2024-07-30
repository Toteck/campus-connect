# Use a imagem base do Node.js
ARG NODE_IMAGE=node:16.13.1-alpine
FROM $NODE_IMAGE AS base

# Instalação do dumb-init
RUN apk --no-cache add dumb-init

# Criação do diretório de trabalho e ajuste de permissões
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node

# Copia dos arquivos package.json e package-lock.json e instalação das dependências
COPY --chown=node:node ./package*.json ./
RUN npm install

# Copia do restante dos arquivos da aplicação
COPY --chown=node:node . .

# Exposição da porta e comando de inicialização
EXPOSE $PORT
CMD [ "dumb-init", "npm", "run", "dev" ]
