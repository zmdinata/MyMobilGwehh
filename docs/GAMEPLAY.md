# Panduan Bermain — MBG: Road To School

## 1. Misi Utama & Cerita

Pemain berperan sebagai **Mas Tion**, supir kurir logistik gizi nomor wahid yang mengemudikan armada truk MBG (*My Mobil Gwehh*) untuk mengantarkan **500 porsi paket gizi hangat** (nasi pulen, ayam serundeng, tahu-tempe orek, sayur lodeh, dan susu murni) ke sekolah fiktif **SD, SMP, dan SMA Puspa Bangsa Cirebon**. 

Misi ini didedikasikan untuk menyambut **Bu Yulie** (guru muda yang disukai Tion) dan para murid sebelum bel masuk berbunyi tepat pukul **09:45 WIB**, di bawah bimbingan wejangan supir veteran legendaris **Mang Abdul** dan racikan bengkel sahabat karib **Zacky**.

---

## 2. Kontrol Kemudi & Dinamika Kendaraan

| Aksi | Keyboard (Desktop) | Sentuh (Layar Mobile / Tablet) |
| :--- | :--- | :--- |
| **Gas / Akselerasi** | `D`, `W`, `Panah Kanan`, `Panah Atas` | Pedal Kanan (**GAS**) |
| **Rem / Mundur** | `A`, `S`, `Panah Kiri`, `Panah Bawah` | Pedal Kiri (**REM**) |
| **Klakson Telolet** | `H` atau `Spasi` | Tombol Tengah (**TELOLET**) |
| **Jeda (Pause)** | `Esc` | Tombol `⏸️` di sudut kanan atas |
| **Mulai Ulang (Restart)** | `R` | Tombol Ulangi di Layar Kalah/Menang |

### Mekanika Fisika Lanjutan:
1. **Dinamika Daratan & Stunt Roda Tunggal**:
   - Menekan **Gas** menggerakkan roda belakang dan menghasilkan gaya angkat hidung (*wheelie* terkendali). Menjaga roda depan melayang selama $\ge 0.4$ detik akan menampilkan badge live `WHEELIE X.Xs ⚡`, dan mendaratkan kedua roda dengan aman menghadiahkan bonus **+5 hingga +25 Koin Gizi**.
   - Menekan **Rem** mengurangi laju maju, menghasilkan efek *stoppie* (roda belakang terangkat ringan saat deselerasi cepat). Menjaga roda belakang melayang $\ge 0.4$ detik memicu badge live `STOPPIE X.Xs 🛑` serta hadiah bonus koin.
   - Menekan **Gas + Rem** secara bersamaan di tanah: mesin tetap aktif mendorong maju sambil menetralkan torsi pitch, berguna untuk menanjak terjal tanpa terjungkal ke belakang.
2. **Kontrol Pitch di Udara (*Airborne Dynamics*)**:
   - Torsi kendali udara telah dioptimalkan ke **`6.5 rad/s²`** (berskala dinamis +3%/level dengan peningkatan suspensi). Saat melayang, tahan `Gas` untuk mengangkat moncong truk (*pitch up* / counter-clockwise) atau tahan `Rem` untuk menundukkan moncong (*pitch down* / clockwise).
   - **Live Airborne Badge**: Melayang di udara $\ge 0.35$ detik secara instan mengaktifkan lencana neon real-time `AIR TIME X.Xs ✈️` tepat di atas kabin truk.
   - **Hadiah Manuver Udara (*Stunt Rewards*)**:
     - **Air Time Jump**: Melayang $\ge 0.75$ detik dan mendarat aman ($\Delta\theta \le 35^\circ$) menghadiahkan bonus **+10 hingga +30 Koin Gizi**.
     - **Acrobatic Flips**: Melakukan putaran penuh di udara menghadiahkan **BACKFLIP! +25 KOIN ⭐** atau **FRONTFLIP! +25 KOIN ⭐**.
   - **Teknik Pendaratan Sempurna (*Angle-Matched Landing*)**: Jika selisih sudut bodi truk dan permukaan lereng pendaratan $\Delta\theta \le 22^\circ$, suspensi ganda menyerap hingga **90% energi benturan**, menjaga kecepatan tangent, dan mengakibatkan **0% kerusakan pada paket sayur lodeh**.
   - Pendaratan tajam ($\Delta\theta > 35^\circ$) akan memicu guncangan keras yang merusak kargo gizi.

---

## 3. Kampanye 20 Level & Karakteristik Rute

Setiap level memiliki target jarak tempuh dan kombinasi bioma yang semakin menantang:

