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
  - **79/80 Unit Test Lulus (1 Gagal Pre-existing: Level 8 height bounds)** dijalankan via `npm test` (`node --test test/*.test.mjs`).
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

## 3. Kampanye 20 Level & Permutasi 8 Bioma Dinamis

Sistem kampanye terdiri dari 20 level maraton dengan rentang jarak tempuh bertahap (**3.000m s.d. 25.000m**) dan variasi 64 kemungkinan rute transisi bioma:
- **Level 1–5**: Jarak 3.000m – 6.500m (Dimulai dari Lembah Sawah, Pesisir, dan Lereng Hutan Pinus).
- **Level 6–10**: Jarak 7.500m – 12.500m (Kombinasi Sawah, Gunung Ciremai, Arteri Pantura, dan Pemukiman).
- **Level 11–15**: Jarak 13.800m – 19.000m (Jalur Ekstrem Lereng Gunung, Bebatuan Curam, dan Lembah Terasering).
- **Level 16–20**: Jarak 20.200m – 25.000m (Maraton Puncak Pantura & Gunung Ciremai Menuju Gerbang Puspa Bangsa).

### Permutasi Rute & 64 Pasangan Transisi Bioma:
Setiap level tidak lagi mengikuti pola linear kaku (Pesisir $\to$ Sawah $\to$ Gunung $\to$ Sekolah), melainkan memiliki permutasi segmen acak terarah unik:
1. `BIOMES.PESISIR_PANTURA` (ID 1) $\to$ `biome1Distant` (*Pesisir Pantai Pantura*)
2. `BIOMES.JALUR_PANTURA` (ID 2) $\to$ `biome1Midground` (*Jalur Arteri Pantura*)
3. `BIOMES.LEMBAH_SAWAH` (ID 3) $\to$ `biome2Distant` (*Hamparan Lembah Sawah*)
4. `BIOMES.DESA_SAWAH` (ID 4) $\to$ `biome2Midground` (*Pedesaan Lumbung Padi*)
5. `BIOMES.PUNCAK_GUNUNG` (ID 5) $\to$ `biome3Distant` (*Puncak Siluet Gn. Ciremai*)
6. `BIOMES.LERENG_GUNUNG` (ID 6) $\to$ `biome3Midground` (*Lereng Hutan Pinus Terjal*)
7. `BIOMES.PEMUKIMAN` (ID 7) $\to$ `biome4Distant` (*Kawasan Pemukiman Suburb*)
8. `BIOMES.SEKOLAH` (ID 8) $\to$ `biome4Midground` (*Kompleks Sekolah Puspa Bangsa*)

> [!IMPORTANT]
> **Invarian Garis Finis**: Apapun permutasi rute bioma di tengah trayek, segmen paling akhir dari seluruh 20 level secara algoritmik dijamin selalu berujung di Kompleks Sekolah Puspa Bangsa (`BIOMES.SEKOLAH` / ID 8) dengan gerbang sekolah, bendera merah putih, dan parkiran datar yang aman.

### Sistem Pos Transit Kargo Gizi (Checkpoints):
Pada setiap level panjang (3.000m - 25.000m), ditempatkan 1 hingga 4 titik Pos Transit Checkpoint:
- Menambah bahan bakar bensin (+50%).
- Menyimpan sebagian porsi kargo gizi yang berhasil diantar sebagai safety net reward koin.
- Menjadi titik respawn opsional jika mobil terguling di kilometer tinggi.

