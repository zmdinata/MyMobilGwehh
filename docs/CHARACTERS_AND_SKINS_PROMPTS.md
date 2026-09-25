# Higgsfield & Generative AI Prompt Pack: 15 Core Assets + Upload Directory Guide (MMG)

Dokumen ini adalah **panduan produksi visual terlengkap** untuk menghasilkan 15 aset utama (Karakter, Skin Bodi Truk, Velg Roda, dan Background Panorama UI) menggunakan generator AI seperti **Higgsfield, Midjourney v6, Recraft.ai, DALL-E 3, atau Stable Diffusion / Flux**.

---

## 📁 PANDUAN LOKASI FOLDER UNGGANGAN (UPLOAD DIRECTORY GUIDE)

Semua folder upload khusus telah dibuat di dalam direktori proyek Anda. Anda dapat langsung mengunggah/menyeret (*drag & drop*) berkas gambar hasil generasi AI ke folder berikut:

```text
c:\Projects\game\assets\upload\
├── characters/     <-- Simpan seluruh avatar ekspresi karakter (Tion, Bu Yulie, Husna, Zacky, Mang Abdul)
├── skins/          <-- Simpan seluruh sprite bodi samping truk (Speedy, Mountain, Retro, Sport)
├── rims/           <-- Simpan seluruh sprite velg & ban roda (Standard, Gold, Beadlock, Whitewall)
└── backgrounds/    <-- Simpan seluruh panorama latar UI 16:9 (Main Menu, Garasi, Gerbang Sekolah)
```

### 📋 Tabel Pemetaan Nama Berkas Resmi (File Naming Cheat-Sheet)

| No | Kategori Aset | Nama Berkas Target (PNG Transparan) | Folder Tujuan Upload | Resolusi Target |
| :---: | :--- | :--- | :--- | :---: |
| **1** | **Tion** (Normal / Senyum) | `char_tion_normal.png` | `assets/upload/characters/` | 512 × 512 |
| | Tion (Tersipu / Malu) | `char_tion_blush.png` | `assets/upload/characters/` | 512 × 512 |
| | Tion (Fokus / Menanjak) | `char_tion_drive.png` | `assets/upload/characters/` | 512 × 512 |
| **2** | **Bu Yulie** (Senyum Menyambut) | `char_yulie_welcome.png` | `assets/upload/characters/` | 512 × 512 |
| | Bu Yulie (Khawatir / Empati) | `char_yulie_concern.png` | `assets/upload/characters/` | 512 × 512 |
| | Bu Yulie (Gembira / Sukses) | `char_yulie_happy.png` | `assets/upload/characters/` | 512 × 512 |
| **3** | **Husna** (Kedipan Jahil / Menggoda) | `char_husna_tease.png` | `assets/upload/characters/` | 512 × 512 |
| | Husna (Lapar Menanti Makanan) | `char_husna_hungry.png` | `assets/upload/characters/` | 512 × 512 |
| | Husna (Bersorak Menyemangati) | `char_husna_cheer.png` | `assets/upload/characters/` | 512 × 512 |
| **4** | **Zacky** (Percaya Diri / Kunci Pas) | `char_zacky_confident.png` | `assets/upload/characters/` | 512 × 512 |
| | Zacky (Analisis Mesin / Spek) | `char_zacky_analyze.png` | `assets/upload/characters/` | 512 × 512 |
| *Bns* | **Mang Abdul** (Mentor Tertawa Lepas) | `char_abdul_mentor.png` | `assets/upload/characters/` | 512 × 512 |
| **5** | **Skin 1**: "Speedy Courier" (Pickup) | `skin_speedy.png` | `assets/upload/skins/` | 1024 × 512 |
| **6** | **Skin 2**: "Mountain Explorer" (4x4) | `skin_mountain.png` | `assets/upload/skins/` | 1024 × 512 |
| **7** | **Skin 3**: "Retro Food Truck" (Oplet) | `skin_retro.png` | `assets/upload/skins/` | 1024 × 512 |
| **8** | **Skin 4**: "Sport Delivery Special" | `skin_sport.png` | `assets/upload/skins/` | 1024 × 512 |
| **9** | **Velg 1**: "Standard Utility Rim" | `rim_standard.png` | `assets/upload/rims/` | 512 × 512 |
| **10** | **Velg 2**: "Gold Racing Alloy" | `rim_gold.png` | `assets/upload/rims/` | 512 × 512 |
| **11** | **Velg 3**: "Mud-Terrain Beadlock" | `rim_beadlock.png` | `assets/upload/rims/` | 512 × 512 |
| **12** | **Velg 4**: "Retro White-Wall Cruiser"| `rim_whitewall.png` | `assets/upload/rims/` | 512 × 512 |
| **13** | **Background 1**: Main Menu Panorama | `bg_main_menu.png` (atau `.webp`) | `assets/upload/backgrounds/` | 1920 × 1080 |
| **14** | **Background 2**: Garasi Bengkel Zacky| `bg_garage.png` (atau `.webp`) | `assets/upload/backgrounds/` | 1920 × 1080 |
| **15** | **Background 3**: Gerbang Puspa Bangsa | `bg_school_dialogue.png` | `assets/upload/backgrounds/` | 1920 × 1080 |

