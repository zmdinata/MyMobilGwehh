# Panduan Menjalankan & Men-deploy

Dokumen ini menjelaskan tata cara pengujian lokal dan deployment aplikasi **MBG: Road To School** ke lingkungan staging maupun produksi.

---

## 1. Menjalankan di Lingkungan Lokal

### Opsi A: Server Fullstack Next.js 16 (Rekomendasi)
```bash
# Dari root c:\Projects\game
npm install
npm run dev
```
Akses aplikasi melalui browser: [http://localhost:3000](http://localhost:3000)

### Opsi B: Build Produksi Lokal Next.js
```bash
npm run build
npm start
```
Aplikasi berjalan pada mode produksi teroptimasi di port 3000.

### Opsi C: Standalone HTML5 Canvas (Tanpa Build)
```bash
python -m http.server 8000
```
Buka di browser: [http://localhost:8000](http://localhost:8000)

---

## 2. Opsi Deployment ke Produksi

### A. Deployment ke Vercel (Next.js Fullstack & Native Mobile/Desktop Canvas)
Proyek ini dikonfigurasi secara native untuk Next.js 16 & Vercel:
1. Hubungkan repositori GitHub `zmdinata/MyMobilGwehh` ke dashboard Vercel.
2. Vercel secara otomatis mendeteksi framework Next.js:
   - Build Command: `next build` (otomatis menjalankan `prebuild: node scripts/sync_html.js` untuk sinkronisasi `index.html` $\to$ `public/index.html`)
   - Output Directory: `.next`
   - Install Command: `npm install`
3. Routing:
   - Request root `/` otomatis di-*rewrite* ke `/index.html` via `next.config.js`.
   - API endpoints (`/api/levels`, `/api/story`, `/api/upgrades`) tetap aktif berjalan via Node.js runtime.
4. Mobile Landscape & PWA:
   - Berkas `public/app.webmanifest` mengonfigurasi orientasi landscape native dan tampilan layar penuh.
   - Enforcer orientasi `#rotateDeviceOverlay` memandu pemain memutar ponsel saat mode potret terdeteksi dan menyediakan tombol masuk layar penuh.

### B. Deployment Self-Hosted (Node.js Server / Docker)
1. Jalankan `npm run build` di server target.
2. Jalankan process manager (PM2 / Systemd):
   ```bash
   pm2 start npm --name "mbg-game" -- start
   ```
3. Arahkan reverse proxy (Nginx / Caddy) ke port `3000`.

### C. Deployment Statis (GitHub Pages / Netlify / CDN)
Jika ingin menyajikan game murni berbasis canvas statis tanpa Node runtime:
- Deploy berkas: `index.html`, `game_core.js`, direktori `assets/`, dan `assets/manifest.json`.

---

## 3. Strategi Cache & Header Aset

- **Berkas Kode & Manifest**:
  - `index.html`, `public/index.html`, `assets/manifest.json`, `public/app.webmanifest`: Menggunakan header `Cache-Control: public, max-age=0, must-revalidate` agar pemain selalu mendapatkan update versi cerita dan level terbaru.
- **Aset Gambar Versi (v11)**:
  - Berkas di bawah `assets/refresh/v11/...` dapat di-cache secara immutable: `Cache-Control: public, max-age=31536000, immutable`.
  - Jika ada pembaruan gambar, buat direktori versi baru (misal `v12`) dan perbarui rujukan di `manifest.json`.

---

## 4. Checklist Keamanan & Kesiapan Deploy

- [x] Tidak ada berkas `.env`, token rahasia, atau kredensial API yang ter-commit.
- [x] Seluruh 96 unit test lulus 100% (`npm test`).
- [x] Build produksi lulus tanpa error Turbopack (`npm run build`).
- [x] Sinkronisasi otomatis `index.html` $\to$ `public/index.html` pada tahapan `prebuild`.
- [x] Enforcer mobile landscape & proteksi auto-pause saat rotasi aktif.
- [x] PWA manifest dengan `orientation: landscape` terkonfigurasi di `public/app.webmanifest`.
- [x] Responsivitas kontrol mobile sentuh dan keyboard desktop terverifikasi.
