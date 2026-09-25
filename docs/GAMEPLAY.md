# Panduan Bermain

## Misi

Antarkan paket gizi dengan truk biru armada fiktif ke SD, SMP, dan SMA Puspa Bangsa di Cirebon. Finish di 4500 m, terrain sampai 4600 m, batas waktu 210 detik.

## Kontrol

| Aksi | Keyboard | Sentuh |
| --- | --- | --- |
| Gas | D, W, panah kanan/atas | Pedal kanan |
| Rem | A, S, panah kiri/bawah | Pedal kiri |
| Telolet | H atau Spasi | Tombol klakson |
| Jeda | Esc | Tombol jeda |
| Restart | R | Tombol restart |

Gas menggerakkan roda belakang dan pitch-up. Rem memperlambat gerak di permukaan, lalu mundur setelah hampir berhenti, serta memberi pitch-down. Di udara gas/rem mengubah pitch. Bila dua pedal ditekan bersamaan, di tanah tenaga gas masih aktif sementara torsi pitch dibatalkan; di udara input pitch saling meniadakan. Jadi kombinasi pedal bukan pengereman.

Kendaraan tidak otomatis rata saat melompat. Koreksi pitch mengikuti sudut lereng tujuan; tahan input terlalu lama dapat menyebabkan overspin dan benturan. Wheelie, stoppie, dan airtime bergantung kondisi laju/terrain.

## Bioma

| Jarak nominal | Area | Efek |
| --- | --- | --- |
| 0–1200 m | Pantura | Genangan, traksi longitudinal 0.85 |
| 1200–2800 m | Sawah | Lumpur, traksi 0.82 dan drag |
| 2800–4200 m | Gunung | Kicker terrain dan balok kayu |
| 4200–4600 m | Sekolah | Polisi tidur dan gerbang; finish 4500 m |

Peralihan visual/fisik merentang 200 m di sekitar batas. Kicker sekitar 380, 760, 1500, 2150, 2500, 3100, 3550, 3950 m tertanam di heightfield, bukan sprite collision. Genangan hanya mengubah gaya longitudinal; slip lateral belum dimodelkan. Konstanta drag lumpur 2.5/s dikalikan 0.5 pada gaya roda.

## Bahan bakar, skor, gagal

Jeriken memberi +30 poin persentase hingga maksimum 100. Di bawah 20%, engine dapat menaruh jeriken darurat bila tak ada yang belum dikumpulkan dalam 300 m di depan.

- Finish memberi 1 bintang.
- 2 bintang: kargo ≥40% dan bensin >0%.
- 3 bintang: kargo ≥70%, bensin ≥20%, waktu tersisa ≥30 detik.
- Kalah: rollover >105° dengan kontak atap selama 0.45 s; bensin habis sambil kendaraan mundur; waktu habis; atau kargo mencapai 0%.

## Strategi dan batas klaim

Rem sebelum kayu/polisi tidur, kelola gas untuk bahan bakar, gunakan kicker untuk melompat, dan koreksi pitch sebelum mendarat. Jeriken darurat bukan jaminan menang.

Angka adalah tuning arcade. Simulasi policy terprogram membuktikan hanya skenario model tertentu; itu bukan bukti tingkat kesulitan atau keberhasilan pemain manusia.
