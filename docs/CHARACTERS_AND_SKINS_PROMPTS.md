# Higgsfield Prompt Pack: Karakter Cerita, Skin Truk, Velg, dan Latar UI (MBG)

Dokumen ini melengkapi `docs/HIGGSFIELD_PROMPTS.md` (poin 1–16 dan 17–22) dengan menyediakan prompt terstruktur untuk:
1. **4 Karakter Cerita Utama** (Tion, Bu Yulie, Husna, Zacky) dengan berbagai ekspresi emosi dialog.
2. **4 Varian Skin Bodi Truk MBG** (sesuai spesifikasi proporsi 100x50 dan wheel arch alignment 22% & 78%).
3. **4 Varian Velg Roda MBG** (lingkaran ortografis terpusat, diameter game 38 px).
4. **3 Background Panorama UI** (Main Menu, Bengkel Garasi Zacky, dan Halaman Gerbang Sekolah untuk Dialog).

---

## Panduan Visual & Gaya Bersama (Art Direction Bible)
- **Gaya Seni**: 2D vector-like cartoon cel-shaded orisinal, kontur outline navy (`#0D2B52`) yang bersih dan konsisten (ketebalan 3–5%), bentuk rounded ramah, pencahayaan pagi tropis dari arah kiri-atas.
- **Palet Warna Utama**:
  - Primary Navy: `#0D2B52` (Outline, teks kontras, sasis)
  - Cobalt Blue: `#1769C2` (Warna bodi truk standar, seragam Tion)
  - Sky Blue: `#58B7F2` (Aksen dinamis, jilbab Bu Yulie)
  - Nutritious Gold: `#F5BD3F` (Koin, bintang, emblem gizi)
  - Warm Cream: `#FFF3DA` (Latar panel dialog, kanvas pelindung makanan)
  - Coral Accent: `#E66B5D` (Ikat rambut Husna, peringatan bensin)
- **Ketentuan Teknis Format Sprite**:
  - Seluruh karakter, bodi, dan ban di-render pada kanvas transparan murni (*pure transparent background*).
  - Margin padding aman minimal 8% di sekeliling sprite agar tidak ada bagian yang terpotong.
  - Bebas dari watermark, teks generator, efek 3D fotorealistik berlebihan, atau bayangan tanah statis yang terpotong.

---

## Bagian A: Lembar Karakter Cerita (Character Bust & Dialog Expressions)

### 1. Tion — Supir Kurir Muda (Protagonis)
- **Deskripsi Profil**: Laki-laki Indonesia 23 tahun, ramah, ulet, pekerja keras, rambut hitam pendek rapi, kulit sawo matang hangat. Mengenakan kemeja kurir utilitarian cobalt blue (`#1769C2`) dengan kerah bergaris navy (`#0D2B52`) dan kaus dalam krem (`#FFF3DA`), dengan saku dada beremblem daun emas gizi kecil.
- **Tujuan**: Digunakan pada panel dialog visual novel saat percakapan sebelum/sesudah balapan.

#### Prompt 1.1: Tion — Normal / Senyum Semangat
```text
Create one isolated character bust portrait of "Tion", a cheerful and determined 23-year-old Indonesian delivery driver for a 2D casual story-driven game. Friendly expressive face, short neat black hair, warm brown skin tone, gentle confident smile. Wearing a utilitarian cobalt-blue (#1769C2) delivery shirt over a warm cream undershirt, navy collar and pocket outline (#0D2B52), small gold nutrition leaf badge on chest pocket. Three-quarter bust portrait angle, bold clean navy contour outline, two-step cel shading, soft tropical morning light from upper-left. Pure transparent background with 10% outer padding. High quality vector-like cartoon comic style. No real brand logos, no text, no watermark, no cropped chin, centered composition.
```

#### Prompt 1.2: Tion — Tersipu / Malu-malu (Menatap Bu Yulie)
```text
Create one isolated character bust portrait of "Tion", young Indonesian delivery driver, blushing with shy romantic embarrassment. Rosy pink blushing cheeks, flustered gentle smile looking slightly downward, right hand lightly rubbing the back of his neck, cute messy front hair strand. Same signature cobalt-blue delivery uniform (#1769C2) with navy collar (#0D2B52). Cel-shaded 2D vector comic art style, crisp navy outline, pure transparent background. Wholesome romantic-comedy expression, relatable and charming. No text, no background, no watermark.
```

#### Prompt 1.3: Tion — Fokus Menyetir / Menanjak Ekstrem
```text
Create one isolated character bust portrait of "Tion", delivery driver, showing intense determination and grit while driving up a steep mountain hill. Determined furrowed eyebrows, grit teeth with confident smirk, slight sweat drop on temple, dynamic head tilt angle. Same cobalt blue delivery uniform. Vibrant cel highlights, crisp navy contour, isolated on transparent background. Energetic game dialogue avatar. No text, no background, no watermark.
```

