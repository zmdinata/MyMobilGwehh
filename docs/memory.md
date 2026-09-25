# Catatan Maintainer (Memory)

Snapshot teknis dan panduan operasional proyek. Jika terdapat diskrepansi antara dokumentasi dan kode implementasi, utamakan kode aktif (`game_core.js`, `components/`, `app/`, dan test suite) lalu sinkronkan dokumentasi.

---

## 1. Status Aktif — 2026-09-25

- **Arsitektur Dual-Stack**:
  1. **Next.js 16 + React 19 (Modern Fullstack)**:
     - Framework: Next.js 16.3.6 (Turbopack) dengan React 19.3.0.
     - Frontend Component Suite: modular di `components/` (`GameCanvas`, `GameHud`, `TouchPedals`, `WelcomeModal`, `MainMenuModal`, `LevelSelectModal`, `GarageModal`, `DialogueModal`, `VictoryModal`, `GameOverModal`, `PauseModal`).
     - Backend API Routes: `/api/levels`, `/api/story`, `/api/upgrades`.
     - Styling: Tailwind CSS v4 (`@tailwindcss/postcss`).
     - Jalankan: `npm run dev` (dev) atau `npm run build && npm start` (prod).
  2. **Standalone HTML5 Canvas (`index.html`)**:
     - Berfungsi penuh tanpa bundler/Node runtime (`python -m http.server 8000`).
     - Menjaga kompatibilitas 100% dengan tes regresi legacy.
- **Engine Inti Bersama**:
  - `game_core.js` & `public/game_core.js` digunakan bersama oleh browser, React runtime, dan test runner Node.js (`test/*.test.mjs`).
  - Query runtime: `game_core.js?v=20260925-gameplay11`.
- **Hasil Pengujian**:
  - **80 Unit Test Lulus 100% (0 Gagal)** dijalankan via `npm test` (`node --test test/*.test.mjs`).
  - **Next.js Production Build Lulus 100% (0 Error, 0 Warning)** via `npm run build`.

---

## 2. Kanon Cerita & Karakter (Storytelling Lore)

- **Protagonis & Driver Utama**: **Mas Tion** — pemuda tangguh pengemudi truk logistik gizi MBG yang berjuang mengantarkan 500 porsi paket gizi hangat (nasi pulen, ayam serundeng, tahu-tempe orek, sayur lodeh, dan susu murni) tepat waktu sebelum pukul 09:45 WIB.
- **Tokoh Idaman**: **Bu Yulie** — guru muda bersahaja dan penuh dedikasi di Sekolah Puspa Bangsa Cirebon yang menjadi inspirasi dan tujuan perjuangan Mas Tion.
- **Mentor Veteran**: **Mang Ucup** — mantan supir elf balap legendaris trayek Cirebon–Kuningan yang sudah tobat dan kini membimbing Mas Tion dengan petuah bijak (*gas itu keberanian, rem itu kebijaksanaan*). **Mang Ucup BUKAN supir utama**, melainkan mentor pendamping.
- **Montir Bengkel**: **Zacky** — sahabat karib Tion yang memodifikasi armada truk di Garasi Zacky (upgrade mesin, ban, dan shockbreaker).
- **Mak Comblang Ceria**: **Husna** — siswi SMA Puspa Bangsa yang usil dan kerap menggoda kedekatan Mas Tion dengan Bu Yulie (*"Cieee Mas Tion!"*).
- **Tokoh Pendukung**: **Pak RT** — tokoh warga pesisir yang memotivasi pengantaran gizi anak bangsa.
- **Sekolah Tujuan**: Kompleks pendidikan fiktif **SD, SMP, dan SMA Puspa Bangsa Cirebon**. Hindari penyebutan universitas, nama institusi nyata, merek dagang, atau lambang negara resmi.

---

## 3. Kampanye 20 Level & 8 Bioma Dedikasi

