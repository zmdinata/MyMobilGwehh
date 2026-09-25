# MBG: Road To School

Game side-scrolling 2D tentang Mang Ucup yang mengantar paket gizi menuju sekolah fiktif SD, SMP, dan SMA Puspa Bangsa, Cirebon. Aplikasi statis tanpa build.

## Jalankan lokal

Dari root proyek jalankan py -m http.server 8000, lalu buka http://127.0.0.1:8000/. Hentikan dengan Ctrl+C. Gunakan HTTP; file:// dapat memblokir manifest dan ES module.

## Kontrol

| Aksi | Keyboard | Sentuh |
| --- | --- | --- |
| Gas | D, W, panah kanan/atas | Pedal kanan |
| Rem/mundur | A, S, panah kiri/bawah | Pedal kiri |
| Telolet | H atau Spasi | Tombol klakson |
| Jeda / mulai ulang | Esc / R | Tombol UI |

Di tanah, rem memperlambat dahulu. Gas+rem tetap memberi tenaga gas sambil menetralkan pitch; di udara kedua input menetralkan pitch satu sama lain.

## Dokumentasi

- [PRD](docs/PRD.md) · [Gameplay](docs/GAMEPLAY.md) · [Arsitektur](docs/ARCHITECTURE.md)
- [Aset](docs/ASSETS_GUIDE.md) · [Prompt Higgsfield](docs/HIGGSFIELD_PROMPTS.md)
- [Testing](docs/TESTING.md) · [Deployment](docs/DEPLOYMENT.md)
- [Log implementasi](docs/IMPLEMENTATION_LOG.md) · [Catatan maintainer](docs/memory.md)

## Struktur dan pemeriksaan

index.html memuat UI, Canvas, input, audio, dan controller. game_core.js menyediakan terrain, fisika, state, dan konstanta yang sama untuk browser dan test/. Manifest runtime ada di assets/manifest.json. Jalankan node --test test/*.test.mjs. Pada audit 2026-09-25 hasil aktual 64 lulus, 0 gagal; lihat docs/TESTING.md untuk batas cakupan.

Warna utama biru navy/cobalt/sky blue. Sekolah dan lambang fiktif. Periksa hak distribusi aset sebelum publikasi; file ini bukan pernyataan lisensi.
