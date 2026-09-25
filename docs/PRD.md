# PRD — MBG: Road To School

## Tujuan dan batas

Game browser side-scrolling 2D dengan fisika arcade. Pemain mengantar paket menggunakan truk biru melalui empat bioma menuju sekolah fiktif SD, SMP, dan SMA Puspa Bangsa, Cirebon.

Aplikasi berupa index.html, game_core.js dan aset lokal. Tidak ada backend, akun, cloud save atau transaksi. Styling dan font memakai CDN. Target pengalaman: desktop keyboard serta browser sentuh; kompatibilitas pada perangkat nyata harus diuji sebelum diklaim.

## Pengalaman inti

Mencapai finish 4500 m sebelum timer 210 detik berakhir, sambil mengelola bensin, kargo, hazard, pitch, wheelie/stoppie, dan airtime. Kondisi gagal: rollover, kehabisan bensin sambil mundur, deadline, atau cargo hancur.

## Kriteria produk

1. Dapat dimainkan via HTTP tanpa build.
2. Browser memakai engine terrain/fisika/state yang sama dengan test, dari game_core.js.
3. Aset gagal tidak menyebabkan retry tak terbatas; ada fallback.
4. Terrain kode adalah collision authority, ilustrasi tidak menggeser permukaan fisik.
5. Identitas biru dominan; desain tetap terbaca di desktop dan layar sempit.
6. Keyboard serta multi-touch mendukung kontrol dan UI jeda/restart.
7. Skor/fisika/aset punya tes regresi.
8. Laporan membedakan tes otomatis, simulasi, browser smoke, dan playtest manusia.

## Spesifikasi aktif

Kontrol: D/W/panah kanan/atas gas; A/S/panah kiri/bawah rem; H/Spasi klakson; Esc jeda; R restart. Finish 4500 m; terrain 4600 m. Batas maju/mundur 550/220 px/s pada skala 20 px/m. Timer 210 s. Jeriken +30 sampai 100. Dua bintang: cargo ≥40%, fuel >0. Tiga bintang: cargo ≥70%, fuel ≥20%, sisa waktu ≥30 s.

Bioma nominal: Pantura 0–1200 m, sawah 1200–2800, gunung 2800–4200, sekolah 4200–4600. Traksi air/lumpur 0.85/0.82. Konstanta drag lumpur 2.5/s, diterapkan dengan faktor 0.5 pada roda. Model dan satuan adalah tuning arcade.

## Visual dan aset

Palet utama navy #0D2B52, cobalt #1769C2, sky blue #58B7F2. Dunia, armada, lambang dan sekolah fiktif. Hindari merek/institusi nyata serta imitasi IP. Manifest v11 memiliki 6 PNG, 8 WebP, 2 SVG. PNG logo/gate belum diunggah; keduanya masih SVG v3. Prompt dan sumber dijelaskan di ASSETS_GUIDE.md dan HIGGSFIELD_PROMPTS.md.

Pengguna sebelumnya melaporkan membeli 40 kredit Higgsfield; saldo/akses model sekarang tidak diverifikasi dan tidak ada generasi baru pada audit dokumentasi ini.

## Risiko dan mitigasi

| Risiko | Mitigasi |
| --- | --- |
| Parameter arcade dipahami sebagai realistis | Jelaskan batas unit; playtest untuk UX |
| Aset merusak pivot/hitbox | Terrain terpisah; validasi manifest dan komposit runtime |
| Aset atau CDN gagal | Fallback lokal/prosedural, uji HTTP dan jaringan |
| Cache lama | Path aset versi baru dan query modul baru |
| Kredit/izin generator | Periksa billing dan syarat penggunaan saat produksi |
| File sensitif/payload besar ikut publikasi | Audit seluruh staged tree, ukuran dan kredensial |