---

### 2. Bu Yulie — Ibu Guru Bersahaja & Anggun (Love Interest)
- **Deskripsi Profil**: Guru muda 25 tahun di Sekolah Puspa Bangsa, berhijab rapi warna sky blue (`#58B7F2`) berpadu krem lembut (`#FFF3DA`), mengenakan blus seragam batik modern warna navy dengan aksen emas (`#F5BD3F`). Wajah teduh, ramah, penuh empati dan perhatian.

#### Prompt 2.1: Bu Yulie — Senyum Hangat Menyambut
```text
Create one isolated character bust portrait of "Bu Yulie", a graceful and approachable 25-year-old Indonesian school teacher for a 2D story game. Kind expressive eyes, gentle warm welcoming smile, neat elegant hijab in soft sky blue (#58B7F2) and pale cream tones framing her friendly face. Modest professional blouse with subtle navy (#0D2B52) and gold (#F5BD3F) batik-inspired geometric accents. Three-quarter view, clean bold navy outlines, clean two-tone cel shading, bright morning lighting. Pure transparent background, high readability. Respectful Indonesian teacher aesthetic. No photo realism, no text, no watermark.
```

#### Prompt 2.2: Bu Yulie — Khawatir & Perhatian ("Hati-hati di jalan ya, Mas Tion")
```text
Create one isolated character bust portrait of "Bu Yulie", high school teacher, expressing gentle concern and empathy. Brow slightly knit with soft caring eyes, one hand resting near her collarbone, warm compassionate expression. Same neat sky-blue hijab and batik blouse. Bold navy outline, vector cel shading, isolated transparent canvas. Wholesome emotional nuance. No text, no watermark.
```

#### Prompt 2.3: Bu Yulie — Gembira & Terkesan (Menerima Pengantaran Sukses)
```text
Create one isolated character bust portrait of "Bu Yulie", teacher, beaming with genuine joy and admiration. Bright sparkling eyes, radiant happy smile, hands clasped together near chest in appreciation. Same signature sky blue hijab and modest elegant uniform. Crisp navy contours, clear highlights, transparent background. Warm uplifting comic art style. No watermark, no text.
```

---

### 3. Husna — Siswi SMA Puspa Bangsa (Ceria & Mak Comblang)
- **Deskripsi Profil**: Siswi SMA kelas 11 berumur 16 tahun, energik, usil, ceria, dan suka menggoda Tion. Rambut hitam ikal diikat kuncir samping (*side ponytail*) dengan ikat rambut koral-merah (`#E66B5D`). Mengenakan seragam putih abu-abu dengan dasi navy rapi dan pin biru sekolah di saku.

#### Prompt 3.1: Husna — Menggoda / Kedipan Jahil ("Cieee, Mas Tion...")
```text
Create one isolated character bust portrait of "Husna", a playful and spirited 16-year-old Indonesian high school girl (SMA Puspa Bangsa) for a 2D story game. Mischievous wide grin, one playful wink, short wavy black hair tied in a cheerful side ponytail with a coral hair tie (#E66B5D). Wearing an Indonesian high school uniform: crisp white shirt, navy necktie, and fictional school crest on pocket. Three-quarter dynamic pose, finger pointing playfully sideways. Bold navy outline, flat cel shading with soft highlights, transparent background. Fun anime-comic youth aesthetic. No real school logo, no text, no watermark.
```

#### Prompt 3.2: Husna — Lapar Menanti Makanan Sehat
```text
Create one isolated character bust portrait of "Husna", schoolgirl, holding a small empty stainless food container eagerly. Wide excited eyes, happy open-mouth smile, anticipating delicious lunch. Same school uniform and side ponytail. Expressive cartoon exaggeration, clean navy outlines, cel shading, isolated on transparent background. No text, no watermark.
```

#### Prompt 3.3: Husna — Menyemangati ("Ayo Mas Tion, tembak Bu Yulie!")
```text
Create one isolated character bust portrait of "Husna", schoolgirl, pumping both fists in celebration and encouragement. Cheerful victory expression shouting encouragement. Vibrant comic lineart, bold navy borders, transparent background. No text, no watermark.
```

---

### 4. Zacky — Montir Jenius & Sahabat Tion
- **Deskripsi Profil**: Montir mobil 24 tahun, cerdas, percaya diri, berambut hitam sedikit berantakan yang ditutup topi navy terbalik. Ada sedikit noda oli di pipi. Memakai rompi bengkel kanvas navy (`#0D2B52`) dan kaus abu-abu, dengan kunci pas terselip di saku rompi.