> [!TIP]
> **Pencegahan Fake Transparency (PENTING)**: Pastikan generator Anda mengekspor berkas **RGBA PNG transparan asli**, BUKAN gambar dengan pola papan catur (*fake checkerboard*) yang tergambar sebagai piksel warna abu-putih! Jika menggunakan generator yang tidak mendukung alpha transparan secara native, pilih opsi latar belakang putih polos murni (`pure solid white background #FFFFFF`) agar mudah dibersihkan secara otomatis.

---

## 🎨 ART DIRECTION BIBLE & MASTER PROMPT TOKENS

Gunakan aturan gaya visual berikut agar seluruh 15 aset memiliki keselarasan estetika yang konsisten:

- **Style Definition**: 2D stylized cartoon game asset, modern Indonesian comic art style, clean vector look, bold uniform navy blue contour outline (`#0D2B52`, stroke-width 4-5px), crisp 2-step cel shading with soft directional highlight, vibrant color fills, zero 3D CGI plastic glossy reflections, zero watercolor bleeding.
- **Pencahayaan (Lighting)**: Soft tropical morning sunlight from upper-left (10:00 AM angle), warm golden highlights (`#FEF08A`), clean sharp shadows.
- **Palet Warna Kanonik (Color Palette)**:
  - *Primary Navy Outline & Chassis*: `#0D2B52`
  - *Cobalt Blue (Hero Color)*: `#1769C2` / `#2563EB`
  - *Sky Blue (Hijab & Aerodynamics)*: `#58B7F2` / `#38BDF8`
  - *Nutritious Gold (Coins, Stars, Accents)*: `#F5BD3F` / `#F59E0B`
  - *Warm Cream (Canvas Cover, Food Container)*: `#FFF3DA` / `#FEF3C7`
  - *Coral Red (Hair Ties, Fuel Cans, Badges)*: `#E66B5D` / `#F43F5E`
  - *Warm Skin Tan*: `#F4B28C` (Tion), `#FED7AA` (Bu Yulie), `#E2A374` (Mang Abdul)

---

## BAGIAN A: KARAKTER CERITA (AVATAR BUST VISUAL NOVEL)

*Spesifikasi Teknis*:
- **Format**: PNG 32-bit (Alpha Transparency).
- **Dimensi**: 512 × 512 piksel (Square 1:1).
- **Komposisi**: Character Bust Portrait (Dada ke atas), sudut pandang tiga perempat (*three-quarter angle*), menghadap sedikit ke kanan, kepala tegak proporsional, terdapat ruang aman (*padding margin*) 12% di sekeliling kepala agar tidak terpotong saat dimasukkan ke dalam avatar lingkaran/kotak berbingkai.

---

### 1. MAS TION — Supir Kurir Muda (Protagonis Utama)
*Karakter*: Pemuda Indonesia 23 tahun, berambut hitam pendek rapi dengan sedikit jambul kasual, kulit sawo matang khas pesisir, ramah, ulet, dan penuh tekad. Mengenakan kemeja kurir utilitarian biru kobalt (`#1769C2`) dengan kerah navy kontras (`#0D2B52`), kaus dalam krem, serta pin emblem daun gizi emas di saku dada kiri.

#### Prompt 1.1: Tion — Normal / Senyum Semangat (Ready for Delivery)
```text
Production-ready 2D game dialogue character bust avatar portrait of "Tion", a cheerful and energetic 23-year-old Indonesian delivery driver. Friendly expressive face, neat modern short black hair with a stylish casual front tuft, warm tropical tan skin tone (#F4B28C), warm brown eyes, confident gentle open smile. Wearing a utilitarian cobalt-blue delivery uniform shirt (#1769C2) with dark navy collar and pocket trims (#0D2B52) over an ivory cream undershirt (#FFF3DA), tiny circular gold nutrition leaf badge pinned on left chest pocket. Three-quarter view facing slightly right, chest-up bust framing centered on square canvas with 12% outer padding. Bold uniform dark navy contour lineart (#0D2B52), crisp 2-tone cel-shading, soft morning sun highlights from upper left. High quality vector comic game art style. Pure transparent PNG background, no background elements, no text, no watermark, perfectly centered.
```
*Negative Prompt*:
```text
photorealistic, 3d render, octane render, realistic photography, blurry edges, messy sketch, watercolor, double head, cropped chin, cropped hair, real brand logos, typography, watermark, cast shadow, fake checkerboard grid.
```

#### Prompt 1.2: Tion — Tersipu Malu / Salting (Menatap Bu Yulie)
```text
Production-ready 2D game dialogue character bust avatar portrait of "Tion", young Indonesian delivery driver, blushing with shy flustered romantic embarrassment. Cute vivid pink blush across both cheeks and nose bridge, shy awkward affectionate smile looking slightly downward and sideways, one hand sheepishly scratching the back of his messy black hair, slight sweat bead on temple. Same cobalt-blue delivery shirt (#1769C2) with navy collar (#0D2B52) and gold leaf pin. Wholesome romantic-comedy anime/comic aesthetic. Crisp navy lineart, flat 2-level cel shading, vibrant clean vector style. Three-quarter bust view, centered on square canvas with 12% padding. Pure transparent PNG background, zero background noise, no text, no watermark.
```
*Negative Prompt*:
```text
photorealistic, 3d model, ugly face, distorted fingers, excessive sweat, creepy smile, cropped frame, dark gritty lighting, text, watermark.
```

