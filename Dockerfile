FROM node:21-alpine3.18
WORKDIR /app
COPY . .

WORKDIR /app/server
RUN npm i 
RUN npx prisma generate 
RUN npm run compile

WORKDIR /app/client
RUN npm i 

WORKDIR /app
RUN chmod +x startup.sh
CMD ["/bin/sh", "startup.sh" ]