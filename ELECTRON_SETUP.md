# CBT Frontend React + Electron

Project ini sudah ditambahkan konfigurasi Electron agar React/Vite bisa berjalan sebagai aplikasi desktop.

## 1. Install dependency

```bash
npm install
```

## 2. Jalankan backend dulu

Pastikan backend API sudah hidup, misalnya:

```txt
http://localhost:5500/api
```

Atau gunakan backend Railway:

```txt
https://nama-backend.up.railway.app/api
```

## 3. Atur environment Electron

File `.env.electron`:

```env
VITE_ROUTER_MODE=hash
VITE_API_BASE_URL=http://localhost:5500/api
```

Kalau backend sudah online di Railway, ubah menjadi:

```env
VITE_ROUTER_MODE=hash
VITE_API_BASE_URL=https://nama-backend.up.railway.app/api
```

## 4. Run development Electron

```bash
npm run electron:dev
```

Command ini menjalankan Vite dev server dan membuka window Electron.

## 5. Test production build di Electron

```bash
npm run electron:preview
```

## 6. Build installer/app desktop

```bash
npm run electron:dist
```

Output installer akan masuk ke folder:

```txt
release/
```

## 7. Catatan route

Electron menggunakan `HashRouter` lewat `VITE_ROUTER_MODE=hash`, supaya route tetap aman saat app dibuka dari file lokal `dist/index.html`.

Untuk mode web biasa, bisa pakai:

```env
VITE_ROUTER_MODE=browser
```