#### Prompt 1.3: Tion — Fokus Menyetir / Menanjak Ekstrem (Adrenalin & Tekad)
```text
Production-ready 2D game dialogue character bust avatar portrait of "Tion", delivery driver, showing fierce determination and intense focus while navigating a dangerous steep hill. Determined narrowed eyes, sharp furrowed eyebrows, grit teeth with confident gritty smirk, subtle dramatic speed lines and aerodynamic wind tuft in hair, dynamic forward head tilt. Same signature cobalt blue uniform (#1769C2) with navy collar. High-contrast cel shading with vivid edge highlights from morning sun. Bold dark navy contour lines, high clarity vector illustration. Centered chest-up composition, pure transparent background with safety margin padding. No text, no background graphics, no watermark.
```
*Negative Prompt*:
```text
photorealistic, 3d cgi, depressed, scared, screaming mouth, blurry motion, low resolution, text, watermark, background artifacts.
```

---

### 2. BU YULIE — Ibu Guru Bersahaja & Anggun (Love Interest)
*Karakter*: Guru muda 25 tahun di Sekolah Puspa Bangsa, anggun, bersahaja, berhijab rapi warna sky blue (`#58B7F2`) dipadu aksen krem lembut (`#FFF3DA`), blus seragam batik modern navy bernuansa geometris rapi dengan sentuhan emas gizi (`#F5BD3F`). Tatapan mata teduh, ramah, penuh kehangatan pendidik.

#### Prompt 2.1: Bu Yulie — Senyum Hangat Menyambut (Welcoming at School Gate)
```text
Production-ready 2D game dialogue character bust avatar portrait of "Bu Yulie", a graceful, kind, and approachable 25-year-old Indonesian female schoolteacher. Gentle crescent-shaped expressive eyes, warm affectionate welcoming smile, smooth fair-warm complexion (#FED7AA). Wearing a neatly wrapped modern hijab in serene sky blue (#58B7F2) and pale ivory tones (#FFF3DA) framing her oval face elegantly. Modest professional blouse featuring dark navy (#0D2B52) and gold (#F5BD3F) Indonesian batik floral geometric motifs. Three-quarter bust view facing slightly left, centered on square canvas with 12% safety padding. Bold clean navy blue contour lineart (#0D2B52), clean 2-step cel shading, soft warm ambient morning glow. Wholesome, respectful, elegant Indonesian educator aesthetic. Pure transparent PNG background, no text, no watermark.
```
*Negative Prompt*:
```text
photorealistic, 3d render, seductive, revealing clothes, loose messy hijab, harsh shadows, dirty colors, text, watermark, cropped hijab crown, fake background grid.
```

#### Prompt 2.2: Bu Yulie — Khawatir & Perhatian ("Hati-hati di jalan ya, Mas Tion...")
```text
Production-ready 2D game dialogue character bust avatar portrait of "Bu Yulie", schoolteacher, expressing gentle tender concern and heartfelt empathy. Softly knit eyebrows, compassionate caring gaze looking toward the player, one delicate hand resting gently near her collarbone in concern, subtle empathetic parting of lips. Same sky blue hijab (#58B7F2) and elegant navy-gold batik blouse. Expressive comic cel-shaded vector art style, bold navy contour lineart, smooth pastel palette. Centered chest-up framing with safe margins. Pure transparent PNG background, zero artifacts, no text, no watermark.
```
*Negative Prompt*:
```text
photorealistic, weeping, horrified, angry, distorted hands, extra fingers, dark horror lighting, text, watermark, background textures.
```

#### Prompt 2.3: Bu Yulie — Gembira & Terkesan (Menerima 500 Porsi Makanan)
```text
Production-ready 2D game dialogue character bust avatar portrait of "Bu Yulie", teacher, radiating pure joy, relief, and deep appreciation. Sparkling enthusiastic eyes, broad genuine radiant smile with rosy cheerful cheeks, hands clasped together near her chest in thankful gratitude. Same signature sky blue hijab (#58B7F2) with bright clean highlights and navy batik blouse. Vibrant uplifting comic vector art style, bold navy outlines, rich cel highlights. Three-quarter bust view, centered on square canvas with 12% padding. Pure transparent PNG background, no text, no watermark.
```
*Negative Prompt*:
```text
photorealistic, 3d render, exaggerated anime wide mouth, extra limbs, blurry lineart, text, watermark, opaque background.
```

---

### 3. HUSNA — Siswi SMA Puspa Bangsa (Ceria & Mak Comblang)
*Karakter*: Siswi SMA kelas 11 berumur 16 tahun, lincah, ekspresif, suka bercanda dan gemar menggoda Mas Tion soal Bu Yulie. Rambut hitam ikal sebahu diikat kuncir samping (*side ponytail*) dengan ikat rambut koral-merah cerah (`#E66B5D`). Memakai seragam putih abu-abu SMA nasional dengan dasi navy rapi dan pin lencana sekolah.

#### Prompt 3.1: Husna — Kedipan Jahil / Menggoda ("Cieee, Mas Tion...")
```text
Production-ready 2D game dialogue character bust avatar portrait of "Husna", a vivacious, cheerful, and cheeky 16-year-old Indonesian high school student. Playful wide grin, one mischievous winking eye with sparkling eyelashes, short wavy black hair tied into a bouncy side ponytail on the right with a vibrant coral-red scrunchie (#E66B5D). Wearing an Indonesian high school uniform: crisp short-sleeve white shirt, dark navy necktie (#0D2B52), and tiny circular Puspa Bangsa blue school pin on breast pocket. Energetic three-quarter pose pointing index finger playfully sideways. Bold uniform navy contour lineart, flat cel shading with pop-comic highlights. Centered chest-up bust framing with 12% margin padding. Pure transparent PNG background, no text, no watermark.
```
*Negative Prompt*:
```text
photorealistic, 3d model, mature adult look, revealing uniform, messy sketch, dark gritty style, watermark, logo, text, fake transparent checkerboard.
```

