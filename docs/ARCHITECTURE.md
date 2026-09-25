# Arsitektur Teknis

Jika dokumen ini berbeda dari implementasi, kode menjadi acuan dan dokumen harus diperbaiki.

## Komponen

- index.html: DOM/CSS, Canvas renderer, HUD/modal, controller, input, Web Audio. Tailwind dan Google Fonts berasal dari CDN.
- game_core.js: ES module berisi BIOMES, PHYSICS_CONSTANTS, TerrainSystem, PhysicsVehicle, GameStateManager; browser dan Node test menggunakan implementasi bersama.
- assets/manifest.json: 16 slot aset. Renderer menunggu decode gambar, mencoba primary sekali dan fallback sekali bila didefinisikan, lalu memakai gambar prosedural/ikon.
- vercel.json: clean URLs serta header cache untuk aset statis.
- Tanpa bundler, backend, atau penyimpanan cloud. CSS/font CDN tetap punya dependensi jaringan.

## Fisika arcade aktif

Unit adalah piksel dan nilai tuning, bukan SI. PHYSICS_CONSTANTS di game_core.js adalah sumber angka.

| Parameter | Nilai |
| --- | --- |
| Simulasi | Fixed 120 Hz; delta dibatasi 100 ms dan catch-up maksimal 12 langkah |
| Skala HUD | 20 px/m |
| Batas laju maju/mundur | 550 / 220 px/s; HUD menampilkan 99 km/jam untuk batas maju |
| Gravitasi | 980 px/s² |
| Gaya mesin | 2200, roda belakang |
| Torsi pitch tanah gas/rem | 260 / 120 |
| Kontrol pitch udara | 4 rad/s²; maksimum angular speed 3 rad/s; damping 3.5/s |
| Faktor genangan/lumpur | 0.85 / 0.82, longitudinal saja |
| Drag lumpur | Konstanta 2.5/s, dikalikan 0.5 saat diterapkan ke gaya roda |
| Rollover | Pose >105° dan kontak atap selama 0.45 s |
| Impuls balok | -140 px/s vertikal |

Suspensi roda independen menggunakan pegas-redam. Gaya kontak/pendaratan memakai normal dan tangent terrain; respons landing menyerap sebagian komponen normal sambil menjaga komponen tangent. Tidak ada slip ban lateral, deformasi ban, atau rigid-body solver umum. Gas/rem dapat menghasilkan wheelie/stoppie pada skenario teruji; airtime ditentukan laju, terrain kicker, pitch, dan suspensi, tidak dijamin oleh input semata.

## Dunia dan aset

Terrain berlanjut sampai 4600 m; finis 4500 m. Bioma nominal: Pantura 0–1200, sawah 1200–2800, gunung 2800–4200, sekolah 4200–4600 m. Blending 200 m ada di sekitar batas. Genangan, lumpur, log, speed bump, koin, jeriken statis/darurat adalah objek gameplay. Gambar panorama tidak mendefinisikan terrain collision.

Manifest v11 memetakan 6 PNG sprite, 8 WebP bioma, logo SVG, dan gate SVG. Paket makanan berada di HUD/modal; lima sprite lain dalam Canvas. Sky/terrain/partikel dan fallback tetap prosedural.

## Input, audio, dan cache

Keyboard serta pointer multi-touch mengendalikan gas/rem terpisah. Audio browser dapat menunggu interaksi pengguna. Cache HTML, modul, manifest direvalidasi; assets/refresh berversi cache immutable satu tahun. Jangan menimpa URL versi terbit. Saat mengubah game_core.js, naikkan query versi impor di index.html.

## Risiko

| Risiko | Mitigasi |
| --- | --- |
| Fallback/decode gagal | Tes path utama/fallback dan manifest; inspeksi console serta Network |
| Cache lama | Path aset baru, query modul baru, uji hard reload |
| Tuning fisika tak adil | Suite regresi plus playtest lintasan manusia |
| Offline/CDN gagal | Font fallback tersedia; pertimbangkan bundling hanya sesudah evaluasi |
| Model arcade dikira realistis | Nyatakan batas unit dan model seperti di atas |