| Level | Judul Level | Jarak Tempuh | Batas Waktu | Urutan Bioma |
| :---: | :--- | :---: | :---: | :--- |
| **1** | Tugas Pagi Pertama | 800 m | 90 s | Pesisir Pantura $\to$ Sekolah |
| **2** | Angin Pesisir & Senyum Pertama | 900 m | 95 s | Pesisir Pantura $\to$ Jalur Arteri $\to$ Sekolah |
| **3** | Cieee Mas Tion! | 1000 m | 100 s | Pesisir $\to$ Jalur Arteri $\to$ Lembah Sawah $\to$ Sekolah |
| **4** | Setelan Bengkel Zacky | 1100 m | 105 s | Jalur Arteri $\to$ Lembah Sawah $\to$ Pedesaan $\to$ Sekolah |
| **5** | Hujan Gerimis Pantura | 1200 m | 110 s | Pesisir $\to$ Lembah Sawah $\to$ Pedesaan $\to$ Sekolah |
| **6** | Kubangan Lumpur Terasering | 1350 m | 120 s | Lembah Sawah $\to$ Pedesaan $\to$ Pemukiman $\to$ Sekolah |
| **7** | Botol Air Minum Bu Yulie | 1500 m | 125 s | Pesisir $\to$ Lembah $\to$ Puncak Gn. Ciremai $\to$ Sekolah |
| **8** | Misi Mak Comblang Husna | 1650 m | 130 s | Lembah $\to$ Pedesaan $\to$ Lereng Terjal $\to$ Sekolah |
| **9** | Uji Shockbreaker Anyar | 1800 m | 135 s | Jalur Arteri $\to$ Pedesaan $\to$ Puncak $\to$ Lereng $\to$ Sekolah |
| **10** | Petuah Sang Legenda Mang Abdul | 2000 m | 140 s | Pesisir $\to$ Lembah $\to$ Puncak $\to$ Pemukiman $\to$ Sekolah |
| **11** | Tanjakan Kabut Perbukitan | 2200 m | 150 s | Pedesaan $\to$ Puncak $\to$ Lereng $\to$ Pemukiman $\to$ Sekolah |
| **12** | Melayang Demi Bu Guru | 2400 m | 155 s | Pesisir $\to$ Jalur $\to$ Puncak $\to$ Lereng $\to$ Sekolah |
| **13** | Surat Rantang Rahasia | 2600 m | 160 s | Lembah $\to$ Pedesaan $\to$ Puncak $\to$ Lereng $\to$ Sekolah |
| **14** | Pipi Merah di Ruang Guru | 2800 m | 170 s | Pesisir $\to$ Jalur $\to$ Pedesaan $\to$ Lereng $\to$ Pemukiman $\to$ Sekolah |
| **15** | Batu Curam & Mesin Stage 15 | 3000 m | 175 s | Puncak $\to$ Lereng $\to$ Pedesaan $\to$ Pemukiman $\to$ Sekolah |
| **16** | Payung Teduh di Depan Gerbang | 3300 m | 180 s | Pesisir $\to$ Lembah $\to$ Puncak $\to$ Lereng $\to$ Pemukiman $\to$ Sekolah |
| **17** | Dukungan Penuh Zacky & Husna | 3600 m | 190 s | Jalur $\to$ Pedesaan $\to$ Puncak $\to$ Lereng $\to$ Pemukiman $\to$ Sekolah |
| **18** | Tanjakan Penentu Nyali | 3900 m | 195 s | Lembah $\to$ Pedesaan $\to$ Puncak $\to$ Lereng $\to$ Pemukiman $\to$ Sekolah |
| **19** | Persiapan Pesta Gizi Akbar | 4200 m | 200 s | Rute Maraton Komplit 8 Bioma |
| **20** | Rute Pamungkas: Demi Bu Guru | 4500 m | 210 s | Rute Pamungkas Komplit 8 Bioma $\to$ Gerbang Sekolah |

---

## 4. Garasi Zacky (Upgrade & Kustomisasi)

Pemain dapat memodifikasi kendaraan di Garasi Zacky menggunakan koin gizi yang diperoleh dari lintasan maupun bonus akrobatik stunt:
- **Upgrade Komponen (Level 1 – 20)**:
  - **Formula Biaya Eksponensial Agresif**: $\text{Cost}(\text{level}) = \text{round}\left(100 \times 1.25^{\text{level} - 1}\right)$ (Level 1: 100 koin, Level 5: 244 koin, Level 10: 745 koin, Level 20: 5.551 koin; total $\approx 26.540$ koin per komponen).
  - **Mesin (*Engine*)**: Meningkatkan daya dorong tanjakan curam dari `2200` hingga `3720`.
  - **Grip Ban (*Tires*)**: Mengurangi selip dan meningkatkan cengkeraman jalan dari `1.00x` hingga `1.57x`.
  - **Suspensi (*Suspension*)**: Menguatkan pegas $K$ (180 s.d. 256) dan damper $C$ (18.8 s.d. 26.4) serta torsi putaran udara (+3%/level) agar bodi mobil tidak mudah terpelanting.
- **Kustomisasi Kosmetik (Skala Dinamis Level Unlock)**:
  - 5 Varian Skin Bodi Truk:
    - *Standard MBG Box* (Unlock Lv 1): **0 Koin (Gratis)** — Standard Box
    - *Speedy Courier* (Unlock Lv 4): **580 Koin** (+5% Top Speed)
    - *Mountain 4x4* (Unlock Lv 8): **1.430 Koin** (+5% Tire Grip)
    - *Retro Classic* (Unlock Lv 12): **3.500 Koin** (+5% Shock Damping)
    - *Sport Tuned* (Unlock Lv 16): **9.500 Koin** (+10% Top Speed)
  - 4 Varian Velg Roda:
    - *Stock Steelie* (Unlock Lv 1): **0 Koin (Gratis)**
    - *Gold Racing Alloy* (Unlock Lv 5): **730 Koin**
    - *Mud Beadlock* (Unlock Lv 10): **2.200 Koin**
    - *White-Wall Cruiser* (Unlock Lv 15): **6.800 Koin**