#### Prompt 3.2: Husna — Lapar Menanti Makanan ("Mas Tion, makan siangnya udah dateng?")
```text
Production-ready 2D game dialogue character bust avatar portrait of "Husna", high school girl, looking eagerly hungry and excited. Big sparkling rounded anime-comic eyes staring excitedly, mouth open in happy mouth-watering anticipation, hands holding an empty stainless steel lunchbox lid near her chin. Same side ponytail with coral scrunchie (#E66B5D) and neat Indonesian high school uniform. Cute comedic anime exaggeration, bold navy blue outlines (#0D2B52), bright colorful cel shading. Centered square framing with 12% margin padding. Pure transparent PNG background, zero background noise, no text, no watermark.
```
*Negative Prompt*:
```text
photorealistic, drooling excessively, grotesque face, distorted hands, dark shadows, text, watermark, cropped hair.
```

#### Prompt 3.3: Husna — Bersorak Menyemangati ("Ayo Mas Tion, tembak Bu Yulie!")
```text
Production-ready 2D game dialogue character bust avatar portrait of "Husna", schoolgirl, shouting enthusiastic encouragement with full spirit. Radiant shouting open-mouth smile, sparkling eyes, both small fists pumped triumphantly in the air near shoulders in a cheering victory gesture. Same wavy black side ponytail with coral tie (#E66B5D) and white-navy school uniform. High-energy comic art style, dynamic cel highlights, clean navy borders. Centered chest-up framing, pure transparent PNG background, no text, no watermark.
```
*Negative Prompt*:
```text
photorealistic, aggressive anger, deformed hands, extra fingers, blurry, text, watermark, opaque background.
```

---

### 4. ZACKY — Montir Jenius & Sahabat Tion (Kepala Bengkel Modifikasi)
*Karakter*: Montir muda 24 tahun, cerdas, solutif, percaya diri, sahabat karib Tion yang selalu mengupgrade armada truk. Mengenakan topi bisbol navy terbalik, rompi kerja berbahan denim navy tebal (`#0D2B52`) dengan aksen biru kobalt (`#1769C2`), kaus abu-abu, kunci pas perak terselip di saku rompi, serta sedikit coretan noda oli di pipi kiri sebagai ciri khas mekanik handal.

#### Prompt 4.1: Zacky — Pose Percaya Diri dengan Kunci Pas (Garasi Siap Balap)
```text
Production-ready 2D game dialogue character bust avatar portrait of "Zacky", a clever, charismatic, and reliable 24-year-old Indonesian master auto-mechanic. Confident charismatic grin, slightly disheveled dark brown hair poking out from under a backwards dark navy baseball cap (#0D2B52), charming small grease smudge on left cheekbone. Wearing a durable mechanic work vest in heavy navy denim (#0D2B52) with cobalt blue paneling (#1769C2) over a heather-gray t-shirt, shiny chrome adjustable wrench tucked securely in chest pocket. One hand giving a solid confident thumbs-up. Three-quarter view, bold clean navy contour lineart, sharp angular cel shading with metallic highlights. Centered chest-up bust framing with 12% padding. Pure transparent PNG background, no text, no watermark.
```
*Negative Prompt*:
```text
photorealistic, 3d render, dirty filthy face, deformed thumb, extra fingers, tired expression, real car brand logos, text, watermark, background artifacts.
```

#### Prompt 4.2: Zacky — Menganalisis Mesin & Suspensi (Berpikir Taktis)
```text
Production-ready 2D game dialogue character bust avatar portrait of "Zacky", mechanic, thoughtfully analyzing vehicle performance specs. Sharp calculating eyes looking upward in thought, thoughtful confident smirk, one hand touching his chin in analysis while holding a tuning clipboard with blueprint sketches. Same backwards navy cap, grease smudge, and utility mechanic vest with silver wrench. Clean vector-comic lineart, bold navy borders (#0D2B52), crisp 2-step cel shading. Centered square framing with safe margins. Pure transparent PNG background, no text, no watermark.
```
*Negative Prompt*:
```text
photorealistic, confused idiot expression, cluttered messy background, illegible blueprint text, watermark, text, opaque background.
```

---

### *BONUS MENTOR*: MANG ABDUL — Supir Veteran Pantura (Mentor Legendaris Tion)
*Karakter*: Supir senior 52 tahun, bertubuh gempal kokoh, berkumis tebal ramah, mengenakan topi pet laken supir cokelat tua, rompi safari khaki (`#854D0E`), dan syal handuk kecil di leher. Pembimbing bijak yang gemar melempar lelucon renyah khas jalur Pantura.