Sistem kampanye terdiri dari 20 level dengan kenaikan jarak tempuh bertahap (800m s.d. 4500m) dan batas waktu yang menantang:
- **Level 1–5**: Jarak 800m – 1200m (Pesisir Pantura & Lembah Sawah).
- **Level 6–10**: Jarak 1350m – 2000m (Pedesaan Sawah, Kubangan Lumpur, Puncak Siluet).
- **Level 11–15**: Jarak 2200m – 3000m (Lereng Hutan Pinus Terjal, Bebatuan Curam).
- **Level 16–20**: Jarak 3300m – 4500m (Maraton Ekstrem 8 Bioma Menuju Sekolah).

### Pemetaan 8 Bioma Dedikasi:
Setiap bioma terhubung 1:1 ke aset ilustrasi latar belakang dan transisi 200m yang halus:
1. `BIOMES.PESISIR_PANTURA` (ID 1) $\to$ `biome1Distant` (*Pesisir Pantai Pantura*)
2. `BIOMES.JALUR_PANTURA` (ID 2) $\to$ `biome1Midground` (*Jalur Arteri Pantura*)
3. `BIOMES.LEMBAH_SAWAH` (ID 3) $\to$ `biome2Distant` (*Hamparan Lembah Sawah*)
4. `BIOMES.DESA_SAWAH` (ID 4) $\to$ `biome2Midground` (*Pedesaan Lumbung Padi*)
5. `BIOMES.PUNCAK_GUNUNG` (ID 5) $\to$ `biome3Distant` (*Puncak Siluet Gn. Ciremai*)
6. `BIOMES.LERENG_GUNUNG` (ID 6) $\to$ `biome3Midground` (*Lereng Hutan Pinus Terjal*)
7. `BIOMES.PEMUKIMAN` (ID 7) $\to$ `biome4Distant` (*Kawasan Pemukiman Suburb*)
8. `BIOMES.SEKOLAH` (ID 8) $\to$ `biome4Midground` (*Kompleks Sekolah Puspa Bangsa*)

> [!IMPORTANT]
> **Invarian Garis Finis**: Seluruh 20 level secara algoritmik dijamin selalu berakhir pada bioma Sekolah Puspa Bangsa (`BIOMES.SEKOLAH` / ID 8) dengan gerbang sekolah, bendera merah putih, dan parkiran datar yang aman.

---

## 4. Garasi Zacky (Upgrades & Kustomisasi)

- **Fisika Komponen (Level 1–20)**:
  - Daya Mesin (*Engine Power*): $P = 2200 + (\text{level} - 1) \times 80$ (Rentang 2200 s.d. 3720).
  - Cengkeraman Ban (*Tire Grip*): $G = 1.00 + (\text{level} - 1) \times 0.03$ (Rentang 1.00x s.d. 1.57x).
  - Pegas Suspensi (*Spring $K$*): $K = 180 + (\text{level} - 1) \times 4$ (Rentang 180 s.d. 256).
  - Redaman Suspensi (*Damper $C$*): $C = 18.8 + (\text{level} - 1) \times 0.4$ (Rentang 18.8 s.d. 26.4).
- **Formula Biaya Upgrade**:
  $$\text{Cost} = \text{round}\left(50 \times 1.35^{\text{level} - 1}\right)$$
- **Skin Bodi Terbuka**:
  - Standard MBG Box (Lv 1)
  - Speedy Aerodynamic Courier (Lv 4)
  - Mountain 4x4 Heavy Duty (Lv 8)
  - Retro Classic Oplet (Lv 12)
  - Sport Tuned Delivery (Lv 16)
- **Velg Terbuka**:
  - Stock Steelie (Lv 1)
  - Gold Racing Alloy (Lv 5)
  - Mud Offroad Beadlock (Lv 10)
  - White-Wall Classic Cruiser (Lv 15)
- **Ekonomi & Wallet**:
  - Koin gizi disimpan ke `localStorage`. Pemain yang gagal atau mobilnya terguling tetap membawa pulang seluruh koin yang dikumpulkan sepanjang perjalanan.

---

## 5. Standar Aset & Pencegahan "AI Slop"

