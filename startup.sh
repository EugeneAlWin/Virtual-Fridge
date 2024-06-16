#!/bin/sh
cd /app || exit

bun run apply_migrations
bun run preview:server