#### Prompt Bonus: Mang Abdul — Tertawa Renyah & Menepuk Pundak (Senior Pantura)
```text
Production-ready 2D game dialogue character bust avatar portrait of "Mang Abdul", a jovial, wise, and hearty 52-year-old veteran Indonesian truck driver. Hearty booming laugh with crinkling joyful eyes, thick neat graying mustache, warm tanned weathered skin tone (#E2A374). Wearing a classic dark brown driver flat-cap (#78350F), khaki-brown utility safari shirt (#854D0E) with yellow inner collar, small white driver sweat towel draped neatly around his neck. Warm fatherly demeanor, three-quarter bust view, bold clean navy contour outlines (#0D2B52), rich 2-step cel shading. Centered square framing with 12% padding. Pure transparent PNG background, wholesome Indonesian driver culture aesthetic. No text, no watermark.
```
*Negative Prompt*:
```text
photorealistic, 3d CGI, toothless, creepy, smoking cigarette, messy lines, text, watermark, opaque background.
```

---

## BAGIAN B: VARIAN SKIN BODI TRUK MMG (GARASI KUSTOMISASI)

*Aturan Geometri Engine Wajib (Physics Compliance)*:
1. **Sudut Pandang**: 100% Flat Orthographic Side-View murni (Tampak samping datar dari samping kanan, 0 derajat kemiringan/yaw/pitch/roll).
2. **Arah Hadap**: Moncong truk **MENGHADAP KE KANAN**.
3. **Proporsi Kanvas**: Rasio 2:1 (Lebar 1024 px, Tinggi 512 px) yang proporsional dengan skala in-game 100 × 50 unit.
4. **Wheel Arches (Lengkungan Roda)**: **DILARANG MENGGAMBAR RODA/BAN**. Harus berupa **dua lubang lengkungan lingkaran kosong transparan** persis pada posisi **22% (roda belakang)** dan **78% (roda depan)** dari total panjang bodi kendaraan, terletak pada garis poros horizontal yang sama. Roda akan digambar terpisah oleh engine fisika suspensi.
5. **Garis Tanah**: Datar sempurna, tanpa bayangan tanah (*no cast shadow*).

---

### 5. Skin Bodi 1 — "Speedy Courier" (Pickup Aerodinamis Ringan)
*Konsep*: Terinspirasi dari armada pickup GranMax/Carry modifikasi kurir kilat. Bodi ceper ramping dengan kabin aerodinamis, bak terbuka dengan boks kargo makanan higienis yang diikat tali tambang oranye kencang, terpal penutup krem rapi, serta aksen striping angin biru langit.

```text
Production-ready 2D side-view game sprite of an aerodynamic lightweight delivery pickup truck body, strictly facing right. Pure flat orthographic 2D profile view (0 degree tilt, perfectly horizontal baseline). Streamlined low cab painted in vibrant glossy cobalt blue (#1769C2) with swift sky blue aerodynamic wind decals (#58B7F2), sleek tinted side window. Rear open pickup bed neatly securing a stack of stainless steel food warmer boxes wrapped under a taut ivory cream canvas cover (#FFF3DA) with bright orange safety tie-down straps. EXACT GEOMETRY REQUIREMENT: Exactly two semicircular empty wheel arch cutouts positioned along the lower baseline at precisely 22% and 78% of the vehicle length; the wheel wells must be 100% completely empty and transparent PNG cutouts for independent wheel physics attachment. DO NOT DRAW ANY WHEELS, TIRES, OR BRAKES. Bold uniform navy blue contour outline (#0D2B52, stroke 4px), clean 2-level cel shading with subtle morning sun reflection on roof. 1024x512 resolution (2:1 aspect ratio), pure transparent PNG background, no cast shadow, no real logos, no text, no license plate.
```
*Negative Prompt*:
```text
wheels, tires, rims, brake disc, 3d perspective, angled view, front bumper perspective, cast shadow on asphalt, photorealistic, blurry lineart, text, watermark, fake checkerboard pattern.
```

---

### 6. Skin Bodi 2 — "Mountain Explorer" (Heavy Duty Offroad Box 4x4)
*Konsep*: Truk boks ekspedisi tangguh medan pegunungan terinspirasi Toyota Hardtop / Land Cruiser FJ40. Bumper depan dilengkapi bullbar besi baja hitam anti-benturan, bodi boks kokoh dengan pelat bordes (*diamond plate*) di rok bawah bodi, serta rak atap besi (*roof rack*) pembawa 2 jeriken bensin merah cadangan.

```text
Production-ready 2D side-view game sprite of a heavy-duty 4x4 offroad expedition food delivery box truck body, strictly facing right. Pure flat 2D orthographic side profile (zero 3D angle, horizontal ground line). Rugged dark steel front bullbar bumper, elevated boxy cab in deep cobalt blue (#1769C2) with reinforced rivet details, rugged textured steel diamond-plate rocker panels along lower skirts. Durable insulated cargo box with a small lockable rear access door and gold nutrition leaf emblem (#F5BD3F). Heavy-duty black tubular roof rack holding two securely strapped red metal auxiliary fuel canisters (#E66B5D). EXACT GEOMETRY REQUIREMENT: Exactly two semicircular empty wheel arch openings located horizontally at precisely 22% and 78% of total vehicle length; wheel wells must remain entirely empty and transparent with high fender clearance. DO NOT DRAW WHEELS OR TIRES. Bold uniform navy blue contour lineart (#0D2B52), crisp cel shading with metallic highlights. 1024x512 canvas, pure transparent PNG background, no ground shadow, no text, no brand logos.
```
*Negative Prompt*:
```text
wheels, rubber tires, wheel hubs, three-quarter view, isometric perspective, front angle, ground shadow, mud splatters on camera, photorealism, text, watermark, opaque background.
```