#### Prompt 4.1: Zacky — Pose Percaya Diri dengan Kunci Pas (Garasi Modifikasi)
```text
Create one isolated character bust portrait of "Zacky", a clever and confident 24-year-old Indonesian automotive mechanic for a 2D casual game. Charismatic grin, slightly disheveled dark hair under a backwards navy baseball cap, light grease smudge on left cheek. Durable mechanic vest in dark denim navy (#0D2B52) and cobalt blue accents (#1769C2) over a heather-gray shirt, silver wrench tucked into his shoulder strap pocket. Confident three-quarter stance, thumbs up gesture. Bold clean navy contours, sharp cel shading. Isolated on transparent background. Trustworthy craftsman aesthetic. No brand trademarks, no text, no watermark.
```

#### Prompt 4.2: Zacky — Menganalisis Mesin / Berpikir Taktis
```text
Create one isolated character bust portrait of "Zacky", mechanic, holding a clipboard or blueprint, thoughtful confident smile, hand on chin as if analyzing truck suspension specs. Backwards cap, navy vest, clean vector illustration style, bold navy outline, transparent background. Sharp game UI portrait. No real logos, no text, no watermark.
```

---

## Bagian B: Varian Skin Bodi Truk MBG (Garasi Kustomisasi)

*Kebutuhan Integrasi Engine:*
- Rasio proporsi sprite: **100 x 50 unit game**.
- Arah menghadap: **Menghadap ke kanan**.
- Lengkungan roda (*wheel arches*): **Dua lubang lingkaran kosong transparan persis pada 22% dan 78% panjang bodi pada satu garis horizontal yang sama**, tanpa ada roda tergambar di sprite bodi.

### 5. Skin Bodi 1 — "Speedy Courier" (Pickup Aerodinamis Ringan)
```text
Create one production-ready 2D side-view game sprite of an aerodynamic lightweight delivery pickup truck, facing right. Low streamlined cab in vibrant cobalt blue (#1769C2) with sky blue racing accents (#58B7F2), open rear pickup bed holding neatly strapped stainless food containers with a clean cream canvas cover. Exactly two circular wheel openings aligned on the same horizontal axle line at 22% and 78% of the vehicle length; keep wheel arches completely empty and transparent for separate wheels. Bold navy contours (#0D2B52), clean two-level cel shading, transparent background with 8% padding. Proportions 100x50 game units. No wheels drawn, no real logos, no license plate, no cast shadow.
```

### 6. Skin Bodi 2 — "Mountain Explorer" (Heavy Duty Offroad Box)
```text
Create one production-ready 2D side-view game sprite of a heavy-duty expedition school-food box truck, facing right. Reinforced dark steel front bullbar, raised cobalt blue cargo box with diamond-plate lower side skirts, heavy-duty roof rack carrying two red auxiliary fuel canisters. Exactly two circular wheel well openings aligned horizontally at 22% and 78% of total length; arches must remain completely transparent. Bold vector outline, warm cream roof, two-level cel shading. Centered on transparent background, no wheels attached, no letters, no real brand emblem, no ground shadow.
```

### 7. Skin Bodi 3 — "Retro Food Truck" (Classic Oplet Heritage Style)
```text
Create one production-ready 2D side-view game sprite of a vintage Indonesian classic utility delivery truck (oplet heritage style), facing right. Rounded retro cab with two-tone cream (#FFF3DA) and cobalt blue (#1769C2), vintage chrome circular side mirror, wooden slat detailing on the lower cargo box sides, neat rear food hatch with a tiny gold leaf emblem. Exactly two circular wheel well arches horizontally aligned at 22% and 78% of length, interior of arches completely transparent. Bold navy contours, warm nostalgic cel shading, transparent background. No wheels drawn, no real brand badge, no text, no ground shadow.
```

### 8. Skin Bodi 4 — "Sport Delivery Special" (Tuned Racing Division)
```text
Create one production-ready 2D side-view game sprite of a high-performance tuned school-meal delivery box truck, facing right. Front bumper aerodynamic splitter, subtle roof cab spoiler, deep cobalt blue body with dynamic golden yellow (#F5BD3F) and sky blue (#58B7F2) diagonal racing stripes, lightweight composite cargo box panels. Exactly two circular wheel openings at 22% and 78% of vehicle length on the same horizontal axle; wheel wells completely empty. Bold navy vector outline, high-contrast cel highlights. Pure transparent background, no wheels rendered, no text, no watermark.
```

---

## Bagian C: Varian Velg Roda MBG (Garasi Kustomisasi)

