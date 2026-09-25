# Panduan Aset

## Art direction

Gaya side-scroller 2D orisinal dengan siluet terbaca, outline navy dan shading cel ringan. Warna utama: navy #0D2B52, cobalt #1769C2, sky blue #58B7F2; krem #FFF3DA, emas #F5BD3F dan koral #E66B5D aksen. Sekolah SD/SMP/SMA Puspa Bangsa, lambang, armada, dan dunia bersifat fiktif. Hindari institusi/merek nyata, teks panjang generatif, watermark, atau tiruan IP. Teks presisi dibuat HTML/SVG.

## Manifest aktif

assets/manifest.json versi 11 adalah sumber path, dimensi sumber, dan pivot. 16 slot aktif:

| Kategori | Path | Pemakaian |
| --- | --- | --- |
| Bodi/roda | assets/refresh/v11/sprites/truck_body.png, truck_wheel.png | Canvas kendaraan dan hub suspensi |
| Jeriken/koin/log | assets/refresh/v11/sprites/fuel_can.png, coin_gizi.png, obstacle_log.png | Item dan hazard |
| Paket makanan | assets/refresh/v11/sprites/food_parcel.png | Ikon HUD dan layar kemenangan |
| Gerbang/logo | assets/refresh/v11/sprites/finish_gate.png, logo.png | Garis finis sekolah dan logo modal awal |
| Latar jauh/tengah | assets/refresh/v11/backgrounds/biome1..4*.webp | Parallax empat bioma (8 background PNG sumber) |

Jumlahnya 8 PNG + 8 WebP (seluruh 16 slot aktif kini menggunakan aset visual hasil unggahan PNG, dengan SVG dipertahankan sebagai fallback). Seluruh sprite PNG telah dipotong presisi (<200 KB per berkas), dengan ground baseline gerbang sekolah menyentuh aspal tanah secara akurat dan logo badge tampil proporsional.


## Sumber dan transparansi

Sumber PNG unggahan disimpan di assets/refresh/sprites/ dan assets/refresh/backgrounds/. process_uploaded_sprites.py dan prepare_uploaded_biomes.py membuat turunan versi baru dan menolak overwrite keluaran. Empat sprite bermatte dipotong berdasarkan area matte yang tersambung ke tepi; operasi ini spesifik terhadap sumber, berisiko memakan detail putih/krem atau meninggalkan halo. Dua sprite transparan dipertahankan. Jangan pakai teknik yang sama untuk gambar lain tanpa mask dan inspeksi.

Latar diturunkan hingga lebar maksimum 1600 px; crop/fade layer tengah ditambahkan skrip, bukan alpha asli. WebP lossy. Bandingkan sumber/hasil di latar terang dan gelap, periksa tepi, tile seam, crop, dan skala runtime.

## Pivot dan perubahan versi

Pivot pada manifest adalah koordinat sumber, bukan ukuran draw. Bodi digambar sekitar 100×50 unit game; roda mengikuti hub suspensi; gate berpijak pada terrain. Crop/rescale mengubah alignment. Jangan mengubah hitbox atau terrain agar cocok dengan ilustrasi.

Untuk aset baru: pertahankan versi aktif dan sumber, ekspor ke direktori versi baru, validasi format/dimensi/alpha/bytes/pivot/clipping, inspeksi visual desktop/mobile, kemudian update manifest. Jalankan tes aset dan smoke HTTP. Bila gagal, kembalikan manifest, jangan hapus versi lama. Karena assets/refresh memakai immutable cache, jangan menimpa URL terbit.

## Higgsfield

Prompt rinci dan per kategori tersedia di HIGGSFIELD_PROMPTS.md. Pengguna melaporkan telah membeli kredit; saldo, hak akses model, biaya, dan hak distribusi belum diverifikasi pada audit dokumen ini. Jangan commit credential atau data billing. Tinjau ketentuan generator dan hasil sebelum publikasi.

## Mitigasi risiko

| Risiko | Mitigasi |
| --- | --- |
| Halo atau matte memakan detail | Simpan sumber; uji alpha dan komposit kontras |
| Pivot salah atau clipping | Cocokkan manifest dan posisi runtime |
| Latar berulang patah | Periksa beberapa siklus dan transisi |
| Gambar gagal | Fallback sekali lalu prosedural; tes kegagalan manifest/decode |
| Cache lama | Tambah path versi, jangan overwrite |
| Lisensi/credit | Periksa billing dan terms saat generasi serta sebelum distribusi |