---

### 7. Skin Bodi 3 — "Retro Food Truck" (Classic Oplet Heritage / Truk Bagong)
*Konsep*: Kendaraan klasik nostalgia Indonesia 1970-an ala Truk Bagong / Oplet legendaris. Moncong kap mesin bulat klasik, cat dwi-warna (*two-tone*) krem klasik (`#FFF3DA`) di bagian atas dan biru kobalt (`#1769C2`) di bawah, lis kayu jati manis di dinding boks kargo, spion bulat krom antik, dan jendela geser klasik.

```text
Production-ready 2D side-view game sprite of a charming vintage Indonesian classic utility delivery truck (Truk Bagong heritage style), strictly facing right. Pure flat 2D orthographic side elevation (zero perspective distortion, flat baseline). Rounded vintage front hood and cab featuring a two-tone paint job: warm antique cream (#FFF3DA) on top cab roof and deep classic blue (#1769C2) on lower body panels. Circular polished chrome vintage side mirror, horizontal varnished teak wood slat paneling running along the lower side of the enclosed food cargo box, cute rear service hatch with a tiny embossed gold leaf badge. EXACT GEOMETRY REQUIREMENT: Exactly two semicircular empty wheel arch cutouts horizontally aligned along the baseline at precisely 22% and 78% of the vehicle length; interior of both arches must be 100% transparent PNG alpha cutouts. DO NOT RENDER WHEELS OR TIRES. Bold clean navy contours (#0D2B52), warm nostalgic 2-tone cel shading. 1024x512 resolution, pure transparent background, no ground contact shadow, no real emblems, no text.
```
*Negative Prompt*:
```text
wheels, wheels attached, tires, modern sports car, 3/4 view, angled perspective, rust, dirty grunge, cast shadow, text, watermark, fake transparency.
```

---

### 8. Skin Bodi 4 — "Sport Delivery Special" (Tuned Racing Division Canter)
*Konsep*: Truk balap modifikasi sirkuit kejuaraan Pantura. Bumper depan ceper dengan splitter aerodinamis serat karbon, spoiler atap kabin sporty, bodi boks komposit ringan dengan decal striping balap diagonal warna kuning emas gizi (`#F5BD3F`) dan biru langit (`#58B7F2`), serta kisi-kisi intercooler ventilasi udara di samping kabin.

```text
Production-ready 2D side-view game sprite of a high-performance tuned racing delivery box truck body, strictly facing right. Pure flat 2D orthographic side profile (zero yaw, zero pitch, flat bottom line). Aerodynamic low-profile front racing bumper with a subtle carbon-fiber front splitter, sleek cab roof wind deflector spoiler. Deep vibrant cobalt blue body (#1769C2) decorated with sharp dynamic diagonal racing stripes in nutritious gold (#F5BD3F) and sky blue (#58B7F2). Lightweight composite insulated cargo box with stylized modern air vent gills behind the cab door. EXACT GEOMETRY REQUIREMENT: Exactly two semicircular empty wheel well cutouts placed on the same horizontal axle line at precisely 22% and 78% of the body length; wheel openings must be completely transparent with zero contents. DO NOT RENDER WHEELS, TIRES, OR BRAKE DISCS. Crisp dark navy vector contours (#0D2B52), bold vibrant cel highlights, energetic track-ready look. 1024x512 resolution (2:1 ratio), pure transparent PNG background, no floor shadow, no text, no watermark.
```
*Negative Prompt*:
```text
wheels, tires, wheel rim, 3D perspective, angled hood, front quarter view, road surface, tire skid marks, blur, photorealism, text, sponsor logos, watermark.
```

---

## BAGIAN C: VARIAN VELG & BAN RODA MMG (GARASI KUSTOMISASI)

*Aturan Geometri Engine Wajib*:
1. **Bentuk & Pivot**: Lingkaran simetris sempurna (*perfect circular disc*) yang berpusat persis di titik tengah kanvas `(X: 256, Y: 256)` pada kanvas kotak 512 × 512 px.
2. **Sudut Pandang**: 100% Orthographic Side-View tegak lurus (Tampak samping langsung tanpa miring/oval/elips).
3. **Keterbacaan Visual**: Siluet palang dan dop velg harus memiliki kontras tinggi dan garis kontur navy tegas (`#0D2B52`) agar tetap tajam saat di-render pada diameter game (skala 38–48 px).
4. **Padding**: Sisakan ruang transparan minimal 8% di sekeliling ban agar ban tidak terpotong tepi gambar.

---

### 9. Velg 1 — "Standard Utility Rim" (Velg Kaleng Baja Standar)
*Konsep*: Velg kaleng baja 5 lubang standar armada niaga Indonesia yang tangguh, praktis, dan awet.

```text
Production-ready 2D game sprite of an orthographic side-view standard utility truck wheel, perfectly circular and centered on a 512x512 square transparent canvas. Heavy-duty dark navy-charcoal rubber tire (#0D2B52) with clean highway tread ridges along the outer perimeter. Sturdy pressed-steel rim painted in utilitarian cobalt blue (#1769C2) with five circular ventilation cooling holes, central silver-chrome axle hubcap secured with five hexagonal steel lug nuts. Bold uniform dark navy outer contour lines (#0D2B52, stroke 4px), clean 2-step cel shading with soft metallic reflection from top-left. Perfectly centered pivot, zero perspective tilt, zero oval distortion. Pure transparent PNG background with 8% outer padding, readable at 38px game size, no ground contact deformation, no text, no watermark.
```
*Negative Prompt*:
```text
angled perspective, isometric wheel, oval shape, attached vehicle axle, car chassis, ground shadow, motion blur, photorealistic 3D, text, watermark.
```