---

## 5. Sistem Bintang, Skor, dan Kondisi Kalah

### Perolehan Bintang:
- ⭐ **1 Bintang**: Berhasil mencapai garis finis gerbang Sekolah Puspa Bangsa.
- ⭐⭐ **2 Bintang**: Finis dengan integritas kargo $\ge 40\%$ dan sisa bahan bakar $> 0\%$.
- ⭐⭐⭐ **3 Bintang**: Finis dengan integritas kargo $\ge 70\%$, sisa bahan bakar $\ge 20\%$, dan sisa waktu $\ge 30\text{ detik}$.

### Kondisi Gagal (Game Over):
1. **Mobil Terguling (*Rollover*)**: Bodi mobil miring lebih dari $105^\circ$ dan atap menyentuh tanah selama 0.45 detik (*"Kuah sayur lodeh tumpah berantakan!"*).
2. **Kehabisan Bahan Bakar (*Empty Fuel*)**: Bensin habis total dan mobil mulai meluncur mundur.
3. **Terlambat (*Time Out*)**: Waktu countdown melewati pukul 09:45 WIB.
4. **Kargo Hancur**: Integritas kargo mencapai 0% akibat benturan berulang-ulang.

> [!TIP]
> Seluruh koin yang berhasil diambil di lintasan tetap menjadi milik pemain meskipun mobil mengalami kegagalan. Gunakan koin tersebut di Garasi Zacky untuk memperkuat mobil sebelum mencoba kembali!

---

## 6. Sistem Audio Hybrid & Akustik Otentik

Game ditenagai oleh mesin sintesis **Hybrid Web Audio API & Procedural Waveforms** berpresisi tinggi dengan zero-latency dan master dynamic compressor bebas distorsi:

1. **Akustik Mesin Unik per Skin Kendaraan**:
   - **Standard Canter Diesel**: Degupan berat solar khas Pantura (38–115 Hz), sub-harmonic piston rumble, dan lowpass filter tebal.
   - **Speedy Courier (GranMax/Carry)**: Karakter bensin 4-silinder putaran tinggi (65–215 Hz), knalpot garing dan lincah.
   - **Mountain 4x4 (Hardtop)**: Torsi berat low-end bertenaga (38–125 Hz) dengan resonansi Q tinggi untuk medan tanjakan.
   - **Retro Classic (Truk Bagong)**: Irama mesin antik berdetik (36–105 Hz) dengan harmonik *mechanical valve-tap*.
   - **Sport Tuned (Racing Canter)**: Teriakan twin-cam agresif (72–275 Hz), siulan spooling turbocharger (1400–3800 Hz), serta desis *Blow-off Valve* (`psshhh`) saat pedal gas dilepas dari kecepatan tinggi.

2. **Gesekan Ban Granular Sesuai Permukaan Material**:
   - **Aspal Kering**: Desis halus ban karet berkecepatan tinggi (*tire hiss / pavement hum* pada bandpass 1600 Hz).
   - **Tanah Berumput**: Gesekan berbutir empuk (*soil & grass roll* pada bandpass 650 Hz).
   - **Kerikil Bebatuan**: Gemeretak loncatan kerikil acak (*gravel clatter & pebble crackles* pada 1100 Hz).
   - **Lumpur Becek**: Decakan hisap kental (*mud suction squelch & viscous bubbling* pada 260 Hz).
   - **Air Rob Pantura**: Gemercik semburan air membelah rob secara kontinyu (*water churn & spray* pada 1250 Hz).
   - **Jembatan Kayu / Batang Pohon**: Resonansi getaran papan kayu berongga (*hollow wood rattle* pada 380 Hz).

3. **Klakson Telolet Basuri V3 Extended**:
   - Rangkaian melodi fanfare 12-nada epik berdurasi ~3.5 detik dengan akustik ganda *dual air-horn brass*, harmonisasi terts, dan modulasi vibrato LFO pada nada penutup.
   - Disertai semburan partikel not musik melayang dari atap kabin truk.

4. **Deru Angin Aerodinamika & Atmosfer 8 Biome**:
   - **Dynamic Aerodynamic Wind**: Deru hembusan angin (*wind whoosh*) menguat secara eksponensial seiring kecepatan melaju ($|v_x| > 180\text{ px/s}$) dan saat melayang tinggi di udara (*airborne*).
   - **Ambient Biome Generator**: Menghadirkan atmosfer prosedural khas masing-masing bioma (deburan ombak laut pesisir Pantura, jangkrik sawah asri, desau rimba Alas Roban, siulan angin dingin lereng gunung, hingga dengung metropolitan).

