# MBG: Road To School (My Mobil Gwehh)

Game side-scrolling 2D physics platformer tentang perjuangan **Mas Tion** mengantarkan 500 porsi paket gizi hangat menuju kawasan sekolah fiktif **SD, SMP, dan SMA Puspa Bangsa Cirebon** demi Bu Yulie dan siswa-siswi, didampingi petuah bijak supir veteran **Mang Abdul**.

Didukung arsitektur ganda: **React 19 & Next.js 16 (Turbopack)** untuk pengalaman aplikasi web modern, serta **Standalone HTML5 Canvas** untuk kemudahan bermain tanpa build.

---

## Cara Menjalankan

### Opsi A: Mode Fullstack Next.js / React (Rekomendasi)
Memerlukan Node.js (v18+). Dari root direktori proyek (`c:\Projects\game`):
```bash
# Instal dependensi (jika baru pertama kali clone)
npm install

# Jalankan server pengembangan
npm run dev
```
Buka browser di: [http://localhost:3000](http://localhost:3000)

Untuk build produksi:
```bash
npm run build
npm start
```

### Opsi B: Mode Standalone HTML5 Canvas (Tanpa Build)
Dapat dijalankan langsung dengan server HTTP statis:
```bash
# Menggunakan Python
python -m http.server 8000

# Atau menggunakan PHP
php -S localhost:8000
```
Buka browser di: [http://localhost:8000](http://localhost:8000)

> [!NOTE]
> Gunakan protokol HTTP (`http://`), jangan membuka langsung lewat `file://` agar browser dapat memuat modul ES (`game_core.js`) dan file `manifest.json`.

---

## Fitur Utama

1. **Kampanye 20 Level Penuh Cerita**:
   - Peningkatan jarak bertahap dari 800m (Level 1) hingga 4500m (Level 20).
   - Dialog Visual Novel (Intro & Outro) di setiap level dengan karakter Mas Tion, Bu Yulie, Zacky, Husna, Mang Abdul, dan Pak RT.
2. **Garasi Zacky (Upgrade Komponen & Kustomisasi)**:
   - Tingkatkan **Mesin** (torsi & tanjakan), **Grip Ban** (traksi aspal & lumpur), dan **Suspensi** (pegas & peredam kejut) dari Level 1 hingga 20.
   - Pilihan 5 varian skin bodi truk (*Standard Box, Speedy Courier, Mountain 4x4, Retro Classic, Sport Tuned*) dan 4 desain velg roda (*Stock Steelie, Gold Racing, Mud Beadlock, White-Wall*).
   - Live Canvas Preview truk di dalam bengkel modifikasi.
3. **8 Bioma Dedikasi & Parallax Scrolling**:
   - Setiap segmen jalan memiliki ilustrasi latar belakang WebP resolusi tinggi tersendiri:
     1. Pesisir Pantai Pantura
     2. Jalur Arteri Pantura
     3. Hamparan Lembah Sawah
     4. Pedesaan Lumbung Padi
     5. Puncak Siluet Gn. Ciremai
     6. Lereng Hutan Pinus Terjal
     7. Kawasan Pemukiman Suburb
     8. Kompleks Sekolah Puspa Bangsa (Garis Finis)
   - Transisi mulus 200m dengan dynamic RGBA skybox lerping.
4. **Antarmuka Modern Bebas "AI Slop"**:
   - Kontrol pedal sentuh **Glassmorphic Cyber-Chic** dengan haptic grip dots dan glow LED border.
   - Tanpa efek garis-garis scanlines yang mengganggu kejernihan grafis.
   - Logo resmi PNG resolusi tinggi terpasang rapi.
5. **Ekonomi Koin Permanen**:
   - Koin gizi yang dikumpulkan di jalanan otomatis tersimpan ke `localStorage`, bahkan saat mobil terguling atau kehabisan bensin.

---

## Kontrol Permainan

| Aksi | Keyboard (Desktop) | Sentuh (Mobile / Tablet) |
| :--- | :--- | :--- |
| **Gas / Akselerasi** | `D`, `W`, `Panah Kanan`, `Panah Atas` | Pedal Kanan (**GAS**) |
| **Rem / Mundur** | `A`, `S`, `Panah Kiri`, `Panah Bawah` | Pedal Kiri (**REM**) |
| **Klakson Telolet** | `H` atau `Spasi` | Tombol Tengah (**TELOLET**) |
| **Jeda (Pause)** | `Esc` | Tombol Jeda `⏸️` di HUD |
| **Mulai Ulang (Restart)** | `R` | Tombol Ulangi di Layar Selesai |

- **Dinamika Udara (Air-Pitch)**: Saat melayang, tahan `Gas` untuk mengangkat hidung mobil (*pitch up*) atau tahan `Rem` untuk menurunkan hidung (*pitch down*). Sesuaikan sudut pendaratan agar sejajar dengan kemiringan tanah guna menyerap guncangan dan menyelamatkan paket sayur lodeh!

---

## Pengujian & Verifikasi

Seluruh logika fisika, aturan kampanye, dan integritas antarmuka diuji menggunakan test runner Node.js bawaan:
```bash
npm test
```
**Hasil Aktual**: **80/80 Unit Test Lulus (0 Gagal)**, mencakup:
- Fisika suspensi pegas-redam ganda, weight transfer, dan landing shock absorption.
- Simulasi end-to-end 20 level tanpa NaN atau crash.
- Kelengkapan dialog visual novel dan kurva biaya upgrade garasi.
- Kompilasi produksi Next.js 16 (`npm run build`) berhasil 100% tanpa error.

---

## Dokumentasi Teknis

- [PRD (Product Requirement Document)](docs/PRD.md)
- [Arsitektur Teknis](docs/ARCHITECTURE.md)
- [Panduan Gameplay](docs/GAMEPLAY.md)
- [Panduan Aset & Manifest](docs/ASSETS_GUIDE.md)
- [Prompt AI Higgsfield Karakter & Skin](docs/CHARACTERS_AND_SKINS_PROMPTS.md)
- [Strategi & Hasil Testing](docs/TESTING.md)
- [Panduan Deployment](docs/DEPLOYMENT.md)
- [Log Implementasi](docs/IMPLEMENTATION_LOG.md)
- [Catatan Maintainer (Memory)](docs/memory.md)