---

### 10. Velg 2 — "Gold Racing Alloy" (Velg Palang 5 Balap Emas)
*Konsep*: Velg palang lima alloy sporty berwarna emas kilau metalik, favorit pengemudi yang gemar kecepatan tinggi di jalan tol.

```text
Production-ready 2D game sprite of an orthographic side-view custom racing alloy wheel for a light truck, perfectly circular and centered on a 512x512 square canvas. Low-profile high-grip black rubber tire with directional sports tread notches. Gorgeous metallic golden-yellow five-spoke alloy rim (#F5BD3F) with sculpted star-pattern spokes, deep cobalt blue center hub ring, and gleaming polished chrome lug nuts. High-contrast vector cel shading with brilliant directional shine highlights, bold clean navy blue lineart contours (#0D2B52). Perfectly circular disc (1:1 ratio), centered at (256,256), flat orthographic front view. Pure transparent PNG background with safety margin, readable at 38px in-game scale. No blur, no attached car parts, no text, no watermark.
```
*Negative Prompt*:
```text
3d perspective, angled view, elliptical distortion, attached brake caliper, suspension strut, ground shadow, photorealistic CGI, text, watermark.
```

---

### 11. Velg 3 — "Mud-Terrain Beadlock" (Ban Pacul Offroad Ekstrem)
*Konsep*: Ban offroad ekstrem bertapak pacul kasar untuk menerjang lumpur becek dan tanah licin tanjakan bukit.

```text
Production-ready 2D game sprite of an orthographic side-view extreme heavy-duty mud-terrain offroad truck wheel, perfectly circular and centered on a 512x512 square canvas. Extra-thick knobby off-road tread blocks with aggressive mud-ejector lugs on a rugged matte dark navy tire (#0D2B52). Tough multi-piece steel beadlock rim featuring an electric sky blue outer locking ring (#58B7F2) fastened with eight visible heavy-duty industrial hex bolts, dark gunmetal gray recessed center hub. Crisp vector cel shading with rugged durable textures, bold navy contour lineart. Perfectly symmetrical circular disc, centered at (256,256). Pure transparent PNG background, 8% outer padding, no ground flattening, no text, no watermark.
```
*Negative Prompt*:
```text
perspective tilt, oval tire, flat tire, mud splatters covering spokes, attached car axle, photorealism, text, watermark, opaque background.
```

---

### 12. Velg 4 — "Retro White-Wall Cruiser" (Velg Klasik Strip Putih)
*Konsep*: Velg klasik bergaya heritage dengan ban berpita putih mulus (*white-wall*) dan dop cembung krom berkilau.

```text
Production-ready 2D game sprite of an orthographic side-view vintage retro vehicle wheel, perfectly circular and centered on a 512x512 square canvas. Classic two-tone rubber tire featuring a crisp, immaculate white-wall side ring framed between dark navy outer road tread and the inner wheel rim. Polished mirror-chrome circular dish hubcap with smooth convex reflection curves, subtle delicate sky blue sky reflection line, and a small embossed gold grain emblem at the exact center. Elegant clean vector lineart with bold navy contours (#0D2B52), refined 2-tone cel shading. Perfectly centered circle with 8% outer safety padding. Pure transparent PNG background, high clarity at 38px, no blur, no text, no watermark.
```
*Negative Prompt*:
```text
angled perspective, dirty yellowed whitewall, rust, damaged chrome, oval wheel, attached suspension, photorealism, text, watermark.
```

---

## BAGIAN D: BACKGROUND PANORAMA ANTARMUKA & LAYAR CERITA (RASIO 16:9)

*Spesifikasi Teknis*:
- **Format**: PNG atau WebP berkualitas tinggi.
- **Dimensi**: 1920 × 1080 piksel (Widescreen 16:9).
- **Komposisi Game 2D**: Dirancang berlapis (*layered atmospheric depth*) untuk side-scroller: langit jauh, siluet bukit/gunung di tengah, dan area dasar datar/tenang. **Area tengah dan bawah dibuat bersih serta tidak padat** agar tombol menu, dialog cerita, atau preview truk dapat terbaca dengan sangat nyaman tanpa tabrakan visual.

---

### 13. Background 1 — Main Menu & Welcome Page (Panorama Pantura ke Sekolah)
*Deskripsi*: Lanskap panorama jalan aspal pesisir Pantura Cirebon di pagi hari yang cerah dan damai. Di sebelah kiri terlihat laut biru tenang dengan perahu nelayan kecil, di tengah terdapat jalan aspal membentang mulus diapit deretan pohon kelapa tropis, dan di horizon kejauhan tampak siluet megah Gunung Ciremai di bawah langit biru pastel hangat.

