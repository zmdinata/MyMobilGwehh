# MBG: Road To School — Godot 4 Engine Edition (Fase 2)

Direktori ini memuat fondasi implementasi game **MBG: Road To School** berbasis **Godot Engine 4 (2D Physics)** dengan ekspor WebGL (HTML5/WASM) yang siap disematkan ke dalam Next.js dan di-hosting gratis di Vercel.

---

## 1. Arsitektur Proyek Godot 4
- **Renderer**: `GL Compatibility` (dioptimalkan khusus untuk web browser dan smartphone agar tidak memerlukan Vulkan).
- **Physics Engine**: Godot 2D Physics native dengan integrasi:
  - `RigidBody2D`: Sasis truk dan ompreng muatan gizi.
  - `DampedSpringJoint2D`: Simulasi suspensi asimetris per roda depan dan belakang.
  - `PinJoint2D`: Poros as roda.
- **Bahasa**: **GDScript 4** (Bahasa resmi yang didukung 100% untuk ekspor WebGL/WASM Godot 4).

---

## 2. Cara Menjalankan di Editor Godot 4
1. Unduh **Godot Engine 4.3 Standard (Non-.NET)** dari [godotengine.org](https://godotengine.org/).
2. Buka Godot, klik **Import**, lalu pilih file [`godot/project.godot`](file:///c:/Projects/game/godot/project.godot).
3. Tekan **F5** untuk memainkan game langsung di editor.

---

## 3. Ekspor WebGL untuk Vercel Hosting
1. Di Godot Editor, buka menu **Project -> Export**.
2. Tambahkan preset **Web (HTML5)**.
3. Centang opsi:
   - **VRAM Compression**: ETC2/ASTC
   - **Export Path**: `../public/godot_build/index.html`
4. Klik **Export Project**.
5. Hasil build otomatis berada di folder `public/godot_build/` Next.js, siap di-serve statis melalui URL:
   `https://<your-vercel-domain>.vercel.app/godot_build/index.html`
