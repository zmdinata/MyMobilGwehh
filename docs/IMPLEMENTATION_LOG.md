# Log Implementasi dan Audit

## Snapshot aktif — 2026-09-25

Browser mengimpor game_core.js?v=20260925-gameplay11; manifest aset aktif v11.

- Terrain/fisika/state bersama dipakai browser dan tes.
- Pitch gas/rem tanah 260/120; laju cap 550/220 px/s; airtime dari kicker heightfield; water 0.85; mud 0.82 dengan konstanta drag roda 2.5/s × 0.5.
- Enam sprite PNG dan delapan layer WebP v11 aktif; logo dan gate masih SVG v3.
- Suite yang dijalankan ulang untuk audit dokumen: 64 lulus, 0 gagal. Tidak ada browser smoke/playtest manusia baru pada audit ini.

## Audit dokumentasi — 2026-09-25

Menambahkan README, menyelaraskan spesifikasi aktif ke kode, merapikan hasil testing yang sebelumnya mencampur banyak snapshot, memperbarui status Higgsfield sesuai laporan pengguna tentang pembelian kredit, serta menambahkan mitigasi cache, aset, CDN, credential dan publikasi. Semua klaim hasil diberi batas jenis bukti.

## Catatan sejarah teknis

Ringkasan keputusan lama, bukan verifikasi terbaru:
- Engine terrain, fisika, dan state dikonsolidasikan ke game_core.js.
- Fixed step, suspensi, normal/tangent terrain, response landing, rollover timer, kicker, dan hazard visibility diperbaiki lewat tes regresi.
- Renderer memakai manifest serta menunggu decode; primary dan fallback masing-masing dicoba paling banyak sekali sebelum prosedural.
- PNG sumber pengguna tetap disimpan dan proses ekspor diarahkan ke path versi baru.
- Runtime query modul dinaikkan ke gameplay11 setelah tuning stoppie.

## Pemulihan/publikasi

Workspace saat audit awal tidak memiliki .git. Remote yang dituju diperiksa dan tidak mengembalikan ref. Sebelum publikasi, scan semua staged file, ukuran, secret, key, token, dan file pribadi. Jangan force-push ke remote yang memiliki riwayat; fetch/integrasikan riwayat terlebih dahulu.
