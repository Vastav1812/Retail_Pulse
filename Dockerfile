FROM node:20-bookworm-slim

WORKDIR /app


RUN apt-get update && apt-get install -y \
    libvips-dev \
    libvips42 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .


RUN npm run build

CMD ["npm", "start"]
