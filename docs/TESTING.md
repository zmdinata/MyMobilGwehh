# Strategi dan Hasil Testing

## Perintah

Dari root proyek jalankan node --test test/*.test.mjs. Subset:
- node --test test/game_core.test.mjs
- node --test test/audio_and_scoring.test.mjs
- node --test test/verify_index_html.test.mjs

Suite memakai test runner bawaan Node; tidak ada package.json.

## Cakupan

- game_core.test.mjs: terrain, bioma, tangent/normal, fisika/suspensi/collision, pickup, skor, route simulation, variasi FPS, manifest format/dimensi/alpha/pivot/bytes.
- audio_and_scoring.test.mjs: suara, skor, fuel dan partikel.
- verify_index_html.test.mjs: sintaks browser script, DOM, kontrol, hazard/render, import bersama, loader manifest/decode/fallback.
- Pemeriksaan source bukan simulasi browser penuh dan tidak membuktikan CSS/DOM semua browser.

## Hasil yang dijalankan

Pada 2026-09-25 di C:/Projects/game, node --test test/*.test.mjs menghasilkan 64 lulus, 0 gagal. Cakupan termasuk wheelie dengan roda depan terangkat, brake pitch/rear lift dalam urutan input, ramp airtime, traksi genangan, pendaratan yang mempertahankan laju tangent, route policy pada 30/60/120 FPS, dan validasi aset.

Route regression menggunakan policy koreksi pitch terprogram. Hasilnya tidak membuktikan tingkat keberhasilan pemain umum. Smoke browser dan playtest manusia tidak dijalankan ulang dalam audit dokumentasi ini; pemeriksaan browser lama di IMPLEMENTATION_LOG.md bersifat historis.

## Checklist browser/manual

Jalankan py -m http.server 8000 lalu buka http://127.0.0.1:8000/.
1. Periksa menu/logo dan status Network semua path manifest.
2. Uji start, gerak keyboard/pedal, jeda, lanjut, restart.
3. Periksa hazard terlihat sebelum kontak dan sejajar dengan terrain.
4. Lewati empat bioma serta transisi/tile.
5. Uji terminal menang/kalah secara injeksi, lalu playthrough terpisah untuk hasil alami.
6. Ulangi viewport sempit/lebar dan perangkat sasaran; cek console, overflow, audio.
7. Fault-inject manifest, gambar primary, dan fallback; pastikan tidak ada retry tanpa batas.

## Batas dan mitigasi

| Risiko | Mitigasi |
| --- | --- |
| Source tests lulus, runtime gagal | HTTP smoke di browser dan inspect Network/Console |
| Policy simulasi terlalu mahir | Playtest pemain; catat completion, score, crash, abandon |
| Tes FPS bukan perangkat lambat | Uji perangkat fisik/throttling/frame-time |
| Decode failure belum diuji fault-injection | Ganggu URL pada server test lalu pulihkan |
| Gambar berbeda dari hitbox | Bandingkan pivot, collision dan screenshot |
| Hasil tidak relevan setelah source berubah | Jalankan ulang suite dan catat commit/source version |
