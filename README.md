# Step by step integration to next.js and laravel.
```sh

FRONTEND = Next.js

npm install

run cmd and input ipconfig (locate ip address example: 192.168.68.154)

locate .env.local edit "NEXT_PUBLIC_API_BASE_URL=http://192.168.68.154:8000/api" to your ip address*

2 ways
run npm run dev -- --host=192.168.68.154 --port=3000

another way

locate package.json and edit the following:
"dev": "next dev --hostname 192.168.68.154 --port 3000",
"start": "next start --hostname 192.168.68.154 --port 3000",

BACKEND = Laravel

npm install

php artisan env:decrypt --force --key=base64:0rPEg5jGaTu42J4qqE3vTy1MpMsFDy2CxvtDI8eaHrQ=

php artisan migrate

php artisan db:seed

php artisan serve --host=192.168.68.154 --port=8000 your ip address*
