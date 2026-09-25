# Strategi & Hasil Pengujian (Testing)

Dokumen ini mencatat seluruh strategi verifikasi otomatis, cakupan suite pengujian, dan bukti hasil test run pada proyek *MBG: Road To School*.

---

## 1. Perintah Pengujian

Seluruh pengujian dijalankan langsung melalui Node.js native test runner tanpa dependensi pihak ketiga:

```bash
# Menjalankan seluruh 80 unit test
npm test

# Atau perintah langsung
node --test test/*.test.mjs
```

### Pengujian per Berkas Suite:
- `node --test test/game_core.test.mjs`: Menguji terrain, bioma, vektor tangent/normal, integrasi pegas-redam ganda, weight transfer, landing shock absorption, fuel consumption, rollover grace timer, dan manifest v11.
- `node --test test/audio_and_scoring.test.mjs`: Menguji sintesis Web Audio, penghitungan skor bintang 1–3, partikel makanan, dan jeriken darurat.
- `node --test test/verify_index_html.test.mjs`: Menguji integritas berkas `index.html`, sintaks skrip browser, DOM modal, tombol kemudi, linkage suspensi mekanis, dan konstanta geometri bodi 100x50.
- `node --test test/verify_story_and_ui.test.mjs`: Menguji kelengkapan 20 level, ketiadaan bioma terputus, kehadiran karakter (Mas Tion, Bu Yulie, Zacky, Husna, Mang Ucup, Pak RT), skala upgrade komponen 1–20, dan preview canvas bengkel.
- `node --test test/stress_test_campaign.test.mjs`: Menjalankan simulasi fisika programatik end-to-end melintasi seluruh 20 level tanpa crash atau nilai NaN, memvalidasi elevasi start yang aman, dan kurva biaya koin eksponensial.

---

## 2. Bukti Hasil Pengujian Aktual

Dijalankan pada **2026-09-25** di lingkungan Windows (`c:\Projects\game`):

```text
# tests 80
# suites 0
# pass 80
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 724.5ms
```

### Rincian Verifikasi Fisika Utama:
1. **Pendaratan Miring (*Angle-Matched Landing*)**:
   - Jika $\Delta\theta \le 22^\circ$, 90% benturan diserap dan kerusakan kargo bernilai 0.
   - Jika $\Delta\theta > 35^\circ$, kargo menderita kerusakan benturan.
2. **Daya Angkat Roda (*Wheelie & Stoppie*)**:
   - Gas penuh dari posisi diam mengangkat roda depan secara bertahap.
   - Rem dari laju tinggi mengangkat roda belakang secara stabil tanpa melempar bodi.
3. **Simulasi Lintas FPS**:
   - Skrip policy terprogram berhasil menyelesaikan rute 3-bintang secara konsisten pada 30 FPS, 60 FPS, dan 120 FPS.
4. **Kelulusan 20 Level Kampanye**:
   - Seluruh 20 level berhasil disimulasikan hingga garis finis Sekolah Puspa Bangsa tanpa ada mobil terjebak di bawah tanah.

---

## 3. Verifikasi Build Produksi Next.js

```bash
npm run build
```

**Hasil Aktual**:
```text
▲ Next.js 16.3.6 (Turbopack)
✓ Compiled successfully in 951ms
  Running TypeScript ...
  Finished TypeScript in 5ms ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (6/6) in 1111ms
  Finalizing page optimization ...

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/levels
├ ƒ /api/story
└ ƒ /api/upgrades
```
**Status: 0 Error, 0 Warning. Semua 6 route ter-bundle secara optimal.**

---

## 4. Matriks Validasi Kualitas

| Kategori | Metode Validasi | Status |
| :--- | :--- | :---: |
| **Fisika Baseline** | 64 regression tests (`kSpring=180`, `kDamper=18.8`, `engine=2200`) | ✅ PASS |
| **Kampanye 20 Level** | Automated step simulation & distance monotonicity check | ✅ PASS |
| **Garasi & Upgrade** | Formula curve test ($50 \times 1.35^{L-1}$) & wallet deduction | ✅ PASS |
| **Kanon Cerita** | String match testing (Mas Tion, Bu Yulie, Mang Ucup, Puspa Bangsa) | ✅ PASS |
| **Visual & UI** | Syntax extraction, canvas preview forward context, no scanlines | ✅ PASS |
| **Build Bundler** | Next.js 16 Turbopack production compilation | ✅ PASS |