- **Logo Resmi**: Selalu gunakan logo resmi PNG resolusi tinggi: [`assets/refresh/v11/sprites/logo.png`](file:///c:/Projects/game/assets/refresh/v11/sprites/logo.png). Jangan gunakan ikon SVG pita jadul.
- **Pembersihan Visual Noise**:
  - Dilarang menambahkan lapisan overlay CRT scanlines yang menyebabkan visual bergaris-garis kasar.
  - Kontrol kemudi di layar sentuh wajib menggunakan **Glassmorphic Cyber-Chic Pedals** dengan haptic grip dots dan glow LED border (`cyan` Gas, `red` Rem/Mundur, `amber` Telolet).
  - Tidak boleh ada container gelap kosong (*dark void*) yang memotong aspek rasio gameplay canvas.
- **Penyelarasan Sprites & Parallax Canvas**:
  - Log rintangan (`obstacle_log.png`): terpotong rapat (*tight-cropped*) tanpa padding transparan bawah agar kayu menancap pas di permukaan tanah.
  - Gerbang finis sekolah (`finish_gate.png`): skala tinggi 180px dengan proporsi ortografis terjaga.
  - **Anchoring Background Jauh**: Lapisan latar belakang jauh (`drawDistantParallaxLayer`) wajib selalu dijangkarkan pada $y = 0$ (`topRatio = 0.0`, `heightRatio = 0.92`) agar kanvas langit menutup sempurna dari tepi atas layar hingga cakrawala tanpa celah ("bolong").
  - **Palet Skybox Alami**: Palet langit (`skyPalettes`) seluruh bioma siang hari (termasuk Biome 4 Pedesaan Sawah) menggunakan gradien biru atmosferik alami (`top: [56, 189, 248]`), bukan warna hijau rumput yang menyebabkan artefak strip neon hijau.
- **Standar Ikon Vektor Lucide (Kebijakan Nol Emoticon / Emojis)**:
  - Seluruh elemen UI, badge, tombol, dialog, modal, HUD, dan pedal dilarang menggunakan karakter unicode emoticon/emoji (misal `🚚💨`, `🪙`, `⛽`, `🔊`, `🎯`, `⚠️`, `🔧`, `💥`, `🏆`, dll.).
  - **React Components Suite (`components/`)**: Menggunakan pustaka resmi [`lucide-react`](https://lucide.dev/) (`Coins`, `Truck`, `Fuel`, `Volume2`, `VolumeX`, `Pause`, `Megaphone`, `Target`, `AlertTriangle`, `Monitor`, `Smartphone`, `Map`, `Wrench`, `BookOpen`, `Lock`, `Star`, `Milestone`, `Play`, `Zap`, `CircleDot`, `Activity`, `Palette`, `Settings`, `GraduationCap`, `Smile`, `UserCheck`, `ShieldCheck`, `User`, `FastForward`, `Flag`, `RotateCcw`, `Home`, `AlertOctagon`, `Clock`, `Utensils`, `ChevronDown`, `ChevronUp`, `ArrowLeft`, `ArrowRight`).
  - **Standalone HTML5 Canvas (`index.html`)**: Menggunakan inline SVG vector Lucide 1:1 serta Lucide CDN script (`unpkg.com/lucide@latest`) untuk rendering vector tanpa FOUC, tajam, ringan, dan zero emojis.

---

## 6. Aturan Pemeliharaan & Mitigasi Risiko

1. **Invarian Baseline Fisika**: Nilai level 1 (`enginePower = 2200`, `kSpring = 180`, `kDamper = 18.8`) tidak boleh diubah sembarangan karena menjadi baseline kelulusan 80 suite unit test.
2. **Kesesuaian Teks Lore pada Pengujian**:
   - `test/verify_index_html.test.mjs` dan `test/verify_story_and_ui.test.mjs` memvalidasi keberadaan string: `'MBG (My Mobil Gweh)'`, `'Mang Ucup'`, `'Mas Tion'`, `'SD, SMP, dan SMA Puspa Bangsa Cirebon'`, `'500 porsi'`, `'09:45 WIB'`, `'MOBIL GWEH TERGULING'`.
3. **Penyimpanan Aset & Junction Windows**:
   - Di Windows, direktori `public/assets` dibuat sebagai junction (`mklink /J public\assets assets`) agar Next.js dapat menyajikan aset secara statis dari URL `/assets/...` tanpa menduplikasi storage disk.
4. **Keamanan & Kredensial**:
   - Jangan pernah melakukan commit file kredensial, token API, `.env`, atau data billing.
