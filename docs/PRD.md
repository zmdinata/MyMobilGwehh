# PRD — MBG: Road To School (My Mobil Gwehh)

## 1. Tujuan & Ruang Lingkup Produk

**MBG: Road To School** adalah game browser 2D side-scrolling physics platformer bertema edukasi gizi dan petualangan cinta lokal. Pemain mengendalikan truk katering gizi **Mas Tion** yang mengarungi rute Pantura hingga pegunungan untuk mengantarkan 500 porsi paket makanan sehat hangat ke **Bu Yulie** di sekolah fiktif **SD, SMP, dan SMA Puspa Bangsa Cirebon** sebelum pukul 09:45 WIB, didampingi petuah supir veteran **Mang Ucup** dan bengkel modifikasi **Zacky**.

Aplikasi menyediakan dua moda runtime:
1. **Mode Modern Fullstack**: Next.js 16 (App Router) + React 19 + Turbopack + Tailwind v4, dengan UI modular, animasi VN, dan live preview bengkel.
2. **Mode Standalone Canvas**: File tunggal `index.html` yang dapat dimainkan tanpa build melalui HTTP server lokal.

---

## 2. Pengalaman Inti Permainan

- **Kampanye 20 Level**: Mengarungi 20 rute dengan kenaikan jarak bertahap (800m hingga 4500m) melintasi 8 bioma berurutan.
- **Dinamika Suspensi & Kargo**: Menjaga keseimbangan truk bermuatan rantang sayur lodeh dan botol susu murni agar tidak tumpah saat menanjak, melompat, atau mendarat di lereng terjal.
- **Koleksi Koin & Upgrade Garasi**: Mengumpulkan koin gizi di lintasan untuk menaikkan level Mesin, Cengkeraman Ban, dan Suspensi di Garasi Zacky (Level 1–20), serta membuka skin bodi dan velg balap.
- **Cerita Visual Novel Interaktif**: Menikmati dialog jenaka dan menghangatkan hati antara Mas Tion, Bu Yulie, Husna, Zacky, Mang Ucup, dan Pak RT di setiap awal dan akhir level.

---

## 3. Kriteria Keberhasilan Produk

1. **Dual Runtime Viability**: Dapat dijalankan via `npm run dev` / `npm run build && npm start` (Next.js) dan `python -m http.server` (HTML5 statis).
2. **Konsistensi Fisika Bersama**: Logika rigid-body, suspensi, dan terrain diatur oleh satu file inti (`game_core.js`) yang digunakan bersama oleh browser, React, dan automated unit tests.
3. **80 Suite Unit Test Lulus 100%**: Tidak ada regresi pada fisika baseline (`enginePower = 2200`, `kSpring = 180`, `kDamper = 18.8`).
4. **Bebas Visual AI-Slop**: Kontrol layar sentuh menggunakan pedal glassmorphic transparan modern, tanpa overlay CRT scanlines yang membuat tampilan pecah/bergaris.
5. **Aset Manifest Lengkap (v11)**: Seluruh 8 bioma WebP dan 8 sprite PNG (logo, gerbang sekolah, kargo ompreng, truk, roda, koin, jeriken, kayu) terhubung dengan fallback prosedural otomatis.
6. **Invarian Garis Finis**: Setiap level wajib berakhir pada kompleks sekolah fiktif SD, SMP, dan SMA Puspa Bangsa yang aman dan datar.
7. **Penyimpanan Lokal**: Saldo koin, status bintang level, level terbuka, dan level upgrade komponen tersimpan otomatis di `localStorage`.

---

## 4. Spesifikasi Karakter & Narasi

- **Mas Tion**: Protagonis dan pengemudi utama truk MBG.
- **Bu Yulie**: Guru muda teladan di Sekolah Puspa Bangsa, tokoh idaman Tion.
- **Mang Ucup**: Supir veteran pembimbing Mas Tion (memberi nasihat mengemudi dan petuah hidup).
- **Zacky**: Montir handal pemilik bengkel Garasi Zacky.
- **Husna**: Siswi SMA ceria yang sering menggoda kedekatan Tion dan Bu Yulie.
- **Pak RT**: Tokoh masyarakat pendukung program gizi anak sekolah.

---

## 5. Matriks Risiko & Mitigasi

| Risiko | Dampak | Mitigasi Otomatis |
| :--- | :--- | :--- |
| **Gagal muat gambar pada koneksi lambat** | Layar putih / blank | Loader manifest mendukung decode asynchronous, fallback path, dan gambar prosedural canvas bawaan. |
| **Deviasi fisika pada FPS bervariasi** | Skor atau rute rusak | Fixed timestep 120 Hz dengan pembatas delta time (maks 100ms) dan catch-up sub-stepping. |
| **Inkonsistensi cerita karakter** | Kebingungan pemain | Seluruh 20 naskah dialog dan teks UI dikunci melalui automated regression tests. |
| **Kompilasi Next.js gagal di produksi** | Gagal deploy | Script build Turbopack diverifikasi dengan 0 error dan 0 warning. |
