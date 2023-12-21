#!/bin/sh

cd /app/server || exit
npm run apply_migrations
npm start &

cd /app/client || exit

npm run build
npm run preview