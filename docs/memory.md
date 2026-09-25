# Catatan Maintainer

Snapshot teknis, bukan pengganti source of truth. Jika berbeda, utamakan kode/manifest/config.

## Status 2026-09-25

- Aplikasi statis: index.html, game_core.js, assets; tanpa bundler/backend.
- Runtime query: game_core.js?v=20260925-gameplay11.
- Manifest v11: enam PNG sprite, delapan WebP latar, dua SVG.
- Brand biru; tujuan sekolah fiktif SD/SMP/SMA Puspa Bangsa. Jangan kembalikan universitas, nama nyata, merek, atau lambang resmi.
- Parameter aktif ada di game_core.js dan docs/ARCHITECTURE.md.
- Test terakhir dijalankan saat audit: 64 lulus, 0 gagal.

## Aturan pemeliharaan

1. Kode aktif mengalahkan dokumentasi lama; sinkronkan seluruh dokumen terkait saat kode berubah.
2. Simpan sumber dan aset versi terdahulu. Ekspor aset baru ke direktori versi baru.
3. Validasi format, dimensi, alpha, bytes, pivot, crop, visual dan integrasi sebelum manifest diubah.
4. Saat game_core.js berubah, update query import dan jalankan suite.
5. Jangan commit token, credential, private key, .env, atau data billing.
6. Pisahkan klaim unit test, simulasi programatik, browser smoke, dan playtest manual.
7. Uji perangkat/performa target; jangan menyimpulkan dari satu viewport.
8. Dependensi Tailwind dan Google Fonts berasal dari CDN walau game statis.

## Risiko terbuka

- Slip lateral belum dimodelkan; genangan/lumpur mengubah gaya longitudinal.
- Playtest lintasan penuh dan UX mobile fisik masih diperlukan.
- Fault injection jaringan/decode perlu dilakukan bila loader berubah.
- Cache immutable memerlukan URL path versi baru.
- PNG sumber meningkatkan payload; ukur dan tinjau hak distribusi.

Lihat README.md, IMPLEMENTATION_LOG.md dan TESTING.md untuk panduan dan bukti.
