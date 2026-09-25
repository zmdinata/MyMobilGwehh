# Log Implementasi & Riwayat Pengembangan

Dokumen ini mencatat seluruh kronologi pembaruan teknis, audit, dan evolusi fitur pada proyek **MBG: Road To School**.

---

## 1. Snapshot Terkini — 2026-09-25 (Migrasi React 19 & Next.js 16 Engine)

### Ringkasan Pembaruan Utama:
1. **Migrasi Frontend Menyeluruh ke React 19 & Next.js 16 (Turbopack)**:
   - Dibuat struktur aplikasi Next.js App Router modern dengan Tailwind CSS v4.
   - Dibuat suite komponen React modular:
     - `components/GameCanvas.jsx`: Canvas game loop 60 FPS terhubung ke engine fisika.
     - `components/GameRenderer.js`: Porting modul render lengkap (8 bioma parallax, partikel, suspensi ganda, finish gate).
     - `components/GameHud.jsx`: HUD glassmorphism modern (spedometer digital, jam 09:45 WIB, bensin, kargo).
     - `components/TouchPedals.jsx`: Kontrol sentuh ergonomis glassmorphic dengan haptic dots dan LED glow.
     - `components/WelcomeModal.jsx`, `MainMenuModal.jsx`, `LevelSelectModal.jsx`, `GarageModal.jsx`, `DialogueModal.jsx`, `VictoryModal.jsx`, `GameOverModal.jsx`, `PauseModal.jsx`.
   - Dibuat route API backend:
     - `app/api/levels/route.js`: Menyajikan konfigurasi 20 level dan transisi bioma.
     - `app/api/story/route.js`: Menyajikan seluruh naskah visual novel Intro & Outro.
     - `app/api/upgrades/route.js`: Menyajikan formula penskalaan upgrade komponen dan varian kosmetik.
2. **Koreksi Kanon Karakter (Mas Tion vs. Mang Abdul)**:
   - Menghapus kekeliruan narasi lama di mana mentor tertulis dengan nama supir lain.
   - **Mas Tion** dikukuhkan sebagai protagonis dan supir utama pengantar 500 porsi makanan gizi ke **Bu Yulie**.
   - **Mang Abdul** ditempatkan pada posisi aslinya sebagai **Supir Veteran / Mentor Legendaris** pembimbing Tion.
3. **Pembaruan Logo Resmi & Pembersihan "AI Slop"**:
   - Logo pita SVG lama digantikan dengan logo resmi PNG beresolusi tinggi: `assets/refresh/v11/sprites/logo.png`.
   - Lapisan scanline CRT dihilangkan agar tampilan grafis jernih dan bebas noise garis horizontal.
   - Tombol pedal kotak merah/biru digantikan dengan desain pedal gaming transparan modern.
4. **Penerapan 8 Bioma Dedikasi & Parallax Penuh**:
   - Seluruh 8 ilustrasi WebP dipetakan 1:1 menjadi 8 bioma terpisah dengan transisi 200m dan skybox RGBA lerping.
5. **Garasi Zacky & Kampanye 20 Level**:
   - 20 level dengan stepped distance (800m – 4500m) yang selalu berakhir di Sekolah Puspa Bangsa.
   - Upgrade Mesin, Grip, dan Suspensi (Level 1–20) dengan formula biaya eksponensial.
   - Kustomisasi 5 skin bodi truk dan 4 desain velg roda.
   - Koin tersimpan permanen di `localStorage`.
6. **Verifikasi Kualitas**:
   - **80/80 Unit Test Lulus 100% (0 Gagal)** via `npm test`.
   - **Build Produksi Next.js Lulus 100% (0 Error, 0 Warning)** via `npm run build`.

---

## 2. Riwayat Keputusan Teknis Sebelumnya

- **Fisika Arcade Stabil**:
  - Fixed timestep 120 Hz, suspensi pegas-redam independen (`kSpring = 180`, `kDamper = 18.8`, `enginePower = 2200`).
  - Respons pendaratan miring menyerap 90% benturan jika $\Delta\theta \le 22^\circ$.
  - Batas rollover $> 105^\circ$ dengan batas toleransi 0.45 detik.
- **Pipeline Aset Manifest v11**:
  - Konfigurasi manifest JSON dengan mekanisme decode asynchronous dan fallback otomatis.
  - Penyelarasan potongan log rintangan (`obstacle_log.png`) dan ketinggian gerbang finis sekolah (`finish_gate.png`).
