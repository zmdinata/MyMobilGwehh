# MMG: Road To School (My Mobil Gwehh)

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
2. **Garasi Zacky (Upgrade Komponen & Kustomisasi Dua Tahap)**:
   - Tingkatkan **Mesin** (torsi & tanjakan), **Grip Ban** (traksi aspal & lumpur), dan **Suspensi** (pegas & peredam kejut) dari Level 1 hingga 20.
   - Pilihan 5 varian skin bodi truk (*Standard Box, Speedy Courier, Mountain 4x4, Retro Classic, Sport Tuned*) dan 5 desain velg roda (*Stock Steelie, Gold Racing, Mud Beadlock, White-Wall, Offroad Spoke*).
   - Sistem **Ekonomi Dua Tahap Ketat**: Buka Level $\to$ Beli dengan Koin $\to$ Pasang Gratis Permanen.
   - Proporsi kendaraan **Offroad Stance Realistis** (anti-gepeng) dengan bayangan membumi di lantai garasi.
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
4. **Antarmuka Elegan "Floating Translucent Aero-Glass"**:
   - Seluruh 9 modal dan komponen HUD dirombak ke tema kaca transparan frosted (`backdrop-blur-xl`, `border-white/20`, bayangan neon halus) tanpa border hitam pekat atau container gelap yang menutupi background.
   - Kontrol pedal sentuh **Glassmorphic Cyber-Chic** dengan haptic grip dots dan glow LED border.
   - Tanpa efek garis-garis scanlines yang mengganggu kejernihan grafis.
   - Logo resmi PNG resolusi tinggi terpasang rapi.
5. **Sistem Audio WebAudio Canggih & Backsound Romantis Outro**:
   - Pemadaman seketika seluruh suara mobil saat menyentuh garis finish untuk suasana outro yang tenang.
   - Sekuensing Fanfare Kemenangan (1 detik) disusul **Backsound Romantis Asmara Mas Tion & Bu Yulie** (Cmaj7 – Am9 – Fmaj7 – G6) dengan kejernihan filter 3400Hz, dual-string chorus unison, dan resonansi sustain yang berlanjut mulus hingga Kartu Kemenangan.
6. **Ekonomi Koin Permanen**:
   - Koin gizi yang dikumpulkan di jalanan otomatis tersimpan ke `localStorage`, bahkan saat mobil terguling atau kehabisan bensin.

---

## Kontrol Permainan

| Aksi | Keyboard (Desktop) | Sentuh (Mobile / Tablet) |
| :--- | :--- | :--- |
| **Gas / Akselerasi** | `D`, `W`, `Panah Kanan`, `Panah Atas` | Pedal Kanan (**GAS**) |
| **Rem / Mundur** | `A`, `S`, `Panah Kiri`, `Panah Bawah` | Pedal Kiri (**REM**) |
| **Klakson Telolet** | `H` atau `Spasi` | Tombol Tengah (**TELOLET**) |
| **Jeda (Pause)** | `Esc` | Tombol Jeda di HUD |
| **Mulai Ulang (Restart)** | `R` | Tombol Ulangi di Layar Selesai |

- **Dinamika Udara (Airborne & Stunts)**:
  - Torsi kendali udara telah dioptimalkan ke `6.5 rad/s²` (berskala +3%/level dengan peningkatan suspensi). Saat melayang, tahan `Gas` untuk mengangkat hidung mobil (*pitch up*) atau tahan `Rem` untuk menurunkan hidung (*pitch down*).
  - Tampil lencana neon real-time di atas mobil saat melayang (`AIR TIME X.Xs ✈️`), melakukan wheelie roda belakang (`WHEELIE X.Xs ⚡`), atau stoppie roda depan (`STOPPIE X.Xs 🛑`).
  - Berhasil mendarat mulus setelah manuver akrobatik menghadiahkan bonus koin gizi instan (+5 s.d. +30 koin) dan disimpan permanen ke tabungan pemain!

---

## Pengujian & Verifikasi

Seluruh logika fisika, aturan kampanye, dan integritas antarmuka diuji menggunakan test runner Node.js bawaan:
```bash
npm test
```
**Hasil Aktual**: **96/96 Unit Test Lulus (0 Gagal)**, mencakup:
- Deteksi airborne real-time, timer melayang, live badges, dan akumulasi bonus koin stunt.
- Stunt wheelie & stoppie satu roda dengan validasi pendaratan aman.
- Fisika suspensi pegas-redam ganda, weight transfer, dan landing shock absorption.
- Simulasi end-to-end 20 level tanpa NaN atau crash pada 30, 60, dan 120 FPS.
- Harmonisasi antarmuka Floating Translucent Aero-Glass di seluruh modal dan HUD.
- Sistem ekonomi dua tahap ketat (Level Unlock -> Coin Purchase -> Equip) dan kalibrasi render per-skin.
- Sintesis audio WebAudio, pemadaman instan audio kendaraan outro, dan tema romantis.
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