### Python Simulation & Balancing Suite:
- Terletak di [`scripts/balancer.py`](file:///c:/Projects/game/scripts/balancer.py), memvalidasi secara headless bahwa sudut kemiringan (15° s.d. 23.2° grade rata-rata, puncak tanjakan hingga 45°-65°) dapat ditaklukkan secara fisik oleh daya mesin dan cengkeraman ban.
- Ekspor konfigurasi matematis ke [`public/campaign_balance.json`](file:///c:/Projects/game/public/campaign_balance.json).

### Fondasi Godot Engine 4 (Fase 2):
- Proyek Godot 4 tersedia di folder [`godot/`](file:///c:/Projects/game/godot/) dengan scene controller 2D physics [`godot/scripts/TruckVehicle.gd`](file:///c:/Projects/game/godot/scripts/TruckVehicle.gd) dan konfigurasi Web Export GL Compatibility untuk Vercel.

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

---

## 7. Perbaikan Celah Bawah Background (Bottom Gap) & Pencegahan Siluet Ganda

### A. Akar Masalah Celah Bawah (Bottom Gap / "Warna Biru Bolong")
1. **Hard Capping Vertikal**: Lapisan `drawMidgroundParallaxLayer` sebelumnya dirender dengan `topRatio = 0.12` dan `heightRatio = 0.68`, yang menyebabkan gambar ilustrasi terpotong di $y = 0.80 \times h$ (hanya mencapai 80% tinggi kanvas).
2. **Dinamika Kamera & Lembah/Jurang**: Saat kendaraan menuruni lereng atau melewati lembah tanah ($y > 0.80 \times h$), terdapat celah kosong selebar 10–20% layar antara bagian bawah ilustrasi kebun teh/bukit hijau dengan permukaan tanah cokelat.
3. **Penyebab Warna Biru**: Di balik lapisan tengah terdapat gradien skybox kanvas dan baris terbawah `biome3Distant` (kabut gunung) yang memiliki rona biru muda (`[91, 147, 197]`). Hal ini menciptakan ilusi visual seolah bukit "melayang" dan ada lubang/celah air biru di bawah bukit.
4. **Solusi & Mitigasi**:
   - `drawTiledBackground` secara dinamis menghitung `effectiveHeightRatio = Math.max(heightRatio, 1.05 - topRatio)`, sehingga tinggi render otomatis ditarik melampaui dasar kanvas ($105\%$ tinggi layar) tanpa mengubah proporsi horizontal landmark.
   - Ditambahkan lapisan pengaman cadangan (*safety skirt floor*) `skirtColors` yang mengisi celah di bawah gambar dengan warna dasar tanah bioma terkait (misal hijau tua pinus `#35686d` untuk pegunungan, hijau padi `#548a63` untuk sawah), mencegah kebocoran warna biru langit dalam kondisi kamera seekstrem apa pun.

### B. Akar Masalah Siluet Gunung Menumpuk (Duplicate Mountain Silhouette)
1. **Mismatch Arsitektur 8 Bioma vs Fallback Prosedural**:
   - Setiap Bioma (1 s.d. 8) merupakan panorama mandiri dengan aset ilustrasi resmi masing-masing (`biome1Distant` s.d. `biome4Midground`).
   - Bioma ganjil (1: Pesisir Pantura, 3: Lembah Sawah, 5: Puncak Gn. Ciremai, 7: Pemukiman) adalah panorama alam terbuka tanpa layer tengah terpisah.
2. **Pemicu Siluet Ganda**:
   - Pada Bioma 5 ("Puncak Siluet Gn. Ciremai"), `drawDistantParallaxLayer(5)` berhasil merender ilustrasi megah Gunung Ciremai dari `biome3Distant.webp`.
   - Namun, fungsi `drawMidgroundParallaxLayer(5)` dipanggil setelahnya dan karena `midMap[5]` tidak memiliki aset midground, eksekusi jatuh (*fall-through*) ke kode kanvas lama:
     ```javascript
     ctx.fillStyle = 'rgba(21, 128, 61, 0.5)';
     ctx.lineTo(x, ty); // Gelombang sinus hijau siluet gunung
     ```
   - Akibatnya, siluet bukit kartun hijau semi-transparan digambar menimpa ilustrasi fotorealistik Gunung Ciremai yang sudah ada di latar belakang.
3. **Solusi & Mitigasi**:
   - Menambahkan pengecekan eksplisit pada `drawMidgroundParallaxLayer`: jika bioma berstatus panorama ganjil (`biomeId % 2 === 1`), fungsi langsung keluar (*early return*) tanpa merender elemen prosedural apa pun.
   - Jika aset background utama bioma sudah termuat dengan sukses (`asset.loaded === true`), dilarang keras merender bentuk geometris/kartun prosedural di atasnya. Prosedural murni hanya aktif jika terjadi kegagalan muat aset jaringan (*true offline fallback*).

---

## 8. Sistem Ompreng Refill Kargo & Rintangan Multi-Hazard Dinamis

### A. Paket Gizi (Food Parcels) � Ompreng Refill +20% Integritas Kargo
1. **Mekanik Inti**: Item hijau bercahaya (sprite `foodParcel` dari `food_parcel.png`) tersebar di sepanjang trek setiap ~320-400m. Saat truk melewatinya:
   - Integritas kargo dipulihkan sebesar **+20 percentage points** (maks 100%).
   - Muncul floating banner hijau `"+20% PAKET GIZI REFILL!"` selama 1.5 detik.
   - Sound effect `playCoinPickupSound()` diputar.
2. **Distribusi Algoritmik**: `initCustomLevelHazardsAndItems()` menggunakan rumus `m += 340 + ((m * 19) % 90)` untuk spacing pseudo-random tanpa duplikasi. Legacy mode (`initHazardsAndItems`) menggunakan 10 posisi statis (350m, 750m, 1200m, ..., 4250m).
3. **Rendering**: Sprite dengan green glowing aura (`rgba(34, 197, 94, 0.30)`) dan animasi bobbing vertikal `sin(now * 1.2 + parcel.x * 0.7) * 5`. Fallback prosedural: kotak hijau `#16a34a` dengan simbol salib putih dan teks "GIZI".
4. **Tujuan Desain**: Mengatasi game-over prematur karena kargo habis (0%) akibat goncangan rintangan berulang. Pemain terampil yang mengumpulkan paket gizi dapat menyelesaikan semua 20 level.

### B. Rintangan Multi-Hazard Dinamis (Air, Lumpur, Kayu)
1. **Genangan Air (Puddles)**: Tersebar dinamis di seluruh level (spacing: `340 + ((p * 13) % 110)`) mulai dari meter 160. Efek: traksi turun ke 0.85 (selip).
2. **Lumpur (Mud Pits)**: Tersebar dinamis di seluruh level (spacing: `390 + ((m * 17) % 130)`) mulai dari meter 260. Efek: drag sasis dan grip berkurang.
3. **Kluster Kayu (Log Clusters)**: Berjajar 1 hingga 8 batang kayu per kluster dengan skala level:
   - Level 1-4: 1-3 kayu per kluster.
   - Level 5-10: 2-5 kayu per kluster.
   - Level 11-20: 3-8 kayu per kluster (washboard corduroy road).
4. **Distribusi Universal**: Semua tipe rintangan muncul di **semua bioma** secara dinamis, bukan terbatas pada bioma tertentu.

### C. Kerusakan Kayu Berdasarkan Kecepatan (Speed-Scaled Log Damage)
- **Merayap pelan** (kecepatan < 60 px/s): suspensi menyerap goncangan sepenuhnya, **0 kerusakan kargo**.
- **Ngebut** (kecepatan > 60 px/s): intensitas goncangan `logShockIntensity = min(200, 80 + speed * 0.22)` memicu `applyImpactShock()` yang merusak kargo.
- **Filosofi Gameplay**: Pemain bisa memilih antara gas pol untuk kecepatan tapi risiko kargo rusak parah, atau pelan-pelan melewati log cluster agar kargo aman.

### D. Sinkronisasi Dual-Stack
Seluruh perubahan di atas diterapkan secara identik di:
- `game_core.js` (TerrainSystem + PhysicsVehicle logic) � diimpor oleh kedua stack.
- `components/GameRenderer.js` (rendering React/Next.js).
- `index.html` (rendering standalone HTML5 Canvas).