*Kebutuhan Integrasi Engine:*
- Kanvas persegi transparan murni, lingkaran simetris persis di tengah.
- Diameter visual dapat dibaca tajam pada skala render 38 px.

### 9. Velg 1 — "Standard Utility Rim" (Velg Kaleng MBG Standar)
```text
Create one isolated orthographic side-view utility truck wheel sprite, perfectly circular and centered on a transparent square canvas. Chunky dark navy rubber tire (#0D2B52), clean cobalt-blue steel rim ring (#1769C2), silver 5-lug center hub. Bold clean outer contour, restrained cel-shaded highlights from upper left, transparent safety margin around outer tire. Readable at 38px game diameter. No motion blur, no logo, no detached car parts.
```

### 10. Velg 2 — "Gold Racing Alloy" (Velg Palang 5 Balap Emas)
```text
Create one isolated orthographic side-view custom racing wheel sprite for a 2D truck, perfectly circular on a transparent square canvas. High-performance directional tread black rubber tire, bright metallic gold five-spoke alloy rim (#F5BD3F), deep cobalt blue center hub ring, and chrome lug nuts. Bold clean navy contours (#0D2B52), distinct cel highlights from top left, perfectly centered pivot. Transparent padding around tire edge. Readable at 38px size. No motion blur, no brand logo, no attached car parts.
```

### 11. Velg 3 — "Mud-Terrain Beadlock" (Ban Pacul Offroad Ekstrem)
```text
Create one isolated orthographic side-view extreme mud-terrain truck wheel sprite, circular on a transparent square canvas. Extra-deep knobby off-road tread blocks on a matte dark navy tire (#0D2B52), steel beadlock rim ring in electric sky blue (#58B7F2) with eight visible heavy-duty bolts, dark gunmetal industrial hub. Pristine vector cel shading, high contrast, readable at 38px game unit size. Transparent background, perfectly centered, no text, no ground contact distortion.
```

### 12. Velg 4 — "Retro White-Wall Cruiser" (Velg Klasik Strip Putih)
```text
Create one isolated orthographic side-view vintage retro vehicle wheel sprite, perfectly circular on a transparent square canvas. Classic white-wall rubber tire ring framed by dark tread, polished chrome dish hubcap with a small embossed golden grain emblem, delicate sky blue rim reflection. Clean vector contours, elegant cel shading, transparent safety padding. Perfectly centered, no blur, no text, no watermark.
```

---

## Bagian D: Background Panorama Antarmuka & Layar Cerita (Rasio 16:9)

### 13. Background 1 — Main Menu & Welcome Page (Panorama Pantura ke Sekolah)
```text
Create a wide panoramic 2D side-view landscape illustration for the main menu screen of a cheerful Indonesian vehicle game. Soft tropical morning horizon near Cirebon: peaceful winding asphalt road in the foreground, distant lush green terraced hills and Mount Ciremai silhouette, serene clear sky transitioning from pale cream-yellow to soft sky blue. In the middle distance, a charming modern Indonesian school complex with blue and white roofs (SD, SMP, SMA Puspa Bangsa) surrounded by tropical palms. Warm, inviting, cel-shaded vector art style, rich atmospheric depth but uncluttered center to allow UI buttons and truck showcase. 16:9 aspect ratio, no UI elements, no characters in foreground, no text, no watermark.
```

### 14. Background 2 — Garasi Bengkel Zacky (Garasi Modifikasi & Servis)
```text
Create a detailed 2D horizontal background illustration of a clean, organized automotive garage and tuning workshop for a casual game. Interior view: polished concrete floor with subtle tire mark reflections, hydraulic two-post car lift in the center, neat tool pegboards with wrenches and gauges on the back wall, stacked off-road tires, oil barrels, and a workbench with engine parts. Color scheme features industrial navy (#0D2B52), cobalt blue accents, warm overhead work lights casting gentle downward spotlights. High clarity, warm comic cel-shaded vector style, open spacious center floor for displaying the player's truck. 16:9 ratio, no cars currently on screen, no real trademarks, no text, no watermark.
```

### 15. Background 3 — Halaman Gerbang Sekolah Puspa Bangsa (Latar Dialog Cerita)
```text
Create a charming 2D horizontal background illustration of an Indonesian public school courtyard for a visual novel story dialogue scene. Welcoming blue-and-cream school entrance gate archway with a small fictional Puspa Bangsa banner frame, shady tropical ketapang trees, clean paved schoolyard, cheerful morning sunlight with soft leaf shadows. Lower third of the composition remains clean and quiet to accommodate character dialogue text boxes. 16:9 aspect ratio, clean cel-shaded vector style, no people in scene, no real-world school emblems, no text, no watermark.
```
