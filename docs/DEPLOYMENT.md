# Menjalankan dan Men-deploy

## Karakter deployment

Situs statis tanpa bundler. Sertakan index.html, game_core.js, vercel.json bila memakai Vercel, manifest serta seluruh aset yang dirujuk. Tailwind dan Google Fonts dimuat dari CDN. Biaya, kuota, limit upload, dan trafik bergantung provider/account; jangan mengasumsikan tier atau kapasitas.

## Uji lokal

Dari root proyek di PowerShell jalankan py -m http.server 8000, buka http://127.0.0.1:8000/, lalu hentikan dengan Ctrl+C. Bila py tidak ada gunakan python -m http.server 8000. Periksa Network dan Console. file:// bukan pengganti HTTP karena fetch manifest dan ES modules bisa dibatasi browser.

Alternatif: npx serve . dapat mengunduh paket dari registry jika tidak tersedia lokal; tinjau sumber sebelum menerimanya.

## Vercel

vercel.json menetapkan cleanUrls. HTML, game_core.js dan manifest direvalidasi; URL assets/refresh/ mendapat Cache-Control public, max-age=31536000, immutable. Path immutable tidak boleh ditimpa setelah rilis.

Alur aman: siapkan/login CLI atau tautkan repo di dashboard; tinjau scope/project/root/branch; deploy preview; uji URL preview, Network, Console, aset, alur gameplay dan header cache; baru promosikan ke production. Periksa dokumentasi/dashboard provider untuk instruksi dan biaya yang berlaku karena dapat berubah. Jangan simpan token deploy di repository atau command yang tercatat publik.

## Cache dan rollback

Saat aset berubah, buat path versi baru lalu ubah manifest. Saat game_core.js berubah, naikkan query versi pada import module di index.html. Verifikasi header aktual setelah deployment; konfigurasi lokal bukan bukti perilaku CDN. Jika rilis gagal, rollback deployment atau kembalikan manifest/query ke versi terdahulu; pertahankan file sumber versi lama.

## Checklist dan risiko

| Risiko | Mitigasi |
| --- | --- |
| Target project/branch keliru | Cocokkan identitas dan preview sebelum production |
| Cache menampilkan kode/aset lama | Revalidasi HTML/manifest; URL aset baru; cek request |
| PNG sumber membesarkan payload | Ukur payload dan tinjau apakah sumber mentah perlu dipublikasikan |
| CDN/font tidak tersedia | Uji jaringan sasaran dan fallback |
| Secret terpublikasi | Scan staged files; jangan commit .env, kunci, token, kredensial |