```text
A breathtaking wide panoramic 2D horizontal background landscape illustration for the main menu screen of a cheerful Indonesian vehicle game. Aspect ratio 16:9 (1920x1080). Serene tropical morning horizon near Cirebon: in the far distance, majestic Mount Ciremai silhouette under a soft gradient sky transitioning from warm pale sunrise yellow to pastel sky blue with gentle fluffy clouds. Across the midground, lush green tropical coconut palm trees, peaceful rice field terraces, and glimpses of the calm blue sea with tiny traditional fishing boats on the left. In the lower third, a clean, quiet open stretch of coastal asphalt roadway with gentle tropical morning lighting casting soft shadows. Spacious uncluttered center and lower area designed specifically to host game UI menus and a vehicle preview. Clean cartoon cel-shaded vector art style, rich depth, bright wholesome morning atmosphere. NO characters, NO vehicles on screen, NO text, NO user interface buttons, NO watermark.
```
*Negative Prompt*:
```text
cluttered foreground, busy objects in center, photorealistic, 3d render, dark night, rainy storm, smog, modern skyscrapers, real brand billboards, text, watermark, logo.
```

---

### 14. Background 2 — Garasi Bengkel Zacky (Garasi Modifikasi & Servis)
*Deskripsi*: Bagian dalam bengkel modifikasi Zacky yang bersih, terorganisir, dan berteknologi modern namun tetap bernuansa bengkel lokal yang bersahabat. Lantai beton mengkilap dengan garis panduan servis kuning, hidrolik lift mobil di tengah, papan perkakas dinding penuh kunci pas dan obeng tertata rapi, tumpukan ban balap dan drum oli di sudut.

```text
A detailed 2D horizontal interior background illustration of a clean, organized, and modern automotive tuning workshop (Zacky's Garage) for a casual vehicle game. Aspect ratio 16:9 (1920x1080). Interior setting: polished smooth industrial concrete floor with clean yellow safety boundary stripes, a hydraulic two-post vehicle lift mechanism centered in the midground. Back wall features neatly organized pegboards loaded with chrome wrenches, screwdrivers, socket sets, diagnostic gauges, and tuning blueprint schematics. Side corners feature neatly stacked high-performance tires, steel tool chests, and industrial oil barrels painted in navy (#0D2B52) and cobalt blue (#1769C2). Warm overhead workshop spotlights casting gentle downward conical illumination. The central floor area remains open, clean, and spacious to perfectly showcase the player's 2D truck sprite. Crisp cel-shaded comic vector illustration style, bright welcoming workshop vibe. NO cars currently in the garage, NO characters, NO real trademarks, NO text, NO watermark.
```
*Negative Prompt*:
```text
car parked on lift, human characters, messy trash on floor, filthy dark oil puddles, photorealistic CGI, 3D perspective distortion, text, brand trademarks, watermark.
```

---

### 15. Background 3 — Halaman Gerbang Sekolah Puspa Bangsa (Latar Dialog Cerita)
*Deskripsi*: Pemandangan gerbang utama dan halaman depan kompleks Sekolah Terpadu Puspa Bangsa (SD, SMP, SMA). Gapura masuk megah namun ramah bertema biru-putih-krem, pepohonan ketapang rindang peneduh halaman, tiang bendera merah putih berkibar anggun, dan halaman beraspal rapi yang bersih di pagi hari.

```text
A charming and welcoming 2D horizontal background illustration of the courtyard and main entrance gate of an Indonesian integrated public school complex (Sekolah Puspa Bangsa) for a visual novel story dialogue scene. Aspect ratio 16:9 (1920x1080). Midground showcases an inviting archway school gate painted in cheerful cobalt blue (#1769C2) and warm cream (#FFF3DA) with decorative traditional architectural roof eaves, shady tropical ketapang trees casting dappled leafy morning sunlight onto the clean paved schoolyard. In the background, modern school classroom buildings with blue tiled roofs and an Indonesian flag fluttering gently on a tall flagpole. The lower 40% of the image composition remains calm, clean, and uncluttered to comfortably accommodate transparent dialogue text boxes and character bust sprites. Wholesome comic cel-shaded vector art style, bright optimistic morning lighting. NO people in the schoolyard, NO vehicles, NO real school names, NO typography, NO watermark.
```
*Negative Prompt*:
```text
people, students, teachers, cars, trash, gloomy weather, photorealism, blurry rendering, text on banner, real world logos, watermark, dark shadows.
```

---

## 🛠️ TIPS TEKNIS GENERASI & UPLOAD

1. **Memastikan Latar Transparan (Pure Alpha)**:
   - Jika menggunakan **Higgsfield** atau **Recraft.ai**, aktifkan toggle `Transparent Background / Vector SVG/PNG`.
   - Jika menggunakan **Midjourney v6**, tambahkan `--no background, floor, shadow` dan gunakan tools remove background (seperti `rembg` atau Photoshop select subject) jika masih ada latar putih tipis.
2. **Memotong Wheel Arches pada Skin Truk**:
   - Jika generator tetap menggambar roda kecil, Anda cukup membuka gambar di Photopea/Photoshop, pilih *Eraser Tool* (lingkaran) dengan diameter yang sesuai, lalu hapus kedua roda pada posisi $22\%$ dan $78\%$ hingga tembus kotak-kotak transparan.
3. **Penyimpanan Berkas**:
   - Simpan langsung berkas PNG ke dalam subfolder yang sesuai di `assets/upload/`.
   - Beritahu asisten AI di chat: *"Saya sudah upload berkas [nama_file.png] ke folder assets/upload/[subfolder], tolong integrasikan!"*
   - Asisten AI akan otomatis memproses, mengoptimasi ukuran berkas, memperbarui `assets/manifest.json`, dan menghubungkannya langsung ke dalam gameplay!
