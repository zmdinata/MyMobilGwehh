// game_core.js - Core Physics, Terrain, and Game Logic for MMG (My Mobil Gwehh): Road To School
// Pure ES module for testing and browser integration.

export const BIOMES = {
  // 8 Dedicated Biomes (each corresponding directly to one of the 8 distinct PNG background illustrations):
  PESISIR_PANTURA: { id: 1, name: 'Pesisir Pantai Pantura', assetKey: 'biome1Distant', start: 0, end: 600 },
  JALUR_PANTURA:   { id: 2, name: 'Jalur Arteri Pantura', assetKey: 'biome1Midground', start: 600, end: 1200 },
  LEMBAH_SAWAH:    { id: 3, name: 'Hamparan Lembah Sawah', assetKey: 'biome2Distant', start: 1200, end: 2000 },
  DESA_SAWAH:      { id: 4, name: 'Pedesaan Lumbung Padi', assetKey: 'biome2Midground', start: 2000, end: 2800 },
  PUNCAK_GUNUNG:   { id: 5, name: 'Puncak Siluet Gn. Ciremai', assetKey: 'biome3Distant', start: 2800, end: 3500 },
  LERENG_GUNUNG:   { id: 6, name: 'Lereng Hutan Pinus Terjal', assetKey: 'biome3Midground', start: 3500, end: 4200 },
  PEMUKIMAN:       { id: 7, name: 'Kawasan Pemukiman Suburb', assetKey: 'biome4Distant', start: 4200, end: 4400 },
  SEKOLAH:         { id: 8, name: 'Kompleks Sekolah Puspa Bangsa', assetKey: 'biome4Midground', start: 4400, end: 4600 },

  // Backward compatibility aliases for legacy test fixtures:
  PANTURA:         { id: 1, name: 'Pesisir Pantai Pantura', assetKey: 'biome1Distant', start: 0, end: 1200 },
  SAWAH:           { id: 3, name: 'Hamparan Lembah Sawah', assetKey: 'biome2Distant', start: 1200, end: 2800 },
  GUNUNG:          { id: 5, name: 'Puncak Siluet Gn. Ciremai', assetKey: 'biome3Distant', start: 2800, end: 4200 }
};

export const PHYSICS_CONSTANTS = {
  GRAVITY: 980,             // px/s^2 downward
  K_SPRING: 1800,           // Specified in PRD: K_spring = 1800
  K_DAMPER: 48,             // Specified in PRD: K_damper = 48
  MASS: 1400,               // Specified in PRD: Mass = 1400
  ROLLOVER_ANGLE: 1.8326,    // 105 degrees in radians
  ROLLOVER_GRACE_TIME: 0.45,// seconds
  MAX_PENETRATION_CLAMP: 8, // px before clamping
  LOG_IMPULSE_VY: -140,      // px/s vertical impulse when hitting log
  WATER_SLIP_TRACTION: 0.85,
  MUD_SLIP_TRACTION: 0.82,
  MUD_DRAG_RATE: 2.5,        // 1/s chassis-transmitted rolling drag; leaves enough pace for skilled completion
  METER_SCALE: 20,          // 20 px = 1 meter
  MAX_FORWARD_SPEED: 550,   // px/s = 99 km/h on HUD; holds momentum without 162 km/h arcade spikes
  MAX_REVERSE_SPEED: 220,   // px/s; reverse is slower than forward drive
  MAX_ANGULAR_SPEED: 3.0,   // rad/s; preserves controllable wheelies and airborne recovery
  ANGULAR_DAMPING: 3.5,     // per second; settles pitch after releasing the controls
  AIR_PITCH_TORQUE: 6.5,    // rad/s^2; responsive mid-air pitch adjustment and flip capability
  GROUND_GAS_PITCH_TORQUE: 260,
  GROUND_BRAKE_PITCH_TORQUE: 120, // sequential high-speed test: lifts rear tire while staying within recoverable pitch
  THROTTLE_RAMP_UP: 6.0,    // per second; softens launch and wheelie onset
  THROTTLE_RAMP_DOWN: 8.0,  // per second; releases engine torque promptly
  REVERSE_RAMP_UP: 4.0      // per second; prevents an abrupt reverse snap
};

export const LEVEL_CONFIGS = [
  { level: 1, name: 'Tugas Pagi Pertama: Hamparan Sawah', finishMeters: 3000, distanceMeters: 3000, totalMeters: 3150, timeLimit: 260, timeLimitSec: 260, checkpoints: [1500], biomes: [BIOMES.LEMBAH_SAWAH, BIOMES.DESA_SAWAH, BIOMES.SEKOLAH], menuGizi: 'Nasi Pulen & Ayam Serundeng', kalori: '~650 kkal', nutrisiUtama: 'Karbohidrat Kompleks & Protein Hewani 22g', tips: 'Jalan pematang sawah becek dan licin! Gas halus biar boks tetap anteng — Mang Abdul' },
  { level: 2, name: 'Angin Pesisir & Senyum Pertama', finishMeters: 3800, distanceMeters: 3800, totalMeters: 3950, timeLimit: 310, timeLimitSec: 310, checkpoints: [1900], biomes: [BIOMES.PESISIR_PANTURA, BIOMES.JALUR_PANTURA, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH], menuGizi: 'Ayam Lengkuas & Teh Melati', kalori: '~670 kkal', nutrisiUtama: 'Protein Penunjang Pertumbuhan & Antioksidan', tips: 'Jalan asin agak licin, jaga kestabilan bodi truk — Mang Abdul' },
  { level: 3, name: 'Cieee Mas Tion! Pematang Berliku', finishMeters: 4600, distanceMeters: 4600, totalMeters: 4750, timeLimit: 360, timeLimitSec: 360, checkpoints: [2300], biomes: [BIOMES.DESA_SAWAH, BIOMES.LERENG_GUNUNG, BIOMES.PUNCAK_GUNUNG, BIOMES.SEKOLAH], menuGizi: 'Tempe Orek & Tahu Bacem', kalori: '~660 kkal', nutrisiUtama: 'Protein Nabati Fermentasi & Serat Probiotik', tips: 'Rute desa bergelombang, perhatikan ayunan suspensi — Bang Zacky' },
  { level: 4, name: 'Setelan Bengkel Zacky di Jalur Arteri', finishMeters: 5500, distanceMeters: 5500, totalMeters: 5650, timeLimit: 420, timeLimitSec: 420, checkpoints: [2700], biomes: [BIOMES.JALUR_PANTURA, BIOMES.LEMBAH_SAWAH, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH], menuGizi: 'Sayur Lodeh Labu Siam', kalori: '~680 kkal', nutrisiUtama: 'Serat Pangan Alami & Vitamin A-C Labu', tips: 'Kuah lodeh sensitif guncangan! Mendarat sejajar lereng — Mang Abdul' },
  { level: 5, name: 'Hujan Gerimis & Terasering Licin', finishMeters: 6500, distanceMeters: 6500, totalMeters: 6650, timeLimit: 480, timeLimitSec: 480, checkpoints: [2200, 4400], biomes: [BIOMES.LERENG_GUNUNG, BIOMES.PUNCAK_GUNUNG, BIOMES.DESA_SAWAH, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH], menuGizi: 'Bandeng Presto Tanpa Duri', kalori: '~690 kkal', nutrisiUtama: 'Omega-3 EPA/DHA 1200mg Penajam Otak', tips: 'Lumpur licin terasering kayak ujian cinta, jangan panik ngepot! — Mang Abdul' },
  { level: 6, name: 'Kubangan Lumpur Terasering', finishMeters: 7500, distanceMeters: 7500, totalMeters: 7650, timeLimit: 540, timeLimitSec: 540, checkpoints: [2500, 5000], biomes: [BIOMES.LEMBAH_SAWAH, BIOMES.LERENG_GUNUNG, BIOMES.PUNCAK_GUNUNG, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH], menuGizi: 'Telur Rebus Balado Tomat', kalori: '~670 kkal', nutrisiUtama: 'Kolin 147mg & Albumin Pembentuk Memori', tips: 'Awas balok kayu irigasi! Manfaatkan air-pitch control — Bang Zacky' },
  { level: 7, name: 'Botol Air Minum Bu Yulie', finishMeters: 8600, distanceMeters: 8600, totalMeters: 8750, timeLimit: 600, timeLimitSec: 600, checkpoints: [2800, 5700], biomes: [BIOMES.PUNCAK_GUNUNG, BIOMES.LERENG_GUNUNG, BIOMES.PESISIR_PANTURA, BIOMES.JALUR_PANTURA, BIOMES.SEKOLAH], menuGizi: 'Pisang Raja & Jeruk Manis Lokal', kalori: '~650 kkal', nutrisiUtama: 'Kalium 350mg & Vitamin C Daya Tahan', tips: 'Tanjakan terjal Ciremai, jaga rpm jangan sampai tekor! — Mang Abdul' },
  { level: 8, name: 'Misi Mak Comblang Husna', finishMeters: 9800, distanceMeters: 9800, totalMeters: 9950, timeLimit: 670, timeLimitSec: 670, checkpoints: [3200, 6500], biomes: [BIOMES.PESISIR_PANTURA, BIOMES.DESA_SAWAH, BIOMES.LERENG_GUNUNG, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH], menuGizi: 'Sayur Bening Bayam Jagung', kalori: '~660 kkal', nutrisiUtama: 'Zat Besi, Lutein & Zeaxanthin Mata', tips: 'Angin pesisir samping & batu lepas, ban kompon siap mencengkeram kuat — Bang Zacky' },
  { level: 9, name: 'Uji Shockbreaker Anyar', finishMeters: 11000, distanceMeters: 11000, totalMeters: 11150, timeLimit: 740, timeLimitSec: 740, checkpoints: [3600, 7300], biomes: [BIOMES.JALUR_PANTURA, BIOMES.PUNCAK_GUNUNG, BIOMES.LEMBAH_SAWAH, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH], menuGizi: 'Opor Telur Tahu Kuning', kalori: '~680 kkal', nutrisiUtama: 'Kurkumin Alami & Asam Amino Esensial', tips: 'Bypass Pantura lurus bergelombang, shockbreaker anyar siap redam hentakan — Bang Zacky' },
  { level: 10, name: 'Petuah Sang Legenda Mang Abdul', finishMeters: 12500, distanceMeters: 12500, totalMeters: 12650, timeLimit: 820, timeLimitSec: 820, checkpoints: [4000, 8300], biomes: [BIOMES.DESA_SAWAH, BIOMES.PESISIR_PANTURA, BIOMES.PUNCAK_GUNUNG, BIOMES.LERENG_GUNUNG, BIOMES.SEKOLAH], menuGizi: 'Susu Murni Segar Kuningan', kalori: '~700 kkal', nutrisiUtama: 'Kalsium 300mg & Vitamin D Tulang Kuat', tips: '500 botol kaca susu! Nol toleransi benturan di jalan desa! — Mang Abdul' },
  { level: 11, name: 'Tanjakan Kabut Perbukitan', finishMeters: 13800, distanceMeters: 13800, totalMeters: 13950, timeLimit: 890, timeLimitSec: 890, checkpoints: [4500, 9200], biomes: [BIOMES.LERENG_GUNUNG, BIOMES.LEMBAH_SAWAH, BIOMES.DESA_SAWAH, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH], menuGizi: 'Pecel Sayur Saus Kacang', kalori: '~670 kkal', nutrisiUtama: 'Serat Kasar, Folat & Lemak Nabati Sehat', tips: 'Kabut tebal lereng pinus, nyalakan lampu kabut dan fokus jalan — Mang Abdul' },
  { level: 12, name: 'Melayang Demi Bu Guru', finishMeters: 15000, distanceMeters: 15000, totalMeters: 15150, timeLimit: 960, timeLimitSec: 960, checkpoints: [5000, 10000], biomes: [BIOMES.PESISIR_PANTURA, BIOMES.JALUR_PANTURA, BIOMES.PUNCAK_GUNUNG, BIOMES.LERENG_GUNUNG, BIOMES.SEKOLAH], menuGizi: 'Ikan Kembung Bakar Kunyit', kalori: '~690 kkal', nutrisiUtama: 'Kalsium Tulang & Asam Lemak Sehat', tips: 'Lompatan bukit pesisir tinggi! Salto indah demi Bu Guru — Husna' },
  { level: 13, name: 'Surat Rantang Rahasia', finishMeters: 16500, distanceMeters: 16500, totalMeters: 16650, timeLimit: 1040, timeLimitSec: 1040, checkpoints: [4200, 8500, 12600], biomes: [BIOMES.LEMBAH_SAWAH, BIOMES.PUNCAK_GUNUNG, BIOMES.PESISIR_PANTURA, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH], menuGizi: 'Pepes Ikan Mas Daun Kemangi', kalori: '~680 kkal', nutrisiUtama: 'Mineral Fosfor & Minyak Atsiri Kemangi', tips: 'Ada surat pantun di rantang! Jangan sampai basah di pematang sawah — Husna' },
  { level: 14, name: 'Pipi Merah di Ruang Guru', finishMeters: 17800, distanceMeters: 17800, totalMeters: 17950, timeLimit: 1110, timeLimitSec: 1110, checkpoints: [4500, 9000, 13500], biomes: [BIOMES.DESA_SAWAH, BIOMES.LERENG_GUNUNG, BIOMES.JALUR_PANTURA, BIOMES.PUNCAK_GUNUNG, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH], menuGizi: 'Sambal Goreng Hati Kentang Dadu', kalori: '~690 kkal', nutrisiUtama: 'Zat Besi Heme & Vitamin B12 Anti-Anemia', tips: 'Hairpin tebing pedesaan curam, gunakan rem halus teratur — Mang Abdul' },
  { level: 15, name: 'Batu Curam & Mesin Stage 15', finishMeters: 19000, distanceMeters: 19000, totalMeters: 19150, timeLimit: 1180, timeLimitSec: 1180, checkpoints: [4800, 9600, 14400], biomes: [BIOMES.PUNCAK_GUNUNG, BIOMES.LERENG_GUNUNG, BIOMES.LEMBAH_SAWAH, BIOMES.DESA_SAWAH, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH], menuGizi: 'Sop Ayam Kaldu Kampung Makaroni', kalori: '~700 kkal', nutrisiUtama: 'Kolagen Alami 1500mg & Elektrolit Kaldu', tips: 'Tanjakan cadas Ciremai ekstrem, relaksasi tangan dan jaga torsi — Mang Abdul' },
  { level: 16, name: 'Payung Teduh di Depan Gerbang', finishMeters: 20200, distanceMeters: 20200, totalMeters: 20350, timeLimit: 1250, timeLimitSec: 1250, checkpoints: [5000, 10100, 15200], biomes: [BIOMES.PESISIR_PANTURA, BIOMES.LEMBAH_SAWAH, BIOMES.LERENG_GUNUNG, BIOMES.PUNCAK_GUNUNG, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH], menuGizi: 'Puding Melon & Chia Seed', kalori: '~660 kkal', nutrisiUtama: 'Serat Pektin & Omega-3 Nabati Sehat', tips: 'Ulang tahun Bu Yulie! Jangan telat sedetik pun menerjang badai pesisir — Mas Tion' },
  { level: 17, name: 'Dukungan Penuh Zacky & Husna', finishMeters: 21500, distanceMeters: 21500, totalMeters: 21650, timeLimit: 1320, timeLimitSec: 1320, checkpoints: [5300, 10700, 16100], biomes: [BIOMES.JALUR_PANTURA, BIOMES.DESA_SAWAH, BIOMES.LERENG_GUNUNG, BIOMES.PUNCAK_GUNUNG, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH], menuGizi: 'Opor Ayam Kampung Rempah', kalori: '~700 kkal', nutrisiUtama: 'Protein Tinggi & Kurkumin Pemelihara Imunitas', tips: 'Bypass arteri Pantura panjang! Buktikan performa mesin bertenaga — Bang Zacky' },
  { level: 18, name: 'Tanjakan Penentu Nyali', finishMeters: 22800, distanceMeters: 22800, totalMeters: 22950, timeLimit: 1390, timeLimitSec: 1390, checkpoints: [5600, 11300, 17100], biomes: [BIOMES.LEMBAH_SAWAH, BIOMES.DESA_SAWAH, BIOMES.PESISIR_PANTURA, BIOMES.LERENG_GUNUNG, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH], menuGizi: 'Sayur Asem Sunda Jagung Manis', kalori: '~670 kkal', nutrisiUtama: 'Magnesium & Asam Organik Pemulih Stamina', tips: 'Semburat senja di atas lembah sawah, jaga ritme kemudi tetap prima — Bu Yulie' },
  { level: 19, name: 'Persiapan Pesta Gizi Akbar', finishMeters: 24000, distanceMeters: 24000, totalMeters: 24150, timeLimit: 1460, timeLimitSec: 1460, checkpoints: [5800, 11800, 17900], biomes: [BIOMES.LERENG_GUNUNG, BIOMES.PUNCAK_GUNUNG, BIOMES.JALUR_PANTURA, BIOMES.DESA_SAWAH, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH], menuGizi: 'Nasi Kuning Komplit Tumpeng Mini', kalori: '~720 kkal', nutrisiUtama: 'Karbohidrat, Protein Ganda, Aneka Sayur & Susu', tips: 'Gladi resik pesta gizi akbar menembus dingin pegunungan! Mantapkan tekadmu — Mang Abdul' },
  { level: 20, name: 'Rute Pamungkas: Demi Bu Guru Tercinta', finishMeters: 25000, distanceMeters: 25000, totalMeters: 25150, timeLimit: 1520, timeLimitSec: 1520, checkpoints: [5000, 10000, 15000, 20000], biomes: [BIOMES.PESISIR_PANTURA, BIOMES.JALUR_PANTURA, BIOMES.LEMBAH_SAWAH, BIOMES.DESA_SAWAH, BIOMES.LERENG_GUNUNG, BIOMES.PUNCAK_GUNUNG, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH], menuGizi: 'Kenduri Gizi Akbar Puspa Bangsa', kalori: '~750 kkal', nutrisiUtama: 'Gizi Seimbang Paripurna Kemenkes RI', tips: 'Rute pamungkas 25 km lintas bioma Pantura hingga Gunung! Demi Bu Guru tercinta dan anak bangsa! — Mas Tion' }
];

export const STORY_DIALOGUES = {
  1: {
    intro: [
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Tion, tugas perdana lu bawa armada MMG (My Mobil Gwehh) 500 porsi! Rutenya nembus pematang sawah becek dan saluran irigasi gembur. Gas itu keberanian, rem itu kebijaksanaan, bawa kargo aman itu kehormatan supir sejati!' },
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Gua udah cek shockbreaker sama suspensinya, Yon! Tanah lembah sawah ini suka bikin mobil goyang dombret kalau lu bejek gas mendadak. Santai aja bawanya!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'normal', text: 'Siap Mang Abdul, siap Bang Zacky! Nasi pulen karbohidrat kompleks 150 gram per porsi (~650 kkal AKG) aman terkunci di boks pemanas MMG. Demi gizi adik-adik SD Puspa Bangsa, pematang sawah siap kita libas!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Selamat pagi! Mas Tion ya kurir armada MMG yang baru? Masya Allah, harum sekali makanannya tiba masih mengepul hangat tepat waktu di halaman sekolah...' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: '(D-duh Gusti... senyumnya Bu Yulie manis banget, pipiku langsung panas merona, rpm jantung mendadak tembus redline 9000!) S-sama-sama Bu Yulie! Tugas perdana pantang bikin kecewa!' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Terima kasih banyak ya Mas Tion. Murid-murid dari tadi sudah heboh menanti di depan kelas. Semoga besok ketemu lagi ya Mas...' }
    ]
  },
  2: {
    intro: [
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Nah, sekarang rute lu mulai masuk pesisir pantai Pantura, Tion! Angin samping laut Jawa ini kencang, aspalnya kena cipratan air asin agak licin. Jangan melamun mikirin senyum Bu Guru kemarin!' },
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Ban udah gua setel komponnya biar cengkeramannya lengket di aspal asin Pantura Yon. Ayam lengkuas 22g protein hewani di bak jangan sampai salto!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'focus', text: 'Aman terkendali! Semangat antar kargo nutrisi MMG buat murid-murid... dan tentunya pengen lihat senyum manis Bu Yulie lagi hari ini!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Mas Tion kelihatan berkeringat sekali menembus angin pesisir Pantura? Ini saya buatkan teh melati hangat dari ruang guru, diminum dulu Mas biar gak dehidrasi.' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: 'E-eh Bu Yulie repot-repot... (Pas nerima cangkir teh, jari kita sempat bersentuhan sedetik... rasanya kayak kesetrum voltase aki 24 volt! Jiwa ragaku langsung meleleh!)' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'flirt', text: 'Ehem! Teh melati khusus dari Bu Yulie buat Mas Tion nih yeee~ Manisnya ngalahin gula tebu sekebon!' }
    ]
  },
  3: {
    intro: [
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'flirt', text: 'Hahaha Mas Tion! Dari kejauhan nada klakson telolet armada MMG udah ketebak banget! Buruan Mas, Bu Yulie dari tadi bolak-balik nengok jam nungguin Mas Tion lho~' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'focus', text: 'Husna! Jangan godain supir yang lagi fokus dong! Hari ini ada tempe orek manis & tahu bacem, protein nabati fermentasi kaya isoflavon dan serat probiotik pencegah stunting!' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'laugh', text: 'Hahaha! Digodain dikit aja stir truk lu udah oleng ke kanan, Tion! Tenang, jangan grogi sebelum sampai di gerbang sekolah!' }
    ],
    outro: [
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'flirt', text: 'Cieee Mas Tion! Pas serah terima ompreng matanya salting ke mana-mana sampai nabrak kusen pintu ruang guru! Mau aku comblangin resmi sama Bu Yulie gak nih?' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: 'Hush Husna! Ssst, ngomongnya kenceng amat, malu didenger bapak kepala sekolah tau! Aku cuma grogi bawa kargo MMG!' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Husna jangan godain Mas Tion terus ya. Tapi... terima kasih banyak ya Mas Tion, tempe oreknya harum sekali.' }
    ]
  },
  4: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Jalur arteri Pantura lagi ramai bus malam ngebut Yon! Tapi menu hari ini sayur lodeh labu siam dan melinjo kaya vitamin A-C. Kuahnya sensitif guncangan, suspensi udah gua kerasin dikit!' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Dengerin mekanik lu, Tion. Mendarat harus sejajar permukaan jalan, jangan sampai kuah santan lodeh berhamburan di aspal Pantura!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'focus', text: 'Siap para maestro! Rantang gizi bersekat ganda MMG terkunci rapat. Kuah lodeh aman, murid-murid kenyang, martabat kurir terjaga!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Alhamdulillah sayur lodehnya masih hangat sempurna dan kuahnya gak tumpah setetes pun! Mas Tion hebat sekali bisa bawa mobil MMG semulus ini.' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: 'B-berkat doa restu Bu Yulie... eh maksud saya berkat doa keselamatan di jalan raya Bu!' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Hehe, Mas Tion ini lucu ya kalau lagi tersipu. Semangat terus ya Mas...' }
    ]
  },
  5: {
    intro: [
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Tion! Hujan gerimis turun di lereng perbukitan terasering! Ingat ilmu Mang Abdul: licinnya tanah lumpur itu kayak ujian asmara, kalau lu panik lu ngepot terbalik, kalau tenang lu selamat sampai pelaminan!' },
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Torsi mesin Stage 1 lu udah mantap Yon! Bandeng presto tanpa duri kaya Omega-3 EPA/DHA 1200mg ini jangan sampai remuk pas nanjak licin!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'focus', text: 'Siap komandan! Walau terasering licin kayak es, tekad kurir MMG gak bakal goyah demi nutrisi anak bangsa!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Murid-murid lahap sekali makan bandeng prestosnya! Ya ampun bodi mobil Mas Tion penuh cipratan lumpur, baju Mas Tion juga basah kuyup...' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'flirt', text: 'Tuh kan Bu Guru! Keringat Mas Tion bau dedikasi pahlawan katering MMG yang rela berkorban demi senyum Bu Yulie! Hihihi!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: '(Husna beneran kompor gas, tapi Bu Yulie malah tertawa manis sambil ngasih sapu tangan... adem banget hati yang basah ini!)' }
    ]
  },
  6: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'thinking', text: 'Yon, ada rintangan balok kayu irigasi dan kubangan tanah di lembah sawah! Menu hari ini telur balado bumbu tomat, kaya kolin 147mg buat memori otak. Gunakan air-pitch control pas melompat!' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Telur balado itu rapuh kayak perasaan anak muda, Tion. Salah mendarat dikit, ambyar jadi orak-arik! Mainkan pedal gas dengan penuh kasih sayang!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'focus', text: 'Per dan damper bengkel Zacky udah teruji! 500 butir telur balado MMG bakal mendarat bulat utuh tanpa retak sehelai rambut pun!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Mas Tion, ini saya bawakan handuk kecil bersih beraroma lavender. Keringat di dahi diseka dulu Mas, nanti masuk angin kena angin lembah.' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: '(Aroma lavender di handuk Bu Yulie lembut sekali... wanginya bikin mabuk kepayang, rasanya mau pingsan di tempat!) T-terima kasih banyak Bu Yulie...' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'flirt', text: 'Cium aroma handuknya jangan dihayati banget gitu dong Mas Tion! Mukanya udah semerah bumbu balado tuh!' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'laugh', text: 'Husna, jangan nakal ya. Mas Tion sudah berjuang keras melewati kubangan irigasi lho.' }
    ]
  },
  7: {
    intro: [
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'hungry', text: 'Mas Tion! Tanjakan terjal puncak bukit di depan curam banget lho! Muatan pisang raja dan jeruk manis lokal jangan sampai menggelinding keluar dari boks MMG!' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Jaga RPM mesin jangan sampai tekor di tanjakan Ciremai, Tion. Oper gigi rendah, rasakan getaran mesin kayak detak jantung lu pas ketemu Bu Guru!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'normal', text: 'Tenang semuanya! Buah segar ini kaya kalium 350mg dan vitamin C 45mg sebagai antioksidan alami biar adik-adik gak gampang flu. Siap melesat!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Jeruknya manis dan segar sekali Mas Tion. Oh iya, ini saya belikan botol air minum khusus untuk Mas Tion simpan di kabin truk.' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: 'B-botol minum warna tosca buat saya Bu?! Seriusan Bu Yulie?!' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Iya Mas, supaya Mas Tion selalu ingat minum air putih saat berkendara jauh mengantar paket gizi MMG.' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'flirt', text: 'Wadawww! Hadiah botol minum tanda perhatian khusus nih! Mas Tion jangan lupa dipeluk botolnya pas tidur ya~' }
    ]
  },
  8: {
    intro: [
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'cheer', text: 'Pagi Mas Tion! Husna punya info A1 dari ruang guru nih! Kemarin Bu Yulie nanya ke guru BK, katanya tipe cowok idamannya yang gigih, bisa nyetir, dan sayang anak-anak!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: 'H-hah?! Jangan bikin gosip Husna! Nanti fokus nyetirku buyar di pesisir Pantura!' },
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Hahaha! Jangan sampai buyar Yon! Sayur bening bayam jagung ini kaya zat besi dan lutein buat mata. Bebatuan pesisir licin, ban kompon Stage 8 siap mencengkeram!' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Info intelijen dari Husna jangan disia-siakan, Tion! Sopir Pantura pantang mundur kalau lampu hijau udah nyala!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Sayur bayamnya masih renyah dan segar sekali Mas Tion. Anak-anak kelas 1 lahap sekali makannya.' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'flirt', text: 'Tadi aku liat Mas Tion pas nyetir gaya satu tangan lho Bu Yulie, keren banget kayak supir reli Paris-Dakar!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: 'B-bukan gaya Husna, tadi tangan kiriku pegangan erat biar ompreng gak bergeser kok!' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Hehe, apa pun alasannya, Mas Tion memang sosok yang sangat bertanggung jawab dan bisa diandalkan.' }
    ]
  },
  9: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Gua baru pasang shockbreaker heavy-duty di garasi Yon! Jalur Pantura bergelombang sampai perbukitan gak bakal bikin kargo opor telur tahu kuning lu berantakan!' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Shockbreaker baru itu ibarat kedewasaan, Tion. Harus lentur meredam benturan hidup, tapi tetap kokoh menopang beban masa depan!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'focus', text: 'Mantap Bang Zacky dan petuah Mang Abdul! Kurkumin alami pada kunyit opor ini penambah nafsu makan terbaik. Gas pol uji ayunan shockbreaker!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Mas Tion hebat sekali! Waktu mendarat dari bukit kecil tadi mulus sekali, bodi mobil MMG hampir tidak berguncang!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: 'B-berkat shockbreaker racikan Bang Zacky Bu... tapi yang bikin tenang di hati ya bayangan senyum Bu Yulie di garis finis!' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'laugh', text: 'Ahaay! Murid gua mulai berani melontarkan rayuan gombal sopir Pantura! Maju terus pantang mundur, Tion!' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: '(Tersenyum malu sambil memalingkan muka) Mas Tion bisa saja... ayo istirahat dulu di pendopo.' }
    ]
  },
  10: {
    intro: [
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Level 10, Tion! Separuh perjalanan ekspedisi MMG! Kali ini bawaannya 500 botol kaca susu murni Kuningan! Kalsium dan vitamin D buat tulang anak-anak. Nol toleransi benturan keras!' },
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Tiap botol ada di rak busa peredam Yon. Tapi lu tetap harus hati-hati di sambungan jalan desa dan pesisir!' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'cheer', text: 'Mas Tion jangan tegang! Bu Yulie udah nungguin di depan ruang guru bawa biskuit buat dicelup ke susu lho!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'focus', text: 'Siap komandan! Rute pedesaan dan pesisir bakal kita lewati semulus sutra. 500 botol susu MMG aman terkendali!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Luar biasa Mas Tion! Semua 500 botol susu murni sampai tanpa ada yang retak atau tumpah sedikit pun. Ini ada bekal sarapan kecil nasi uduk buatan saya sendiri, dimakan ya Mas.' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: '(M-masakan buatan tangan Bu Yulie sendiri khusus buat aku?! Ya ampun... ini hari paling bersejarah dalam hidup kurir MMG!) T-terima kasih banyak Bu Yulie...' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Sopir sejati kalau udah dikasih bekal buatan tangan begini, tenaganya langsung setara truk gandeng 10 roda! Selamat Tion!' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'flirt', text: 'Tuh kan Mas Tion, makanannya dihabiskan ya, jangan disimpen di bawah bantal buat kenang-kenangan!' }
    ]
  },
  11: {
    intro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'concern', text: 'Mas Tion, kabut pagi di lereng bukit pinus sangat tebal dan hawa dingin sekali. Jangan memaksakan kecepatan ya Mas, keselamatan Mas Tion nomor satu bagi kami...' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Dengar tuh petuah Bu Guru, Tion! Kabut tebal lereng pegunungan itu menuntut insting kemudi dan lampu kabut kuning. Jangan ngebut membabi buta!' },
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Lampu kabut halogen ekstra udah terpasang di bemper depan Yon. Pecel sayur saus kacang kaya folat dan serat ini harus sampai segar!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'normal', text: 'Didengar Bu Yulie sekhawatir itu... dinginnya kabut lereng langsung kalah sama hangatnya hati ini! Armada MMG siap menembus kabut!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Alhamdulillah... saat melihat sorot lampu kabut kuning mobil Mas Tion menembus kabut tebal tadi, hati saya rasanya langsung lega dan tenang sekali...' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: 'Sorot lampu ini selalu terarah ke gerbang sekolah tempat Bu Yulie berdiri menyambut saya...' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Terima kasih ya Mas Tion selalu menepati janji. Jangan lupa minum wedang jahe yang tadi saya titipkan.' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'flirt', text: 'Duh romantisnya di tengah kabut pegunungan... udah kayak syuting video klip lagu pop Sunda!' }
    ]
  },
  12: {
    intro: [
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'cheer', text: 'Mas Tion! Di perbatasan pesisir bukit ada gundukan tanah tinggi! Murid-murid nonton dari jendela kelas lho, tunjukin salto akrobatik mobil MMG yang keren!' },
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'thinking', text: 'Ikan kembung bakar kunyit ini kaya kalsium dan asam lemak sehat buat kecerdasan anak-anak Yon. Jangan keasyikan salto sampai boks kargo terbalik!' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Salto boleh buat memikat hati Bu Guru, tapi pendaratan harus roda empat sejajar tanah! Itu hukum fisika dan hukum asmara!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'focus', text: 'Siap! Bakat akrobatik udara kurir MMG bakal kita kerahkan demi nutrisi anak-anak dan bikin Bu Yulie kagum!' }
    ],
    outro: [
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'cheer', text: 'WAAAH KEREN BANGET! Mobil MMG Mas Tion tadi beneran melayang di udara terus mendarat mulus tanpa ada kuah kecap tumpah! Semua anak-anak tepuk tangan!' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Jantung saya sempat mau copot melihat Mas Tion melompat tadi... tapi Mas Tion hebat sekali mengendalikan mobilnya dengan selamat.' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: 'M-maaf kalau bikin Bu Yulie cemas... saya cuma ingin memastikan kargo gizi tiba tepat waktu demi anak-anak dan Bu Guru.' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Mas Tion selalu berhasil membuat saya kagum... tapi tolong tetap utamakan keselamatan ya Mas.' }
    ]
  },
  13: {
    intro: [
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'flirt', text: 'Mas Tion! Pepes ikan mas kemanginya harum banget! Husna selipin amplop surat pantun titipan Mas Tion di rantang makan siang Bu Yulie ya?' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: 'Ehhh Husna jangan sembarangan! Amplop pantun yang mana?! Kemarin itu cuma coret-coretan di buku nota belanja bengkel!' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'laugh', text: 'Hahaha! Jangan ditahan Tion, biarkan burung merpati asmara terbang ke sangkarnya! Husna, pastikan amplopnya gak kena minyak pepes!' },
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Torsi mobil udah stage 13 Yon, buruan kejar sebelum Husna buka amplopnya di depan bapak kepala sekolah!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Mas Tion... amplop kecil warna merah muda di samping rantang ini... "Jalan berliku di lereng Ciremai, melihat senyum Bu Guru hati pun damai"... Mas Tion yang tulis ya?' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: '(Gawat Husna beneran nekat! Mukaku merah padam kayak kepiting saus tiram!) E-eh... iya Bu... mohon maaf kalau lancang dan bikin Bu Yulie risih...' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Sama sekali tidak risih kok Mas. Pantunnya indah dan tulus sekali... saya simpan di dalam binder buku harian saya ya Mas.' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: '(D-disimpan di buku harian?! Ya ampun... rasanya mau pingsan saking bahagianya!)' }
    ]
  },
  14: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Rute panjang 17.800 meter Yon! Sambal goreng hati sapi dan kentang dadu ini gudangnya zat besi heme anti-anemia. Jaga kestabilan rem di tikungan hairpin tebing pedesaan!' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Tion, kalau kemarin surat pantun lu udah disimpan di binder Bu Yulie, tandanya gerbang asmara udah terbuka lebar! Jangan gugup pas tatap muka di ruang guru!' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'cheer', text: 'Hari ini Bu Yulie pakai kerudung warna tosca yang senada sama warna bodi mobil MMG Mas Tion lho! Cieee serasi banget!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'focus', text: 'Aduh Husna makin bikin deg-degan aja! Suspensi dan rem anti-lock siap meliuk di kelokan tebing! Gas pol!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Anak-anak perempuan memuji sambal goreng hatinya sangat empuk dan sedap. Mas Tion memang kurir paling tulus dan berdedikasi.' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: 'Apalagi kalau kurirnya dapat senyuman manis dari Bu Guru setiap hari, tenaganya berlipat ganda berkali-kali lipat Bu!' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'blush', text: 'Mas Tion... ini ada surat balasan kecil dari saya di dalam amplop biru... nanti dibaca di garasi ya Mas, jangan sekarang...' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'flirt', text: 'CIIIEEE ADA SURAT BALASAN! Mas Tion jangan pingsan dulu di ruang guru, masih ada level berikutnya!' }
    ]
  },
  15: {
    intro: [
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Angin lembah bertiup kencang di tanjakan cadas batu curam Ciremai, Tion! Sopir handal gak boleh panik. Miring sedikit kuah kaldu tumpah! Rilekskan tangan di kemudi!' },
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Mesin udah di-tune up ke Stage 15 Yon! Tenaga 3320 watt siap mendaki tanjakan 35 derajat tanpa ngos-ngosan!' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'hungry', text: 'Aroma kaldu ayam makaroni kaya kolagen 1500mg ini sampai kecium ke pos ronda! Mas Tion semangat demi Bu Yulie!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'focus', text: 'Siap Mang Abdul dan Bang Zacky! Surat balasan Bu Yulie kemarin udah gua kantongin di saku dada kiri, jadi pelindung hati terhebat!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Di udara dingin pegunungan begini, kuah kaldu hangat Mas Tion menghangatkan seluruh anak-anak sekolah. Mas Tion hebat sekali bisa menaklukkan batu curam.' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: 'Dan kehangatan surat dari Bu Yulie kemarin menghangatkan jiwa saya sepanjang tanjakan terjal tadi Bu...' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Saya senang Mas Tion menyukainya. Ini saya rajutkan syal abu-abu kecil... untuk dipakai Mas Tion kalau udara pegunungan sedang menggigit dingin.' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: '(Syal rajutan tangan Bu Yulie sendiri melingkar di leherku... Ya Allah, ini mimpi atau nyata?! Hangatnya meresap sampai ke tulang!)' }
    ]
  },
  16: {
    intro: [
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'cheer', text: 'Mas Tion, kabar super penting! Hari ini Bu Yulie ulang tahun! Puding melon dan chia seed segar ini udah pas banget buat hidangan penutup perayaan kecil di sekolah!' },
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Gua udah bersihin injektor dan filter bensin Yon. Top speed dan handling dijamin maksimal buat ngejar waktu sebelum bel sekolah bunyi!' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Membawa kado kebahagiaan untuk orang tercinta adalah kehormatan tertinggi seorang pengemudi! Jangan telat sedetik pun, Tion!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'normal', text: 'Bismillah! Walau badai pesisir dan tanjakan menghadang, hari bahagia Bu Yulie wajib kita hiasi dengan pengantaran MMG tersempurna!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Mas Tion sampai basah kuyup kena hujan rintik-rintik demi mengantar puding ini tepat waktu? Ya ampun Mas...' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: 'Selamat ulang tahun ya Bu Yulie... Semoga panjang umur, sehat selalu, dan selalu dikelilingi kebahagiaan...' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Masya Allah... terima kasih banyak Mas Tion. Mari payungan berdua masuk ke selasar ruang guru, saya ambilkan handuk kering ya...' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: '(Berjalan berdua di bawah satu payung teduh langkah demi langkah... detak jantung kami seolah berirama sama... dunia rasanya cuma milik berdua!)' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'flirt', text: 'Ehem ehem! Hujan rintik, payung satu berdua... fix ini mah bukan sekadar kurir dan guru, tapi calon pengantin!' }
    ]
  },
  17: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Jalur bypass arteri Pantura lurus panjang Yon! Waktunya buktikan top speed mesin bertenaga tinggi! Opor ayam rempah kunyit ini kaya kurkumin antiinflamasi pemelihara imunitas.' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Perjalanan tinggal 3 level lagi, Tion! Nama armada MMG lu udah harum di seluruh pelosok Cirebon sampai Kuningan!' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'cheer', text: 'Iya Mas! Ibu-ibu kantin sama murid-murid udah sepakat, Mas Tion itu pahlawan tanpa tanda jasa paling ganteng se-kabupaten!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'focus', text: 'Terima kasih atas semua dukungan sahabat-sahabat hebatku! Bodi aerodinamis siap meluncur kencang dan stabil!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Opor ayamnya lezat sekali Mas Tion. Oh iya Mas... besok lusa adalah hari terakhir semester dan puncak acara kenduri gizi akbar...' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'cheer', text: 'Mas Tion, denger tuh! Besok lusa jangan sampai jadi cowok pengecut ya! Ungkapin perasaan Mas Tion ke Bu Yulie di depan panggung!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: 'Husnaaa! Jangan teriak kenceng-kenceng dong! Tapi... Bu Yulie... saya punya sesuatu yang ingin saya sampaikan saat kenduri nanti...' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'blush', text: 'Saya... saya akan menunggu kehadiran Mas Tion dengan penuh harap...' }
    ]
  },
  18: {
    intro: [
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Semburat senja keemasan memayungi lembah sawah dan pesisir, Tion. Jaga ritme kemudi! Besok adalah gladi resik tumpeng akbar, nyali lu diuji hari ini!' },
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Sayur asem Sunda jagung manis kaya magnesium dan asam organik pemulih stamina Yon. Traksi ban kompon lunak siap hadapi tanjakan curam!' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'flirt', text: 'Tadi Bu Yulie nitip pesan ke aku Mas, katanya hati-hati di tanjakan penentu nyali, jangan sampai bikin Bu Guru jantungan!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'focus', text: 'Pesan dari Bu Yulie adalah bahan bakar terkuat di bumi! Tanjakan penentu nyali bakal kita taklukkan dengan gagah!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Mas Tion... terima kasih sudah tiba dengan selamat di tengah semburat senja yang indah ini.' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: 'Pemandangan senja di sekolah Puspa Bangsa ini indah sekali Bu... tapi masih kalah indah dibanding senyuman Bu Yulie.' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'blush', text: '(Pipi Bu Yulie merona merah di bawah sinar matahari senja) Mas Tion... besok setelah pesta kenduri 500 porsi MMG selesai... ada hal penting yang ingin saya bicarakan berdua di taman sekolah...' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: '(Deg-degan hebat! Apakah impian terbesar hidupku bakal terwujud besok?! Ya Allah, berkahilah langkah perjuangan cintaku!)' }
    ]
  },
  19: {
    intro: [
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Hari ini gladi resik akbar rute 24.000 meter! 500 tumpeng mini gizi seimbang harus tiba sempurna! Ingat wejangan Mang Abdul: sopir sejati gak cuma piawai tancap gas, tapi juga punya keberanian memperjuangkan cintanya!' },
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Gua udah pasang strut brace suspensi dan mur roda titanium Yon. Mobil MMG lu sekarang setara mobil kompetisi reli dunia!' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'cheer', text: 'Panggung perayaan udah berdiri megah di lapangan sekolah Mas! Bunga-bunga mawar udah disiapin buat Mas Tion nembak Bu Yulie besok!' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'focus', text: 'Siap Mang Abdul, Bang Zacky, dan Husna! Demi gizi 500 siswa dan demi masa depan cintaku bersama Bu Yulie, gas pol pantang kendor!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Gladi resik hari ini sukses besar! Semua tumpeng mini tersusun indah dan rasanya sangat lezat. Mas Tion... terima kasih atas seluruh keringat dan perjuangan Mas Tion selama ini...' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: 'Semua ini berkat Bu Yulie yang selalu jadi lentera penyemangat di setiap kilometer perjalanan saya...' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Besok adalah hari penentuan rute 25 km... Saya sudah siapkan sesuatu yang sangat istimewa untuk menyambut Mas Tion di garis akhir nanti...' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: 'Saya berjanji akan tiba dengan selamat membawa armada MMG terbaik dan membawa seluruh cinta di hati saya, Bu Yulie!' }
    ]
  },
  20: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Ini dia GRAND FINALE Yon! Rute pamungkas 25.000 meter melintasi seluruh 8 bioma dari Pesisir Pantura, Lembah Sawah, sampai Puncak Ciremai! Mesin 3720 watt bertenaga monster siap meledak!' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Buktikan jiwa kesatria kurir MMG Pantura sejati! Gas itu keberanian, rem itu kebijaksanaan, cinta Bu Yulie itu tujuan akhir hidupmu! Berangkatkan kargo cintamu, Tion!' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'cheer', text: 'Seluruh murid SD, SMP, SMA Puspa Bangsa dan para guru udah berkumpul di garis finis bawa spanduk selamat datang Mas Tion sang pahlawan gizi!' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Mas Tion... berhati-hatilah di jalan raya. Saya berdiri di gerbang sekolah menanti kepulangan Mas Tion dengan segenap doa di hati saya...' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'focus', text: 'BISMILLAHIRRAHMANIRRAHIM! GAS POLLL DEMI GIZI 500 SISWA, DEMI KEHORMATAN ARMADA MMG, DAN DEMI CINTA SEJATI BU GURU TERCINTA!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Mas Tion... selama 20 perjalanan penuh rintangan ini, saya menyaksikan langsung ketulusan, tanggung jawab, dan kebaikan hati Mas Tion yang begitu luar biasa. Hari ini di depan seluruh sekolah, saya menerima perasaan cinta Mas Tion...' },
      { speaker: 'Tion', role: 'Kurir MMG', mood: 'blush', text: '(Air mata haru tumpah ruah, rpm jantung berdegup bahagia menembus angkasa!) Bu Yulie... terima kasih telah mempercayai hati saya... Saya berjanji akan menjaga Bu Yulie dan mendampingi Bu Guru selamanya!' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'cheer', text: 'HOREEEE! AKHIRNYA MAS TION GAK JOMBLO LAGI! RESMI JADIAN SAMA BU GURU TERCINTA! MAKAN GIZI MMG GRATIS SETIAP HARI!' },
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Selamat Yon! Lu resmi dinobatkan jadi Pahlawan Logistik Gizi dan Raja Cinta Sejati Pantura!' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Air mata bahagia Mang Abdul tumpah ruah di aspal... Ini adalah kemenangan terindah seorang supir sejati! Gaspol terus sampai ke pelaminan, Tion!' }
    ]
  }
};


export function buildLevelSegments(levelConfig) {
  const biomes = levelConfig.biomes;
  const count = biomes.length;
  const total = levelConfig.totalMeters;
  const schoolLen = Math.max(300, Math.min(800, Math.floor(total * 0.08)));
  const remaining = total - schoolLen;
  const otherCount = count - 1;
  const chunk = otherCount > 0 ? remaining / otherCount : remaining;

  const segments = [];
  let currentStart = 0;
  for (let i = 0; i < otherCount; i++) {
    const nextEnd = Math.round(currentStart + chunk);
    segments.push({
      id: biomes[i].id,
      name: biomes[i].name,
      start: currentStart,
      end: nextEnd
    });
    currentStart = nextEnd;
  }
  segments.push({
    id: BIOMES.SEKOLAH.id,
    name: BIOMES.SEKOLAH.name,
    start: currentStart,
    end: total
  });
  return segments;
}

export class TerrainSystem {
  constructor(totalMeters = 4600, levelConfig = null) {
    if (typeof totalMeters === 'object' && totalMeters !== null) {
      levelConfig = totalMeters;
      totalMeters = levelConfig.totalMeters || levelConfig.finishMeters || 4600;
    }
    if (levelConfig) {
      this.levelConfig = levelConfig;
      this.totalMeters = levelConfig.totalMeters || totalMeters;
      this.finishLineMeters = levelConfig.finishMeters || (this.totalMeters - 100);
      this.segments = buildLevelSegments(levelConfig);
    } else {
      this.levelConfig = null;
      this.totalMeters = totalMeters;
      this.finishLineMeters = 4500;
      this.segments = null;
    }
    this.totalPx = this.totalMeters * PHYSICS_CONSTANTS.METER_SCALE;
    this.finishLinePx = this.finishLineMeters * PHYSICS_CONSTANTS.METER_SCALE;

    // Hazards and collectibles caches
    this.puddles = []; // Pantura seawater rob puddles [startM, endM]
    this.mudPits = []; // Sawah mud trenches [startM, endM]
    this.logs = [];    // Mountain wooden logs [meterX, radius]
    this.speedBumps = []; // Suburb speed bumps [meterX]
    this.launchRamps = [];
    this.fuelCans = []; // [meterX, collected]
    this.foodParcels = []; // [meterX, collected]
    this.coins = [];    // [meterX, collected]
    this.checkpoints = []; // [meterX, name, collected]

    if (this.levelConfig) {
      this.initCustomLevelHazardsAndItems(this.levelConfig);
    } else {
      this.initHazardsAndItems();
    }
  }

  initCustomLevelHazardsAndItems(cfg) {
    this.puddles = [];
    this.mudPits = [];
    this.logs = [];
    this.speedBumps = [];
    this.launchRamps = [];
    this.fuelCans = [];
    this.foodParcels = [];
    this.coins = [];
    this.checkpoints = [];

    const fin = cfg.finishMeters;
    const lvl = cfg.level || 1;

    // 1. Water Puddles (Rob Pantura & Rain Dips) - slip traction = 0.85
    // Distributed dynamically across the entire route to test wet braking & traction
    for (let p = 160; p < fin - 120; p += 340 + ((p * 13) % 110)) {
      this.puddles.push({ start: p - 32, end: p + 32 });
    }

    // 2. Mud Pits (Sawah Mud & Dirt Paths) - chassis drag & reduced grip
    // Distributed in depressions across the route
    for (let m = 260; m < fin - 140; m += 390 + ((m * 17) % 130)) {
      this.mudPits.push({ start: m - 36, end: m + 36 });
    }

    // 3. Wooden Log Clusters (1 to 8 logs in series / washboard corduroy road)
    // Level 1-4: 1-3 logs, Level 5-10: 2-5 logs, Level 11-20: 3-8 logs
    const maxCluster = lvl <= 4 ? 3 : lvl <= 10 ? 5 : 8;
    for (let l = 210; l < fin - 160; l += 380 + ((l * 23) % 120)) {
      const clusterSize = 1 + (Math.floor(l * 1.7) % maxCluster);
      for (let j = 0; j < clusterSize; j++) {
        const logX = l + j * 1.35;
        if (logX < fin - 80) {
          this.logs.push({
            x: Number(logX.toFixed(2)),
            radius: 13 + ((j % 2) * 2),
            clusterIndex: j,
            clusterTotal: clusterSize
          });
        }
      }
    }

    // 4. Speed bumps in the school district approach
    this.speedBumps = [Math.max(100, fin - 240), Math.max(120, fin - 140), Math.max(140, fin - 60)];

    // 5. Launch kickers spaced every ~380m (deconflicted: >=40m clearance from mud and logs)
    for (let m = 280; m < fin - 150; m += 380) {
      const inMud = this.mudPits.some(mud => (m >= mud.start - 40 && m <= mud.end + 40));
      const inLogs = this.logs.some(l => Math.abs(m - l.x) < 40);
      if (!inMud && !inLogs) {
        this.launchRamps.push({ start: m, rise: 16, drop: 12, height: 42 });
      }
    }

    // 6. Food Parcels / Ompreng Refill (+20% Cargo Integrity)
    // Distributed every ~320-400m along the track to refill damaged cargo
    for (let m = 300; m < fin - 100; m += 340 + ((m * 19) % 90)) {
      this.foodParcels.push({ x: Math.round(m), collected: false });
    }

    // 7. Fuel canisters every ~380m
    for (let m = 220; m < fin - 100; m += 380) {
      this.fuelCans.push({ x: m, collected: false, dynamic: false });
    }

    // 8. Coins scattered along hills
    for (let m = 40; m < fin; m += 40) {
      if (Math.sin(m * 0.05) > -0.2) {
        this.coins.push({ x: m, collected: false });
      }
    }

    // 9. Transit Delivery Checkpoints
    if (cfg.checkpoints && Array.isArray(cfg.checkpoints)) {
      for (let i = 0; i < cfg.checkpoints.length; i++) {
        this.checkpoints.push({
          x: cfg.checkpoints[i],
          name: `Pos Transit ${i + 1}`,
          collected: false
        });
      }
    }
  }

  initHazardsAndItems() {
    // Biome 1: Pantura Water puddles (Rob)
    this.puddles = [
      { start: 250, end: 320 },
      { start: 600, end: 680 },
      { start: 950, end: 1040 }
    ];

    // Biome 2: Sawah Mud pits
    this.mudPits = [
      { start: 1400, end: 1480 },
      { start: 1850, end: 1940 },
      { start: 2350, end: 2430 }
    ];

    // Biome 3: Mountain Wooden Logs
    this.logs = [
      { x: 2950, radius: 12 },
      { x: 3350, radius: 14 },
      { x: 3700, radius: 14 },
      { x: 4050, radius: 15 }
    ];

    // Biome 4: Suburb Speed Bumps
    this.speedBumps = [4260, 4360, 4440];

    // Asymmetric launch kickers: a gentle climb followed by a short, steeper
    // downslope. They are part of getHeight(), so rendering and wheel collision
    // sample the same surface instead of using decorative jump sprites.
    this.launchRamps = [
      { start: 380, rise: 12, drop: 6, height: 65 },
      { start: 760, rise: 12, drop: 6, height: 65 },
      { start: 1500, rise: 12, drop: 6, height: 65 },
      { start: 2150, rise: 12, drop: 6, height: 65 },
      { start: 2500, rise: 12, drop: 6, height: 65 },
      { start: 3100, rise: 12, drop: 6, height: 65 },
      { start: 3550, rise: 12, drop: 6, height: 65 },
      { start: 3950, rise: 12, drop: 6, height: 65 }
    ];

    // Static Food Parcels (Ompreng Kargo Refill +20%)
    const parcelSpots = [350, 750, 1200, 1650, 2100, 2600, 3050, 3500, 3900, 4250];
    this.foodParcels = parcelSpots.map(x => ({ x, collected: false }));

    // Static Fuel Canisters spaced along track (~every 450-600m)
    const fuelSpots = [180, 500, 850, 1300, 1750, 2200, 2700, 3150, 3600, 4000, 4300];
    this.fuelCans = fuelSpots.map(x => ({ x, collected: false, dynamic: false }));

    // Gizi Coins scattered in arcs and hills
    this.coins = [];
    for (let m = 50; m < 4500; m += 40) {
      if (Math.sin(m * 0.05) > -0.2) {
        this.coins.push({ x: m, collected: false });
      }
    }
  }

  getBiomeById(id) {
    switch (id) {
      case 1: return BIOMES.PESISIR_PANTURA;
      case 2: return BIOMES.JALUR_PANTURA;
      case 3: return BIOMES.LEMBAH_SAWAH;
      case 4: return BIOMES.DESA_SAWAH;
      case 5: return BIOMES.PUNCAK_GUNUNG;
      case 6: return BIOMES.LERENG_GUNUNG;
      case 7: return BIOMES.PEMUKIMAN;
      case 8: return BIOMES.SEKOLAH;
      default: return BIOMES.SEKOLAH;
    }
  }

  getBiomeAt(meterX) {
    if (this.levelConfig && this.segments) {
      for (let i = 0; i < this.segments.length; i++) {
        if (meterX < this.segments[i].end) {
          return this.getBiomeById(this.segments[i].id);
        }
      }
      return BIOMES.SEKOLAH;
    }
    if (meterX < BIOMES.PANTURA.end) return BIOMES.PANTURA;
    if (meterX < BIOMES.SAWAH.end) return BIOMES.SAWAH;
    if (meterX < BIOMES.GUNUNG.end) return BIOMES.GUNUNG;
    return BIOMES.SEKOLAH;
  }

  // Returns smooth 200m transition zone blend state (1100m-1300m, 2700m-2900m, 4100m-4300m)
  getBiomeBlend(meterX) {
    if (this.levelConfig && this.segments) {
      for (let i = 0; i < this.segments.length - 1; i++) {
        const boundary = this.segments[i].end;
        const bStart = boundary - 80;
        const bEnd = boundary + 80;
        if (meterX >= bStart && meterX <= bEnd) {
          const rawT = (meterX - bStart) / (bEnd - bStart);
          const t = this.smoothstep(0, 1, rawT);
          const fromB = this.getBiomeById(this.segments[i].id);
          const toB = this.getBiomeById(this.segments[i + 1].id);
          return {
            inTransition: true,
            fromBiome: fromB,
            toBiome: toB,
            t: t,
            alphaPrev: 1 - t,
            alphaNext: t
          };
        }
      }
      const cur = this.getBiomeAt(meterX);
      return {
        inTransition: false,
        fromBiome: cur,
        toBiome: null,
        t: 0,
        alphaPrev: 1,
        alphaNext: 0
      };
    }

    const transitions = [
      { start: 1100, end: 1300, from: BIOMES.PANTURA, to: BIOMES.SAWAH },
      { start: 2700, end: 2900, from: BIOMES.SAWAH, to: BIOMES.GUNUNG },
      { start: 4100, end: 4300, from: BIOMES.GUNUNG, to: BIOMES.SEKOLAH }
    ];

    for (const tr of transitions) {
      if (meterX >= tr.start && meterX <= tr.end) {
        const rawT = (meterX - tr.start) / (tr.end - tr.start);
        const t = this.smoothstep(0, 1, rawT);
        return {
          inTransition: true,
          fromBiome: tr.from,
          toBiome: tr.to,
          t: t,
          alphaPrev: 1 - t,
          alphaNext: t
        };
      }
    }

    const current = this.getBiomeAt(meterX);
    return {
      inTransition: false,
      fromBiome: current,
      toBiome: null,
      t: 0,
      alphaPrev: 1,
      alphaNext: 0
    };
  }

  smoothstep(min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  }

  getRawBiomeHeight(m, biomeId, segStart = null) {
    const baseElevation = 520;
    if (segStart === null) {
      if (biomeId === 1) {
        // Biome 1: Pantura - Smooth start runway (0-160m) then coastal highway & launch ramps
        if (m < 160) return baseElevation;
        const smoothStart = Math.min(1.0, (m - 160) / 40);
        const h1 = Math.sin((m - 160) * 0.08) * 40;
        const h2 = Math.sin((m - 160) * 0.03) * 50;
        const ramp = Math.sin((m - 160) * 0.12) * 25;
        return baseElevation + (h1 + h2 + ramp) * smoothStart;
      }
      if (biomeId === 2 || biomeId === 3) {
        // Biome 2/3: Sawah - Stepped terraced rice paddies with table jumps and rolling mounds
        const localM = m - 1200;
        const terrace = Math.sin(localM * 0.07) * 55;
        const rolls = Math.sin(localM * 0.14) * 26;
        const baseWave = Math.sin(localM * 0.025) * 45;
        return baseElevation - 30 + terrace + rolls + baseWave;
      }
      if (biomeId === 5 || biomeId === 6) {
        // Biome 5/6: Gunung - Mountain slopes & tea plantations with steep launch kickers
        const localM = m - 2800;
        const bigClimb = -Math.min(160, localM * 0.11);
        const kicker = Math.sin(localM * 0.08) * 80;
        const mountainWave = Math.sin(localM * 0.025) * 60;
        return baseElevation - 50 + bigClimb + kicker + mountainWave;
      }
      // Biome 8: Suburb Cirebon & Sekolah Puspa Bangsa
      const localM = m - 4200;
      return baseElevation - 90 + Math.sin(localM * 0.04) * 20;
    }

    // Dynamic segments for custom 20-level mode (8 distinct biomes)
    const localM = Math.max(0, m - segStart);
    const levelNum = (this.levelConfig && typeof this.levelConfig.level === 'number') ? this.levelConfig.level : 1;
    const slopeScale = 1 + (levelNum - 1) * 0.028;
    switch (biomeId) {
      case 1: {
        // Biome 1: Pesisir Pantura (Pantai & Laut Lepas)
        const h1 = Math.sin(localM * 0.08) * (35 * slopeScale);
        const h2 = Math.sin(localM * 0.03) * (45 * slopeScale);
        return baseElevation + (h1 + h2);
      }
      case 2: {
        // Biome 2: Jalur Arteri Pantura
        const ramp = Math.sin(localM * 0.09) * (45 * slopeScale);
        const waves = Math.sin(localM * 0.15) * (20 * slopeScale);
        return baseElevation - 15 + ramp + waves;
      }
      case 3: {
        // Biome 3: Lembah Hamparan Sawah
        const rolling = Math.sin(localM * 0.06) * (50 * slopeScale);
        const baseWave = Math.sin(localM * 0.02) * (35 * slopeScale);
        return baseElevation - 30 + rolling + baseWave;
      }
      case 4: {
        // Biome 4: Pedesaan Sawah Terasering
        const terrace = Math.sin(localM * 0.07) * (55 * slopeScale);
        const rolls = Math.sin(localM * 0.14) * (26 * slopeScale);
        return baseElevation - 45 + terrace + rolls;
      }
      case 5: {
        // Biome 5: Puncak Siluet Gn. Ciremai
        const climb = -Math.min(140, localM * 0.09 * slopeScale);
        const wave = Math.sin(localM * 0.06) * (65 * slopeScale);
        return baseElevation - 60 + climb + wave;
      }
      case 6: {
        // Biome 6: Lereng Hutan Pinus Terjal
        const bigClimb = -Math.min(160, localM * 0.10 * slopeScale);
        const kicker = Math.sin(localM * 0.08) * (80 * slopeScale);
        return baseElevation - 75 + bigClimb + kicker;
      }
      case 7: {
        // Biome 7: Kawasan Pemukiman Suburb
        return baseElevation - 85 + Math.sin(localM * 0.05) * (30 * slopeScale);
      }
      case 8:
      default: {
        // Biome 8: Kompleks Sekolah Puspa Bangsa
        return baseElevation - 90 + Math.sin(localM * 0.04) * (20 * slopeScale);
      }
    }
  }

  // Returns procedural ground elevation Y (in canvas px) for a given world X (in px)
  getHeight(pxX) {
    const m = pxX / PHYSICS_CONSTANTS.METER_SCALE;
    const baseElevation = 520; // Canvas baseline

    if (this.levelConfig && this.segments) {
      let y = baseElevation;
      const blendDist = 60;
      let matched = false;

      for (let i = 0; i < this.segments.length - 1; i++) {
        const b = this.segments[i].end;
        if (m >= b - blendDist && m <= b + blendDist) {
          const t = this.smoothstep(b - blendDist, b + blendDist, m);
          y = (1 - t) * this.getRawBiomeHeight(m, this.segments[i].id, this.segments[i].start) + t * this.getRawBiomeHeight(m, this.segments[i + 1].id, this.segments[i + 1].start);
          matched = true;
          break;
        }
      }
      if (!matched) {
        if (m >= this.finishLineMeters - 20 && m <= this.finishLineMeters + 20) {
          const t = this.smoothstep(this.finishLineMeters - 20, this.finishLineMeters + 20, m);
          const lastSeg = this.segments[this.segments.length - 1];
          y = (1 - t) * this.getRawBiomeHeight(m, BIOMES.SEKOLAH.id, lastSeg ? lastSeg.start : null) + t * (baseElevation - 100);
        } else if (m > this.finishLineMeters + 20) {
          y = baseElevation - 100;
        } else {
          let seg = this.segments.find(s => m >= s.start && m < s.end) || this.segments[this.segments.length - 1];
          y = this.getRawBiomeHeight(m, seg.id, seg.start);
        }
      }

      // Flat launch runway at start (0-140m) ensuring grounded vehicle placement
      if (m < 100) {
        y = baseElevation;
      } else if (m < 140) {
        const st = (m - 100) / 40;
        y = baseElevation * (1 - st) + y * st;
      }

      for (const ramp of this.launchRamps) {
        const crest = ramp.start + ramp.rise;
        const end = crest + ramp.drop;
        if (m >= ramp.start && m < crest) {
          y -= ramp.height * this.smoothstep(ramp.start, crest, m);
        } else if (m >= crest && m < end) {
          y -= ramp.height * (1 - this.smoothstep(crest, end, m));
        }
      }

      for (const sb of this.speedBumps) {
        const dist = Math.abs(m - sb);
        if (dist < 1.2) {
          y -= Math.cos((dist / 1.2) * Math.PI * 0.5) * 10;
        }
      }

      return Math.max(150, Math.min(650, y));
    }

    const blendDist = 100; // 200m continuous transition zones (1100-1300m, 2700-2900m, 4100-4300m)

    let y;
    if (m < 1200 - blendDist) {
      y = this.getRawBiomeHeight(m, 1);
    } else if (m < 1200 + blendDist) {
      const t = this.smoothstep(1200 - blendDist, 1200 + blendDist, m);
      y = (1 - t) * this.getRawBiomeHeight(m, 1) + t * this.getRawBiomeHeight(m, 2);
    } else if (m < 2800 - blendDist) {
      y = this.getRawBiomeHeight(m, 2);
    } else if (m < 2800 + blendDist) {
      const t = this.smoothstep(2800 - blendDist, 2800 + blendDist, m);
      y = (1 - t) * this.getRawBiomeHeight(m, 2) + t * this.getRawBiomeHeight(m, 3);
    } else if (m < 4200 - blendDist) {
      y = this.getRawBiomeHeight(m, 3);
    } else if (m < 4200 + blendDist) {
      const t = this.smoothstep(4200 - blendDist, 4200 + blendDist, m);
      y = (1 - t) * this.getRawBiomeHeight(m, 3) + t * this.getRawBiomeHeight(m, 4);
    } else if (m < 4480) {
      y = this.getRawBiomeHeight(m, 4);
    } else if (m < 4520) {
      const t = this.smoothstep(4480, 4520, m);
      y = (1 - t) * this.getRawBiomeHeight(m, 4) + t * (baseElevation - 100);
    } else {
      y = baseElevation - 100;
    }

    // Launch ramps are laid over biome elevation using smoothstep shoulders.
    // The shorter descent creates a convex crest that can launch the vehicle at
    // speed while keeping rendered terrain and collision geometry identical.
    for (const ramp of this.launchRamps) {
      const crest = ramp.start + ramp.rise;
      const end = crest + ramp.drop;
      if (m >= ramp.start && m < crest) {
        y -= ramp.height * this.smoothstep(ramp.start, crest, m);
      } else if (m >= crest && m < end) {
        y -= ramp.height * (1 - this.smoothstep(crest, end, m));
      }
    }

    // Add speed bump bumps if near any
    for (const sb of this.speedBumps) {
      const dist = Math.abs(m - sb);
      if (dist < 1.2) {
        y -= Math.cos((dist / 1.2) * Math.PI * 0.5) * 10;
      }
    }

    return Math.max(150, Math.min(650, y));
  }

  // Returns slope dY/dX
  getSlope(pxX) {
    const delta = 2.0;
    const y1 = this.getHeight(pxX - delta);
    const y2 = this.getHeight(pxX + delta);
    return (y2 - y1) / (2 * delta);
  }

  // Returns normalized normal vector pointing upward away from ground (canvas -Y)
  getNormal(pxX) {
    const slope = this.getSlope(pxX);
    const len = Math.sqrt(slope * slope + 1);
    // For tangent (1, slope), the upward perpendicular in canvas space is
    // (slope, -1). The old (-slope, -1) vector was not perpendicular on hills
    // and injected a sideways component into every wheel contact force.
    const nx = slope / len;
    const ny = -1 / len;
    return { x: nx, y: ny, slope, len };
  }

  // Returns surface tangent pointing forward
  getTangent(pxX) {
    const slope = this.getSlope(pxX);
    const len = Math.sqrt(slope * slope + 1);
    return { x: 1 / len, y: slope / len };
  }

  // Check if position is in seawater rob puddle
  isInWaterPuddle(meterX) {
    for (const p of this.puddles) {
      if (meterX >= p.start && meterX <= p.end) return true;
    }
    return false;
  }

  // Check if position is in mud pit
  isInMudPit(meterX) {
    for (const m of this.mudPits) {
      if (meterX >= m.start && meterX <= m.end) return true;
    }
    return false;
  }

  // Check for nearby wooden log collision
  checkLogCollision(wheelPxX, wheelPxY, wheelRadius) {
    for (const log of this.logs) {
      const logPxX = log.x * PHYSICS_CONSTANTS.METER_SCALE;
      const logPxY = this.getHeight(logPxX) - log.radius;
      const dx = wheelPxX - logPxX;
      const dy = wheelPxY - logPxY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < wheelRadius + log.radius) {
        return { hit: true, log, dist, overlap: (wheelRadius + log.radius) - dist };
      }
    }
    return { hit: false };
  }

  // Dynamic Jerrycan Spawning when fuel < 20%
  triggerDynamicJerrycanSpawn(truckMeterX) {
    // Check if there is already an uncollected jerrycan within next 300m
    const upcoming = this.fuelCans.find(
      c => !c.collected && c.x > truckMeterX && c.x <= truckMeterX + 300
    );
    if (upcoming) return null; // already have one nearby

    // Search for a hill crest between truckMeterX + 60 and truckMeterX + 220
    let bestX = truckMeterX + 120;
    let minElevation = Infinity; // lowest Y means highest hill peak in canvas
    for (let testM = truckMeterX + 60; testM <= truckMeterX + 220; testM += 5) {
      const elev = this.getHeight(testM * PHYSICS_CONSTANTS.METER_SCALE);
      if (elev < minElevation) {
        minElevation = elev;
        bestX = testM;
      }
    }

    const newCan = { x: bestX, collected: false, dynamic: true };
    this.fuelCans.push(newCan);
    return newCan;
  }
}

export class PhysicsVehicle {
  constructor(startX = 100, startY = 400) {
    // Chassis State
    this.x = startX;
    this.y = startY;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0; // In radians
    this.angularVelocity = 0;

    // Chassis dimensions & properties
    this.width = 90;
    this.height = 45;
    this.mass = PHYSICS_CONSTANTS.MASS;

    // Wheels configuration (Rear & Front)
    this.wheelRadius = 18;
    this.suspensionRestLength = 16;
    this.rearMountOffset = { x: -30, y: 0 };
    this.frontMountOffset = { x: 30, y: 0 };

    // Normalized spring & damper parameters derived from PRD values
    // K_SPRING = 1800, K_DAMPER = 48, MASS = 1400
    this.kSpring = (PHYSICS_CONSTANTS.K_SPRING / PHYSICS_CONSTANTS.MASS) * 140; // ~180
    this.kDamper = (PHYSICS_CONSTANTS.K_DAMPER / PHYSICS_CONSTANTS.MASS) * 550; // ~18.8

    // Wheel hubs dynamic positions & velocities
    this.rearWheel = {
      x: startX - 30,
      y: startY + this.suspensionRestLength,
      vx: 0,
      vy: 0,
      onGround: false,
      rotation: 0,
      hitLogId: null
    };
    this.frontWheel = {
      x: startX + 30,
      y: startY + this.suspensionRestLength,
      vx: 0,
      vy: 0,
      onGround: false,
      rotation: 0,
      hitLogId: null
    };

    // Engine & Gameplay Parameters
    this.fuel = 100; // 0 to 100%
    this.cargoIntegrity = 100; // 0 to 100%
    this.enginePower = 2200;
    this.brakePower = 850;
    this.tireGrip = 1.0;
    this.airPitchTorque = PHYSICS_CONSTANTS.AIR_PITCH_TORQUE;
    this.engineThrottle = 0;
    this.reverseThrottle = 0;

    // Rollover tracking
    this.rolloverTimer = 0;
    this.isRolledOver = false;
    this.wasRoofTouching = false;
    this.wasBodyTouching = false;
    this.impactCooldown = 0;

    // Airborne, stunt, and landing tracking
    this.wasAirborne = false;
    this.airRotation = 0;
    this.airTime = 0;
    this.totalAirTime = 0;
    this.airborneBadge = '';
    this.wheelieTime = 0;
    this.stoppieTime = 0;
    this.stuntCoinsAwarded = 0;
    this.perfectLandingTimer = 0;
    this.lastLandingPitchDiff = 0;
    this.stuntMessage = '';
    this.stuntTimer = 0;
    this.soundEngine = null;

    // Transit checkpoints tracking
    this.lastCheckpoint = null;
    this.checkpointNotice = null;

    // Ompreng / Food Parcel Refill tracking
    this.omprengNotice = null;
    this.omprengNoticeTimer = 0;
    this.foodParcelsCollected = 0;

    // Upgrades and dynamic speed limits
    this.maxForwardSpeed = PHYSICS_CONSTANTS.MAX_FORWARD_SPEED;
    this.throttleRampUp = PHYSICS_CONSTANTS.THROTTLE_RAMP_UP;
    this.engineLvl = 1;
    this.gripLvl = 1;
    this.suspLvl = 1;

    // Food particles ejected during shocks
    this.foodParticles = [];
    // Fixed-step accumulator keeps suspension and collision results stable when
    // the browser varies its frame rate.
    this.physicsAccumulator = 0;
    this.physicsStep = 1 / 120;
  }

  setSoundEngine(sound) {
    this.soundEngine = sound;
  }

  applyUpgrades(upgrades = {}, activeSkin = 'standard') {
    const engineLvl = Math.max(1, Math.min(20, upgrades.engine || 1));
    const gripLvl = Math.max(1, Math.min(20, upgrades.grip || 1));
    const suspLvl = Math.max(1, Math.min(20, upgrades.suspension || 1));
    this.engineLvl = engineLvl;
    this.gripLvl = gripLvl;
    this.suspLvl = suspLvl;

    // Baseline Level 1 WAJIB TETAP: enginePower = 2200, kSpring = 180, kDamper = 18.8
    this.enginePower = 2200 + (engineLvl - 1) * 80;
    this.tireGrip = 1.0 + (gripLvl - 1) * 0.03;
    this.kSpring = 180 + (suspLvl - 1) * 4;
    this.kDamper = 18.8 + (suspLvl - 1) * 0.4;

    // Dynamic top speed: scales from 550 px/s (99 km/h) at Level 1 up to 1000 px/s (180 km/h) at Level 20
    let topSpeed = 550 + (engineLvl - 1) * (450 / 19);

    // Dynamic air pitch torque: scales with suspension level (+3% per level)
    this.airPitchTorque = PHYSICS_CONSTANTS.AIR_PITCH_TORQUE * (1 + (suspLvl - 1) * 0.03);

    // Throttle response: punchier ramp-up on higher engine levels
    this.throttleRampUp = PHYSICS_CONSTANTS.THROTTLE_RAMP_UP + (engineLvl - 1) * 0.25;

    // Skin bonuses (selected skin grants tactical gameplay buffs)
    if (activeSkin === 'speedy') {
      topSpeed *= 1.05; // +5% Top Speed
    } else if (activeSkin === 'sport') {
      topSpeed *= 1.10; // +10% Top Speed
    } else if (activeSkin === 'mountain') {
      this.tireGrip *= 1.05; // +5% Tire Grip
    } else if (activeSkin === 'retro') {
      this.kSpring *= 1.05;
      this.kDamper *= 1.05;
    }

    this.maxForwardSpeed = topSpeed;
  }

  // Update step with sub-stepping
  update(dt, inputs, terrain) {
    const safeDt = Number.isFinite(dt) ? Math.max(0, Math.min(0.1, dt)) : 0;
    this.physicsAccumulator = Math.min(0.1, this.physicsAccumulator + safeDt);
    let steps = 0;
    while (this.physicsAccumulator + 1e-9 >= this.physicsStep && steps < 12) {
      this.physicsSubStep(this.physicsStep, inputs, terrain);
      this.physicsAccumulator -= this.physicsStep;
      steps++;
    }
    if (this.physicsAccumulator < 1e-9) this.physicsAccumulator = 0;

    // Timers and particles follow elapsed game time; the rigid body uses the
    // fixed 120 Hz step above. A 100 ms cap bounds recovery after a tab stall.
    const clampedDt = safeDt;
    this.impactCooldown = Math.max(0, this.impactCooldown - clampedDt);

    if (this.perfectLandingTimer > 0) {
      this.perfectLandingTimer = Math.max(0, this.perfectLandingTimer - clampedDt);
    }
    if (this.stuntTimer > 0) {
      this.stuntTimer = Math.max(0, this.stuntTimer - clampedDt);
    }
    if (this.omprengNoticeTimer > 0) {
      this.omprengNoticeTimer = Math.max(0, this.omprengNoticeTimer - clampedDt);
    }

    // Dynamic Jerrycan Check
    if (this.fuel < 20) {
      terrain.triggerDynamicJerrycanSpawn(this.x / PHYSICS_CONSTANTS.METER_SCALE);
    }

    // Check item pickups
    this.checkPickups(terrain);

    // Update food particles
    for (let i = this.foodParticles.length - 1; i >= 0; i--) {
      const p = this.foodParticles[i];
      p.x += p.vx * clampedDt;
      p.y += p.vy * clampedDt;
      p.vy += PHYSICS_CONSTANTS.GRAVITY * clampedDt;
      p.rot += p.vrot * clampedDt;
      p.life -= clampedDt;
      if (p.life <= 0) {
        this.foodParticles.splice(i, 1);
      }
    }
  }

  physicsSubStep(dt, inputs, terrain) {
    const chassisTangent = terrain.getTangent(this.x);
    const chassisTrackSpeed = this.vx * chassisTangent.x + this.vy * chassisTangent.y;
    const roadAngle = Math.atan2(chassisTangent.y, chassisTangent.x);
    const chassisPitch = Math.atan2(
      Math.sin(this.angle - roadAngle),
      Math.cos(this.angle - roadAngle)
    );
    const throttleTarget = inputs.gas && this.fuel > 0 ? 1 : 0;
    const throttleRate = throttleTarget > this.engineThrottle
      ? (this.throttleRampUp || PHYSICS_CONSTANTS.THROTTLE_RAMP_UP)
      : PHYSICS_CONSTANTS.THROTTLE_RAMP_DOWN;
    this.engineThrottle += Math.sign(throttleTarget - this.engineThrottle)
      * Math.min(Math.abs(throttleTarget - this.engineThrottle), throttleRate * dt);

    const reverseTarget = inputs.brake && this.fuel > 0 && chassisTrackSpeed <= 12 ? 1 : 0;
    const reverseRate = reverseTarget > this.reverseThrottle
      ? PHYSICS_CONSTANTS.REVERSE_RAMP_UP
      : PHYSICS_CONSTANTS.THROTTLE_RAMP_DOWN;
    this.reverseThrottle += Math.sign(reverseTarget - this.reverseThrottle)
      * Math.min(Math.abs(reverseTarget - this.reverseThrottle), reverseRate * dt);

    const cosA = Math.cos(this.angle);
    const sinA = Math.sin(this.angle);

    // Mount points in world coordinates
    const rmx = this.x + (this.rearMountOffset.x * cosA - this.rearMountOffset.y * sinA);
    const rmy = this.y + (this.rearMountOffset.x * sinA + this.rearMountOffset.y * cosA);
    const fmx = this.x + (this.frontMountOffset.x * cosA - this.frontMountOffset.y * sinA);
    const fmy = this.y + (this.frontMountOffset.x * sinA + this.frontMountOffset.y * cosA);

    // Suspension vector direction (pointing downward from chassis bottom)
    const strutNx = -sinA;
    const strutNy = cosA;

    // Process Rear Wheel Suspension & Ground Contact
    const rSusp = this.solveWheelSuspension(
      this.rearWheel, rmx, rmy, strutNx, strutNy, dt, terrain, inputs, true
    );
    // Process Front Wheel Suspension & Ground Contact
    const fSusp = this.solveWheelSuspension(
      this.frontWheel, fmx, fmy, strutNx, strutNy, dt, terrain, inputs, false
    );

    // Air Control, Landing Absorption & Hill Climb Racing Ground Torque
    const inAir = !this.rearWheel.onGround && !this.frontWheel.onGround;
    let driveTorque = 0;
    let weightTransferForce = 0;

    if (inAir) {
      this.wasAirborne = true;
      this.airTime += dt;
      this.totalAirTime += dt;
      if (this.airTime >= 0.35) {
        this.airborneBadge = `AIR TIME ${this.airTime.toFixed(1)}s ✈️`;
      }
      this.airRotation += this.angularVelocity * dt;
      if (inputs.gas) {
        // Pitch nose up (counter-clockwise in canvas)
        this.angularVelocity -= this.airPitchTorque * dt;
      }
      if (inputs.brake) {
        // Pitch nose down (clockwise in canvas)
        this.angularVelocity += this.airPitchTorque * dt;
      }
    } else {
      if (this.wasAirborne) {
        this.handleLanding(terrain);
        this.wasAirborne = false;
        this.airRotation = 0;
        this.airTime = 0;
        this.airborneBadge = '';
      }

      // Wheelie & Stoppie Stunt Tracking
      const isWheelie = this.rearWheel.onGround && !this.frontWheel.onGround && chassisPitch < -0.15;
      const isStoppie = this.frontWheel.onGround && !this.rearWheel.onGround && chassisPitch > 0.15;

      if (isWheelie) {
        this.wheelieTime += dt;
        this.stoppieTime = 0;
        if (this.wheelieTime >= 0.35) {
          this.airborneBadge = `WHEELIE ${this.wheelieTime.toFixed(1)}s ⚡`;
        }
      } else if (isStoppie) {
        this.stoppieTime += dt;
        this.wheelieTime = 0;
        if (this.stoppieTime >= 0.35) {
          this.airborneBadge = `STOPPIE ${this.stoppieTime.toFixed(1)}s 🛑`;
        }
      } else {
        if (this.wheelieTime >= 0.6) {
          const bonusCoins = Math.min(25, Math.floor(this.wheelieTime * 8));
          this.stuntCoinsAwarded += bonusCoins;
          this.stuntMessage = `WHEELIE ${this.wheelieTime.toFixed(1)}s! +${bonusCoins} KOIN ⚡`;
          this.stuntTimer = 1.8;
          if (this.soundEngine && typeof this.soundEngine.playCoinPickupSound === 'function') {
            this.soundEngine.playCoinPickupSound();
          } else if (this.soundEngine && typeof this.soundEngine.playCoinSound === 'function') {
            this.soundEngine.playCoinSound();
          }
        } else if (this.stoppieTime >= 0.6) {
          const bonusCoins = Math.min(25, Math.floor(this.stoppieTime * 8));
          this.stuntCoinsAwarded += bonusCoins;
          this.stuntMessage = `STOPPIE ${this.stoppieTime.toFixed(1)}s! +${bonusCoins} KOIN 🛑`;
          this.stuntTimer = 1.8;
          if (this.soundEngine && typeof this.soundEngine.playCoinPickupSound === 'function') {
            this.soundEngine.playCoinPickupSound();
          } else if (this.soundEngine && typeof this.soundEngine.playCoinSound === 'function') {
            this.soundEngine.playCoinSound();
          }
        }
        this.wheelieTime = 0;
        this.stoppieTime = 0;
        if (!inAir) {
          this.airborneBadge = '';
        }
      }

      // Hill Climb Racing Ground Torque & Weight Transfer:
      // Drive wheel traction reaction torque on chassis (pitches front up on gas, down on brake)
      const pitchBalanced = inputs.gas && inputs.brake;
      if (!pitchBalanced && inputs.gas && this.engineThrottle > 0 && this.fuel > 0) {
        const traction = this.rearWheel.onGround ? 1.0 : 0.4;
        const surfaceTraction = terrain.isInWaterPuddle(this.x / PHYSICS_CONSTANTS.METER_SCALE)
          ? PHYSICS_CONSTANTS.WATER_SLIP_TRACTION
          : terrain.isInMudPit(this.x / PHYSICS_CONSTANTS.METER_SCALE)
            ? PHYSICS_CONSTANTS.MUD_SLIP_TRACTION
            : 1.0;
        // Engine reaction pitches the nose up. Fade that torque as forward
        // speed rises so a long throttle hold cannot wind the chassis into flips.
        const activeMaxSpeed = this.maxForwardSpeed || PHYSICS_CONSTANTS.MAX_FORWARD_SPEED;
        const speedTorqueScale = Math.max(0.20,
          1 - Math.abs(this.vx) / activeMaxSpeed);
        const highPitchRisk = Math.abs(chassisPitch) > 45 * Math.PI / 180;
        const pitchThrottle = highPitchRisk ? 1 : this.engineThrottle;
        driveTorque += PHYSICS_CONSTANTS.GROUND_GAS_PITCH_TORQUE * pitchThrottle
          * traction * surfaceTraction * speedTorqueScale;
        weightTransferForce += 22 * traction; // Transfers downforce to rear suspension
      }
      // Ground brake pitch acts independently from throttle. Holding both
      // cancels ground pitch torque while the gas path keeps the rear drive on.
      if (!pitchBalanced && inputs.brake) {
        const traction = this.frontWheel.onGround ? 1.0 : 0.4;
        const surfaceTraction = terrain.isInWaterPuddle(this.x / PHYSICS_CONSTANTS.METER_SCALE)
          ? PHYSICS_CONSTANTS.WATER_SLIP_TRACTION
          : terrain.isInMudPit(this.x / PHYSICS_CONSTANTS.METER_SCALE)
            ? PHYSICS_CONSTANTS.MUD_SLIP_TRACTION
            : 1.0;
        const brakeTorqueScale = Math.min(1, Math.abs(chassisTrackSpeed) / 220);
        driveTorque -= PHYSICS_CONSTANTS.GROUND_BRAKE_PITCH_TORQUE * traction * surfaceTraction * brakeTorqueScale;
        weightTransferForce -= 26 * traction; // Transfers downforce to front suspension
      }
    }

    // Dynamic weight transfer adjusts suspension mount loads along strut vector
    const rTotalFx = rSusp.fx + weightTransferForce * strutNx;
    const rTotalFy = rSusp.fy + weightTransferForce * strutNy;
    const fTotalFx = fSusp.fx - weightTransferForce * strutNx;
    const fTotalFy = fSusp.fy - weightTransferForce * strutNy;

    // Chassis spring-damper forces and longitudinal drive/friction forces from wheels
    let fx = - (rTotalFx + fTotalFx) + (rSusp.driveFx + fSusp.driveFx);
    let fy = PHYSICS_CONSTANTS.GRAVITY - (rTotalFy + fTotalFy);

    // Suspension torque on chassis
    const rTorque = (rmx - this.x) * (-rTotalFy) - (rmy - this.y) * (-rTotalFx);
    const fTorque = (fmx - this.x) * (-fTotalFy) - (fmy - this.y) * (-fTotalFx);
    const totalTorque = (rTorque + fTorque) * 0.003 - driveTorque;

    // Angular acceleration & integration
    this.angularVelocity += totalTorque * dt;
    this.angularVelocity *= (1 - PHYSICS_CONSTANTS.ANGULAR_DAMPING * dt);
    this.angularVelocity = Math.max(-PHYSICS_CONSTANTS.MAX_ANGULAR_SPEED,
      Math.min(PHYSICS_CONSTANTS.MAX_ANGULAR_SPEED, this.angularVelocity));
    this.angle += this.angularVelocity * dt;

    // Linear acceleration & integration
    this.vx += fx * dt;
    // Dynamic speed envelope scales with engine upgrades and skin bonuses
    const activeForwardSpeed = this.maxForwardSpeed || PHYSICS_CONSTANTS.MAX_FORWARD_SPEED;
    this.vx = Math.max(-PHYSICS_CONSTANTS.MAX_REVERSE_SPEED,
      Math.min(activeForwardSpeed, this.vx));
    this.vy += fy * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Check roof, bottom, and body terrain penetration
    this.checkChassisTerrainCollision(terrain, dt);
  }

  handleLanding(terrain) {
    const slope = terrain.getSlope(this.x);
    const slopeAngle = Math.atan(slope);
    const normal = terrain.getNormal(this.x);
    const normalImpactSpeed = this.absorbLandingNormalVelocity(this, normal, 0);
    // Angular difference relative to terrain slope tangent wrapped to [-PI, PI]
    const angleDiff = Math.abs(Math.atan2(Math.sin(this.angle - slopeAngle), Math.cos(this.angle - slopeAngle)));
    const angleDiffDeg = (angleDiff * 180) / Math.PI;
    this.lastLandingPitchDiff = angleDiffDeg;

    // Track completed flips
    const totalFlips = Math.round(Math.abs(this.airRotation) / (2 * Math.PI));
    if (totalFlips >= 1) {
      const isBackflip = this.airRotation < 0;
      const flipBonus = totalFlips * 25;
      const flipName = totalFlips > 1 ? `${totalFlips}x ${isBackflip ? 'BACKFLIP' : 'FRONTFLIP'}` : (isBackflip ? 'BACKFLIP' : 'FRONTFLIP');
      this.stuntCoinsAwarded += flipBonus;
      this.stuntMessage = `${flipName}! +${flipBonus} KOIN ⭐`;
      this.stuntTimer = 2.0;
      if (this.soundEngine && typeof this.soundEngine.playCoinPickupSound === 'function') {
        this.soundEngine.playCoinPickupSound();
      } else if (this.soundEngine && typeof this.soundEngine.playCoinSound === 'function') {
        this.soundEngine.playCoinSound();
      }
    } else if (this.airTime >= 0.75 && angleDiffDeg <= 35) {
      const airBonus = Math.min(30, Math.floor(this.airTime * 10));
      this.stuntCoinsAwarded += airBonus;
      this.stuntMessage = `AIR TIME ${this.airTime.toFixed(1)}s! +${airBonus} KOIN ✈️`;
      this.stuntTimer = 1.8;
      if (this.soundEngine && typeof this.soundEngine.playCoinPickupSound === 'function') {
        this.soundEngine.playCoinPickupSound();
      } else if (this.soundEngine && typeof this.soundEngine.playCoinSound === 'function') {
        this.soundEngine.playCoinSound();
      }
    }

    if (angleDiffDeg <= 22) {
      // A well-aligned landing absorbs the normal component and preserves
      // forward momentum along the slope. A separating/tiny brush is not a
      // landing reward and must not show a false "perfect" banner.
      this.absorbLandingNormalVelocity(this.rearWheel, terrain.getNormal(this.rearWheel.x), 0.9);
      this.absorbLandingNormalVelocity(this.frontWheel, terrain.getNormal(this.frontWheel.x), 0.9);
      this.absorbLandingNormalVelocity(this, normal, 0.9);

      if (normalImpactSpeed >= 30) {
        this.perfectLandingTimer = 1.5;
      }
      if (normalImpactSpeed >= 30 && this.soundEngine && typeof this.soundEngine.playSuspensionSpringSound === 'function') {
        this.soundEngine.playSuspensionSpringSound();
      }
    } else if (angleDiffDeg <= 35) {
      // Slightly misaligned landings absorb 70% of the impact normal.
      this.absorbLandingNormalVelocity(this.rearWheel, terrain.getNormal(this.rearWheel.x), 0.7);
      this.absorbLandingNormalVelocity(this.frontWheel, terrain.getNormal(this.frontWheel.x), 0.7);
      this.absorbLandingNormalVelocity(this, normal, 0.7);
      if (normalImpactSpeed >= 30 && this.soundEngine && typeof this.soundEngine.playSuspensionSpringSound === 'function') {
        this.soundEngine.playSuspensionSpringSound();
      }
    } else {
      // A steeply misaligned impact damages cargo by incoming speed along the
      // surface normal, even when the world-vertical component is small.
      if (normalImpactSpeed > 60) {
        const suspDamping = Math.max(0.65, 1.0 - ((this.suspLvl || 1) - 1) * 0.018);
        this.applyImpactShock((normalImpactSpeed + 40) * suspDamping);
        this.absorbLandingNormalVelocity(this.rearWheel, terrain.getNormal(this.rearWheel.x), 0.8);
        this.absorbLandingNormalVelocity(this.frontWheel, terrain.getNormal(this.frontWheel.x), 0.8);
        this.absorbLandingNormalVelocity(this, normal, 0.8);
      }
    }
  }

  // Remove a fraction of only the velocity component moving into the surface.
  // Tangential travel along the slope remains unchanged, as it should for a
  // wheel/suspension impact without a friction impulse.
  absorbLandingNormalVelocity(body, normal, absorption) {
    const normalVelocity = body.vx * normal.x + body.vy * normal.y;
    if (normalVelocity >= 0) return 0;
    body.vx -= normalVelocity * absorption * normal.x;
    body.vy -= normalVelocity * absorption * normal.y;
    return -normalVelocity;
  }

  solveWheelSuspension(wheel, mx, my, strutNx, strutNy, dt, terrain, inputs, isDriveWheel) {
    // Current distance from mount to wheel hub
    const dx = wheel.x - mx;
    const dy = wheel.y - my;
    let currentLength = dx * strutNx + dy * strutNy;
    const minSuspTravel = 6;
    const maxSuspTravel = 24;
    currentLength = Math.max(minSuspTravel, Math.min(maxSuspTravel, currentLength));

    // Constrain wheel position to stay strictly on the suspension strut arm
    wheel.x = mx + strutNx * currentLength;
    wheel.y = my + strutNy * currentLength;

    // True damped harmonic oscillation for dual-strut suspension:
    // Soft elastic spring compression (deltaL > 0) with asymmetric damping:
    // - Softer bump damping on compression (relVProj < 0) so the vehicle absorbs bumps without jitter
    // - Progressive rebound damping on extension (relVProj > 0) to prevent pogo oscillations
    const deltaL = this.suspensionRestLength - currentLength;
    const relVx = wheel.vx - this.vx;
    const relVy = wheel.vy - this.vy;
    const relVProj = relVx * strutNx + relVy * strutNy;

    let damperCoeff = this.kDamper;
    if (relVProj < 0) {
      // Compression (bump): softer bump damping
      damperCoeff = this.kDamper * 0.45;
    } else {
      // Extension (rebound): progressive damping
      damperCoeff = this.kDamper * (1.35 + Math.max(0, -deltaL) * 0.05);
    }

    const springForce = Math.max(0, this.kSpring * deltaL);
    const damperForce = damperCoeff * relVProj;
    const fSuspMag = Math.max(0, springForce - damperForce);
    const suspFx = fSuspMag * strutNx;
    const suspFy = fSuspMag * strutNy;

    // Trigger spring sound on deep compression
    if (deltaL >= 8 || currentLength <= minSuspTravel + 1) {
      if (this.soundEngine && typeof this.soundEngine.playSuspensionSpringSound === 'function') {
        this.soundEngine.playSuspensionSpringSound();
      }
    }

    // Wheel ground contact
    const groundY = terrain.getHeight(wheel.x);
    const penetration = (wheel.y + this.wheelRadius) - groundY;
    wheel.onGround = (penetration >= -2);

    let groundFx = 0;
    let groundFy = 0;
    let driveFx = 0;

    if (penetration > 0) {
      const normal = terrain.getNormal(wheel.x); // pointing up
      const tangent = terrain.getTangent(wheel.x); // pointing forward along slope

      // Normal restitution & clamping
      const normalSpring = 520;
      const normalDamper = 35;
      const vDotN = wheel.vx * normal.x + wheel.vy * normal.y;
      const normalForceMag = Math.max(0, normalSpring * penetration - normalDamper * vDotN);

      groundFx += normal.x * normalForceMag;
      groundFy += normal.y * normalForceMag;

      // Anti-tunneling / clamping: clamp penetration > 8px
      if (penetration > PHYSICS_CONSTANTS.MAX_PENETRATION_CLAMP) {
        wheel.y = groundY - this.wheelRadius;
        // Damping vertical velocity 80% as mandated in PRD
        if (wheel.vy > 0) {
          wheel.vy *= 0.2;
        }
      }

      // Check Hazard traction factors
      const meterX = wheel.x / PHYSICS_CONSTANTS.METER_SCALE;
      let tractionFactor = 1.0;
      if (terrain.isInWaterPuddle(meterX)) {
        tractionFactor = PHYSICS_CONSTANTS.WATER_SLIP_TRACTION; // 0.85
      } else if (terrain.isInMudPit(meterX)) {
        tractionFactor = PHYSICS_CONSTANTS.MUD_SLIP_TRACTION;
      }
      tractionFactor *= (this.tireGrip || 1.0);

      const vDotT = wheel.vx * tangent.x + wheel.vy * tangent.y;

      // Drive traction
      let driveForce = 0;
      if (inputs.gas && this.engineThrottle > 0 && this.fuel > 0) {
        // Rear-wheel drive: do not apply a second, free engine force to the
        // front wheel. Fuel is consumed by this same driven axle below.
        driveForce = isDriveWheel ? this.enginePower * this.engineThrottle * tractionFactor : 0;
        if (isDriveWheel) {
          this.fuel = Math.max(0, this.fuel - 2.2 * this.engineThrottle * dt);
        }
      } else if (inputs.brake) {
        // Brake against forward travel first; once stopped or travelling backward,
        // engage reverse engine drive torque smoothly up to MAX_REVERSE_SPEED.
        const speedAlongTrack = this.vx * tangent.x + this.vy * tangent.y;
        if (speedAlongTrack > 12) {
          driveForce = -this.brakePower * tractionFactor;
        } else {
          // Reverse is engine torque on driven axle, disabled when fuel is empty
          driveForce = isDriveWheel && this.fuel > 0
            ? -this.enginePower * 0.50 * this.reverseThrottle * tractionFactor
            : 0;
          if (isDriveWheel && this.fuel > 0) {
            this.fuel = Math.max(0, this.fuel - 2.2 * this.reverseThrottle * dt);
          }
        }
      }

      // Apply drive force along terrain tangent
      groundFx += tangent.x * driveForce;
      groundFy += tangent.y * driveForce;

      // Lateral rolling resistance & tire friction damping opposing slide
      const frictionMag = -vDotT * 0.9 * tractionFactor;
      groundFx += tangent.x * frictionMag;
      groundFy += tangent.y * frictionMag;

      // Mud drag must reach the chassis. Damping only the free wheel velocity
      // before engine force was ineffective and could make mud retain more speed.
      const mudDragMag = terrain.isInMudPit(meterX)
        ? -vDotT * (PHYSICS_CONSTANTS.MUD_DRAG_RATE / Math.max(0.6, this.tireGrip || 1.0)) * 0.5
        : 0;
      groundFx += tangent.x * mudDragMag;
      groundFy += tangent.y * mudDragMag;

      // Wheel rotation
      wheel.rotation += (vDotT / this.wheelRadius) * dt;

      // Longitudinal drive force transmitted to vehicle chassis
      driveFx = tangent.x * (driveForce + frictionMag + mudDragMag);

      // Check wooden log collision (debounced per contact entry)
      const logCol = terrain.checkLogCollision(wheel.x, wheel.y, this.wheelRadius);
      if (logCol.hit) {
        if (wheel.hitLogId !== logCol.log.x) {
          wheel.hitLogId = logCol.log.x;
          // Vertical impulse Delta v_y = -140 px/s
          wheel.vy = PHYSICS_CONSTANTS.LOG_IMPULSE_VY;
          const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          // Slow crawling over washboard logs (<60 px/s) allows suspension to absorb with 0 damage.
          // Reckless speeding triggers realistic cargo shock proportional to speed.
          if (currentSpeed > 60) {
            const logShockIntensity = Math.min(200, 80 + currentSpeed * 0.22);
            this.applyImpactShock(logShockIntensity);
          }
        }
      } else if (wheel.hitLogId !== null) {
        const logPx = wheel.hitLogId * PHYSICS_CONSTANTS.METER_SCALE;
        if (Math.abs(wheel.x - logPx) > 50) {
          wheel.hitLogId = null;
        }
      }
    } else {
      // Free spin in air
      if (inputs.gas) wheel.rotation += 18 * dt;
      if (inputs.brake) wheel.rotation -= 8 * dt;
    }

    // Integrate wheel hub
    const wNetFx = suspFx + groundFx;
    const wNetFy = suspFy + groundFy + PHYSICS_CONSTANTS.GRAVITY;

    wheel.vx += wNetFx * dt;
    wheel.vy += wNetFy * dt;
    wheel.x += wheel.vx * dt;
    wheel.y += wheel.vy * dt;

    // Constrain wheel position relative to mount along suspension strut
    const curLen = (wheel.x - mx) * strutNx + (wheel.y - my) * strutNy;
    if (curLen > maxSuspTravel) {
      wheel.x = mx + strutNx * maxSuspTravel;
      wheel.y = my + strutNy * maxSuspTravel;
    } else if (curLen < minSuspTravel) {
      wheel.x = mx + strutNx * minSuspTravel;
      wheel.y = my + strutNy * minSuspTravel;
    }

    // Keep wheel velocity coupled to chassis forward velocity
    wheel.vx = this.vx + (wheel.vx - this.vx) * 0.8;

    return { fx: suspFx, fy: suspFy, driveFx };
  }

  checkChassisTerrainCollision(terrain, dt) {
    const cosA = Math.cos(this.angle);
    const sinA = Math.sin(this.angle);

    // Normalized tilt angle relative to upright [0, PI]
    const tilt = Math.abs(Math.atan2(Math.sin(this.angle), Math.cos(this.angle)));
    const isTilted = tilt > PHYSICS_CONSTANTS.ROLLOVER_ANGLE;

    // Multi-point roof collision check (Center roof, Front cab top, Driver head, Rear box top)
    const roofPoints = [
      { lx: 0, ly: -this.height * 0.85 },
      { lx: this.width * 0.35, ly: -this.height * 0.8 },
      { lx: 22, ly: -this.height * 0.82 },
      { lx: -this.width * 0.4, ly: -this.height * 0.85 }
    ];

    let isRoofTouching = false;
    for (const rp of roofPoints) {
      const rx = this.x + (rp.lx * cosA - rp.ly * sinA);
      const ry = this.y + (rp.lx * sinA + rp.ly * cosA);
      if (ry >= terrain.getHeight(rx)) {
        isRoofTouching = true;
        break;
      }
    }

    const roofImpactEntry = isRoofTouching && isTilted && !this.wasRoofTouching;
    if (isRoofTouching && isTilted) {
      this.rolloverTimer += dt;
      if (this.rolloverTimer >= PHYSICS_CONSTANTS.ROLLOVER_GRACE_TIME) {
        this.isRolledOver = true;
      }
      // Hard roof slam shock (triggered once per roof impact entry)
      if (roofImpactEntry) {
        this.applyImpactShock(200);
        this.wasRoofTouching = true;
      }
    } else {
      this.wasRoofTouching = false;
      // Grace period resets if righted
      this.rolloverTimer = Math.max(0, this.rolloverTimer - dt * 2);
    }

    // Multi-point raycast anti-tunneling clamp (Roof, Bottom, Front, Rear)
    const testPoints = [
      { lx: 0, ly: -this.height * 0.85 }, // Roof
      { lx: 0, ly: this.height * 0.2 },    // Bottom undercarriage clearance
      { lx: this.width * 0.45, ly: 0 },    // Front bumper
      { lx: -this.width * 0.45, ly: 0 }    // Rear bumper
    ];

    let isBodyTouching = false;
    let bodyImpactIntensity = 0;
    for (const pt of testPoints) {
      const wx = this.x + (pt.lx * cosA - pt.ly * sinA);
      const wy = this.y + (pt.lx * sinA + pt.ly * cosA);
      const gy = terrain.getHeight(wx);

      // Keep contact latched through tiny numerical gaps. Without this margin,
      // the body can alternate between contact and free space every few ticks.
      if (wy >= gy - 2) isBodyTouching = true;

      if (wy > gy) {
        const pen = wy - gy;
        this.y -= pen * 0.4;
        if (pt.ly > 0) {
          // Bottom undercarriage: only damp horizontal speed during severe bottom-out
          if (pen > 4 && this.vy > 60) {
            this.vx *= 0.98;
            const slope = terrain.getSlope(this.x);
            const slopeAngle = Math.atan(slope);
            const diffDeg = Math.abs(Math.atan2(Math.sin(this.angle - slopeAngle), Math.cos(this.angle - slopeAngle))) * 180 / Math.PI;
            if (diffDeg > 35) {
              bodyImpactIntensity = Math.max(bodyImpactIntensity, this.vy);
            }
            this.vy *= 0.3;
          }
        } else {
          if (this.vy > 120) {
            const slope = terrain.getSlope(this.x);
            const slopeAngle = Math.atan(slope);
            const diffDeg = Math.abs(Math.atan2(Math.sin(this.angle - slopeAngle), Math.cos(this.angle - slopeAngle))) * 180 / Math.PI;
            if (diffDeg > 35) {
              bodyImpactIntensity = Math.max(bodyImpactIntensity, this.vy);
            }
            this.vy *= 0.2; // 80% vertical damping per PRD Section 6
          }
          this.vx *= 0.96;
        }
      }
    }

    // One chassis contact can overlap several ray points and persist across
    // many 120 Hz steps. Damage once on entry instead of once per point/frame.
    if (isBodyTouching && !this.wasBodyTouching && !roofImpactEntry && bodyImpactIntensity > 0) {
      this.applyImpactShock(bodyImpactIntensity);
    }
    this.wasBodyTouching = isBodyTouching;
  }

  triggerImpactShock(intensity) {
    if (intensity < 120) return;
    const suspFactor = Math.max(0.65, 1 - ((this.suspLvl || 1) - 1) * (0.35 / 19));
    const damage = Math.min(25, (intensity - 100) * 0.06 * suspFactor);
    this.cargoIntegrity = Math.max(0, this.cargoIntegrity - damage);

    // Eject comical food particles
    const particleTypes = ['tofu', 'tempe', 'milk', 'serundeng', 'lodeh'];
    const count = Math.min(10, Math.floor(damage * 0.8) + 2);
    for (let i = 0; i < count; i++) {
      const pType = particleTypes[Math.floor(Math.random() * particleTypes.length)];
      this.foodParticles.push({
        type: pType,
        x: this.x - 40 + (Math.random() * 20 - 10),
        y: this.y - 15 + (Math.random() * 10 - 5),
        vx: this.vx * 0.5 - 80 - Math.random() * 100,
        vy: -100 - Math.random() * 150,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 15,
        life: 1.5 + Math.random() * 0.8
      });
    }
  }

  applyImpactShock(intensity) {
    if (intensity < 120 || this.impactCooldown > 0) return false;
    this.impactCooldown = 0.35;
    this.triggerImpactShock(intensity);
    return true;
  }

  checkPickups(terrain) {
    const truckMeterX = this.x / PHYSICS_CONSTANTS.METER_SCALE;

    // Fuel Jerrycans (+30 percentage points): leave a usable reserve after the added jump sections.
    for (const can of terrain.fuelCans) {
      if (!can.collected && Math.abs(truckMeterX - can.x) < 2.5) {
        can.collected = true;
        this.fuel = Math.min(100, this.fuel + 30);
      }
    }

    // Food Parcels / Ompreng Refill (+20% Cargo Integrity)
    if (terrain.foodParcels && Array.isArray(terrain.foodParcels)) {
      for (const parcel of terrain.foodParcels) {
        if (!parcel.collected && Math.abs(truckMeterX - parcel.x) < 2.5) {
          parcel.collected = true;
          this.cargoIntegrity = Math.min(100, this.cargoIntegrity + 20);
          this.foodParcelsCollected = (this.foodParcelsCollected || 0) + 1;
          this.omprengNotice = '+20% PAKET GIZI REFILL!';
          this.omprengNoticeTimer = 1.5;
          if (this.soundEngine && typeof this.soundEngine.playCoinPickupSound === 'function') {
            this.soundEngine.playCoinPickupSound();
          }
        }
      }
    }

    // Coins
    for (const coin of terrain.coins) {
      if (!coin.collected && Math.abs(truckMeterX - coin.x) < 2.0) {
        coin.collected = true;
      }
    }

    // Transit Delivery Checkpoints (+50% Fuel, +35% Cargo Restock, & secures checkpoint)
    if (terrain.checkpoints && Array.isArray(terrain.checkpoints)) {
      for (const cp of terrain.checkpoints) {
        if (!cp.collected && Math.abs(truckMeterX - cp.x) < 3.5) {
          cp.collected = true;
          this.fuel = Math.min(100, this.fuel + 50);
          this.cargoIntegrity = Math.min(100, this.cargoIntegrity + 35);
          this.lastCheckpoint = {
            x: cp.x,
            name: cp.name,
            cargo: this.cargoIntegrity
          };
          this.checkpointNotice = `${cp.name} Terlewati! +Bensin & Kargo Diisi Ulang`;
        }
      }
    }
  }
}

export class GameStateManager {
  constructor() {
    this.state = 'START'; // 'START' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'VICTORY'
    this.gameOverReason = null; // 'ROLLOVER' | 'FUEL' | 'DEADLINE' | 'CARGO'
    this.timeLimitSeconds = 210; // 3m 30s countdown to 09:45:00 WIB
    this.timeRemaining = this.timeLimitSeconds;
    this.coinsCollected = 0;
    this.stuntCoins = 0;
    this.stars = 0;
  }

  update(dt, vehicle, terrain) {
    if (this.state !== 'PLAYING') return;

    // Countdown timer
    this.timeRemaining = Math.max(0, this.timeRemaining - dt);
    if (this.timeRemaining <= 0) {
      this.state = 'GAMEOVER';
      this.gameOverReason = 'DEADLINE';
      return;
    }

    // Rollover condition
    if (vehicle.isRolledOver) {
      this.state = 'GAMEOVER';
      this.gameOverReason = 'ROLLOVER';
      return;
    }

    // Cargo destroyed condition
    if (vehicle.cargoIntegrity <= 0) {
      this.state = 'GAMEOVER';
      this.gameOverReason = 'CARGO';
      return;
    }

    // Fuel out condition (fuel == 0 and vehicle almost stopped or rolling backwards)
    if (vehicle.fuel <= 0 && (Math.abs(vehicle.vx) < 6 || vehicle.vx < -10)) {
      this.state = 'GAMEOVER';
      this.gameOverReason = 'FUEL';
      return;
    }

    // Collect stunt coins
    if (vehicle && vehicle.stuntCoinsAwarded > 0) {
      this.stuntCoins = (this.stuntCoins || 0) + vehicle.stuntCoinsAwarded;
      vehicle.stuntCoinsAwarded = 0;
    }

    // Count collected coins (track collectibles + stunt coins)
    const trackCoins = terrain && terrain.coins ? terrain.coins.filter(c => c.collected).length : 0;
    this.coinsCollected = trackCoins + (this.stuntCoins || 0);

    // Victory condition: crossed finish line at 4500m
    const meterX = vehicle.x / PHYSICS_CONSTANTS.METER_SCALE;
    if (meterX >= terrain.finishLineMeters) {
      this.state = 'VICTORY';
      this.calculateStars(vehicle);
    }
  }

  calculateStars(vehicle) {
    let s = 1;
    // 2 stars: Cargo >= 40% and Fuel > 0%
    if (vehicle.cargoIntegrity >= 40 && vehicle.fuel > 0) {
      s = 2;
    }
    // Three stars require a safe delivery, reserve fuel, and a meaningful deadline margin.
    // The 210s deadline accommodates the slower HCR-style driving pace of the 4.5 km route.
    if (vehicle.cargoIntegrity >= 70 && vehicle.fuel >= 20 && this.timeRemaining >= 30) {
      s = 3;
    }
    this.stars = s;
    return s;
  }
}

// ==========================================
// ADVANCED HYBRID AUDIO SYSTEM & CONSTANTS
// ==========================================

export const VEHICLE_AUDIO_PROFILES = {
  standard: {
    id: 'standard',
    name: 'Canter Diesel',
    idleFreq: 40,
    maxFreq: 115,
    airborneFreq: 180,
    oscType: 'sawtooth',
    real: [0, 0, 0, 0, 0, 0, 0],
    imag: [0, 1.0, 0.75, 0.55, 0.35, 0.20, 0.10],
    filterIdle: 220,
    filterMax: 780,
    filterAirborne: 1450,
    gainIdle: 0.28,
    gainGas: 0.52,
    airborneGain: 0.60,
    subHarmonic: true,
    hasTurbo: false,
    hasValveTick: false,
    qResonance: 1.4
  },
  speedy: {
    id: 'speedy',
    name: 'GranMax Bensin',
    idleFreq: 65,
    maxFreq: 215,
    airborneFreq: 260,
    oscType: 'sawtooth',
    real: [0, 0, 0, 0, 0, 0, 0],
    imag: [0, 0.9, 0.85, 0.70, 0.50, 0.35, 0.25],
    filterIdle: 380,
    filterMax: 1450,
    filterAirborne: 2200,
    gainIdle: 0.25,
    gainGas: 0.48,
    airborneGain: 0.56,
    subHarmonic: false,
    hasTurbo: false,
    hasValveTick: false,
    qResonance: 1.0
  },
  mountain: {
    id: 'mountain',
    name: 'Mountain 4x4',
    idleFreq: 38,
    maxFreq: 125,
    airborneFreq: 170,
    oscType: 'square',
    real: [0, 0, 0, 0, 0, 0, 0],
    imag: [0, 1.0, 0.25, 0.80, 0.15, 0.45, 0.08],
    filterIdle: 190,
    filterMax: 680,
    filterAirborne: 1200,
    gainIdle: 0.30,
    gainGas: 0.55,
    airborneGain: 0.62,
    subHarmonic: true,
    hasTurbo: false,
    hasValveTick: false,
    qResonance: 2.8
  },
  retro: {
    id: 'retro',
    name: 'Retro Truk Bagong',
    idleFreq: 36,
    maxFreq: 105,
    airborneFreq: 160,
    oscType: 'triangle',
    real: [0, 0, 0, 0, 0, 0, 0],
    imag: [0, 1.0, 0.55, 0.35, 0.22, 0.12, 0.05],
    filterIdle: 180,
    filterMax: 560,
    filterAirborne: 1100,
    gainIdle: 0.28,
    gainGas: 0.50,
    airborneGain: 0.58,
    subHarmonic: false,
    hasTurbo: false,
    hasValveTick: true,
    qResonance: 1.5
  },
  sport: {
    id: 'sport',
    name: 'Racing Canter Tuned',
    idleFreq: 72,
    maxFreq: 275,
    airborneFreq: 340,
    oscType: 'sawtooth',
    real: [0, 0, 0, 0, 0, 0, 0, 0],
    imag: [0, 1.0, 0.95, 0.85, 0.70, 0.55, 0.40, 0.30],
    filterIdle: 450,
    filterMax: 2100,
    filterAirborne: 2900,
    gainIdle: 0.26,
    gainGas: 0.55,
    airborneGain: 0.65,
    subHarmonic: false,
    hasTurbo: true,
    hasValveTick: false,
    qResonance: 1.8
  }
};

export const SURFACE_AUDIO_TYPES = {
  asphalt: {
    type: 'asphalt',
    filterType: 'highpass',
    freq: 1600,
    q: 1.0,
    gainMult: 0.32,
    name: 'Aspal Halus (Tire Hiss)'
  },
  soil: {
    type: 'soil',
    filterType: 'bandpass',
    freq: 650,
    q: 1.2,
    gainMult: 0.40,
    name: 'Tanah Berumput (Soil Roll)'
  },
  gravel: {
    type: 'gravel',
    filterType: 'bandpass',
    freq: 1100,
    q: 2.0,
    gainMult: 0.45,
    name: 'Kerikil Bebatuan (Gravel Crunch)'
  },
  mud: {
    type: 'mud',
    filterType: 'lowpass',
    freq: 260,
    q: 3.2,
    gainMult: 0.52,
    name: 'Lumpur Becek (Mud Suction)'
  },
  water: {
    type: 'water',
    filterType: 'bandpass',
    freq: 1250,
    q: 1.4,
    gainMult: 0.48,
    name: 'Genangan Air Rob (Water Churn)'
  },
  wood: {
    type: 'wood',
    filterType: 'bandpass',
    freq: 380,
    q: 3.8,
    gainMult: 0.46,
    name: 'Jembatan Kayu (Hollow Wood)'
  }
};

export function detectSurfaceMaterial(terrain, meterX) {
  if (!terrain) return 'asphalt';
  if (typeof terrain.isInWaterPuddle === 'function' && terrain.isInWaterPuddle(meterX)) {
    return 'water';
  }
  if (typeof terrain.isInMudPit === 'function' && terrain.isInMudPit(meterX)) {
    return 'mud';
  }
  if (terrain.logs && terrain.logs.some(l => Math.abs(l.x - meterX) < 18)) {
    return 'wood';
  }
  const biome = terrain.getBiomeAt ? terrain.getBiomeAt(meterX) : null;
  const bId = biome ? biome.id : '';
  const bName = (biome && biome.name ? biome.name.toLowerCase() : '');

  if (bId === 5 || bId === 6 || bId === 'gunung' || bId === 'tanjakan' || bName.includes('gunung') || bName.includes('tanjakan')) {
    return 'gravel';
  }
  if (bId === 3 || bId === 4 || bId === 'sawah' || bId === 'desa_sawah' || bName.includes('sawah') || bName.includes('desa')) {
    return 'soil';
  }
  if (bId === 'alas_roban' || bId === 'pinus' || bName.includes('pinus') || bName.includes('roban')) {
    return 'soil';
  }
  return 'asphalt';
}

export const TELOLET_MELODY_BASURI_V3 = [
  { f: 698.46, d: 0.16, t: 0.00, note: 'F5' },
  { f: 880.00, d: 0.16, t: 0.18, note: 'A5' },
  { f: 1046.50, d: 0.22, t: 0.36, note: 'C6' },
  { f: 1396.91, d: 0.24, t: 0.60, note: 'F6' },
  { f: 1174.66, d: 0.20, t: 0.86, note: 'D6' },
  { f: 1046.50, d: 0.22, t: 1.08, note: 'C6' },
  { f: 932.33, d: 0.18, t: 1.32, note: 'Bb5' },
  { f: 880.00, d: 0.20, t: 1.52, note: 'A5' },
  { f: 783.99, d: 0.20, t: 1.74, note: 'G5' },
  { f: 880.00, d: 0.22, t: 1.96, note: 'A5' },
  { f: 1046.50, d: 0.26, t: 2.20, note: 'C6' },
  { f: 1396.91, d: 0.85, t: 2.48, note: 'F6_VIBRATO' }
];

export const BIOME_AUDIO_CONFIG = {
  pantura: {
    type: 'ocean',
    filterFreq: 260,
    q: 1.2,
    sweepDepth: 180,
    period: 4.5,
    gain: 0.22,
    name: 'Coastal Surf'
  },
  jalur_pantura: {
    type: 'coastal_highway',
    filterFreq: 320,
    q: 1.0,
    sweepDepth: 120,
    period: 4.0,
    gain: 0.20,
    name: 'Pantura Breeze'
  },
  sawah: {
    type: 'crickets',
    filterFreq: 3800,
    q: 3.5,
    sweepDepth: 60,
    period: 2.0,
    gain: 0.18,
    name: 'Sawah Chirp & Breeze'
  },
  desa_sawah: {
    type: 'crickets',
    filterFreq: 3400,
    q: 3.0,
    sweepDepth: 50,
    period: 2.2,
    gain: 0.18,
    name: 'Rural Kampung Meadow'
  },
  alas_roban: {
    type: 'jungle',
    filterFreq: 480,
    q: 2.0,
    sweepDepth: 150,
    period: 3.8,
    gain: 0.24,
    name: 'Alas Roban Rainforest Draft'
  },
  gunung: {
    type: 'mountain_wind',
    filterFreq: 620,
    q: 4.2,
    sweepDepth: 220,
    period: 3.0,
    gain: 0.28,
    name: 'Mountain Whistling Gale'
  },
  tanjakan: {
    type: 'mountain_wind',
    filterFreq: 580,
    q: 3.8,
    sweepDepth: 200,
    period: 3.2,
    gain: 0.26,
    name: 'Highland Ridge Draft'
  },
  pinus: {
    type: 'pine_canopy',
    filterFreq: 400,
    q: 2.4,
    sweepDepth: 140,
    period: 3.6,
    gain: 0.22,
    name: 'Pine Canopy Murmur'
  },
  kota: {
    type: 'city_hum',
    filterFreq: 120,
    q: 1.5,
    sweepDepth: 40,
    period: 5.0,
    gain: 0.20,
    name: 'Metropolitan Sub-Hum'
  },
  sekolah: {
    type: 'school_morning',
    filterFreq: 350,
    q: 1.2,
    sweepDepth: 70,
    period: 4.0,
    gain: 0.18,
    name: 'School Morning Ambience'
  }
};

export class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.currentSkin = 'standard';
    this.isEngineRunning = false;

    // Persistent master nodes
    this.masterGain = null;
    this.masterCompressor = null;

    // Engine nodes
    this.engineOsc = null;
    this.engineSubOsc = null;
    this.engineFilter = null;
    this.engineGain = null;
    this.turboOsc = null;
    this.turboGain = null;
    this.lastWasGas = false;
    this.lastEngineSpeed = 0;

    // Tire surface continuous audio
    this.tireNoise = null;
    this.tireFilter = null;
    this.tireGain = null;
    this.currentSurface = 'asphalt';

    // Aerodynamic wind & Biome ambient audio
    this.windNoise = null;
    this.windFilter = null;
    this.windGain = null;
    this.ambientNoise = null;
    this.ambientFilter = null;
    this.ambientGain = null;
    this.currentBiome = 'pantura';

    // Shared noise buffer
    this.noiseBuffer = null;
    this.lastHornTime = 0;
    this.lastSpringTime = 0;
  }

  init() {
    if (typeof window === 'undefined') return;
    try {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      if (!this.masterCompressor) {
        this.setupMasterBus();
      }
      if (!this.isEngineRunning) {
        this.startContinuousAudio();
      }
    } catch (e) {
      console.warn('AudioSynthesizer init failed:', e);
    }
  }

  setupMasterBus() {
    if (!this.ctx) return;
    this.masterCompressor = this.ctx.createDynamicsCompressor();
    this.masterCompressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
    this.masterCompressor.knee.setValueAtTime(14, this.ctx.currentTime);
    this.masterCompressor.ratio.setValueAtTime(8, this.ctx.currentTime);
    this.masterCompressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    this.masterCompressor.release.setValueAtTime(0.20, this.ctx.currentTime);

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.35, this.ctx.currentTime);

    this.masterGain.connect(this.masterCompressor);
    this.masterCompressor.connect(this.ctx.destination);

    // Create 2-second pink noise buffer for tire, wind, and ambient generators
    this.noiseBuffer = this.createPinkNoiseBuffer(2.0);
  }

  createPinkNoiseBuffer(seconds = 2.0) {
    if (!this.ctx) return null;
    const bufferSize = Math.floor(this.ctx.sampleRate * seconds);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.35;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  startContinuousAudio() {
    if (!this.ctx || this.isEngineRunning) return;
    try {
      this.startEngineAudio();
      this.startTireSurfaceAudio();
      this.startWindAndAmbientAudio();
      this.isEngineRunning = true;
    } catch (e) {
      console.warn('Continuous audio start failed:', e);
    }
  }

  startEngineAudio() {
    if (!this.ctx) return;
    const profile = VEHICLE_AUDIO_PROFILES[this.currentSkin] || VEHICLE_AUDIO_PROFILES.standard;
    const now = this.ctx.currentTime;

    // Main Engine Oscillator with custom PeriodicWave or Fallback
    this.engineOsc = this.ctx.createOscillator();
    try {
      if (profile.real && profile.imag && typeof this.ctx.createPeriodicWave === 'function') {
        const wave = this.ctx.createPeriodicWave(new Float32Array(profile.real), new Float32Array(profile.imag));
        this.engineOsc.setPeriodicWave(wave);
      } else {
        this.engineOsc.type = profile.oscType || 'sawtooth';
      }
    } catch (_) {
      this.engineOsc.type = profile.oscType || 'sawtooth';
    }
    this.engineOsc.frequency.setValueAtTime(profile.idleFreq, now);

    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.setValueAtTime(profile.filterIdle, now);
    this.engineFilter.Q.setValueAtTime(profile.qResonance || 1.2, now);

    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(this.isMuted ? 0 : profile.gainIdle, now);

    this.engineOsc.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);
    this.engineOsc.start();

    // Sub-harmonic diesel rumble oscillator for heavy trucks
    if (profile.subHarmonic) {
      this.engineSubOsc = this.ctx.createOscillator();
      this.engineSubOsc.type = 'sine';
      this.engineSubOsc.frequency.setValueAtTime(profile.idleFreq * 0.5, now);
      this.engineSubOsc.connect(this.engineFilter);
      this.engineSubOsc.start();
    }

    // Turbo spool oscillator for racing/sport skin
    if (profile.hasTurbo) {
      this.turboOsc = this.ctx.createOscillator();
      this.turboOsc.type = 'sine';
      this.turboOsc.frequency.setValueAtTime(1400, now);
      this.turboGain = this.ctx.createGain();
      this.turboGain.gain.setValueAtTime(0, now);
      this.turboOsc.connect(this.turboGain);
      this.turboGain.connect(this.masterGain);
      this.turboOsc.start();
    }
  }

  setSkin(skinId) {
    if (this.currentSkin === skinId && this.engineOsc) return;
    this.currentSkin = skinId || 'standard';
    if (this.isEngineRunning) {
      this.stopEngineAudio();
      this.startEngineAudio();
    }
  }

  stopEngineAudio() {
    try {
      if (this.engineOsc) {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
        this.engineOsc = null;
      }
      if (this.engineSubOsc) {
        this.engineSubOsc.stop();
        this.engineSubOsc.disconnect();
        this.engineSubOsc = null;
      }
      if (this.turboOsc) {
        this.turboOsc.stop();
        this.turboOsc.disconnect();
        this.turboOsc = null;
      }
    } catch (_) {}
  }

  startTireSurfaceAudio() {
    if (!this.ctx || !this.noiseBuffer) return;
    this.tireNoise = this.ctx.createBufferSource();
    this.tireNoise.buffer = this.noiseBuffer;
    this.tireNoise.loop = true;

    this.tireFilter = this.ctx.createBiquadFilter();
    this.tireFilter.type = 'bandpass';
    this.tireFilter.frequency.setValueAtTime(800, this.ctx.currentTime);
    this.tireFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    this.tireGain = this.ctx.createGain();
    this.tireGain.gain.setValueAtTime(0, this.ctx.currentTime);

    this.tireNoise.connect(this.tireFilter);
    this.tireFilter.connect(this.tireGain);
    this.tireGain.connect(this.masterGain);
    this.tireNoise.start();
  }

  startWindAndAmbientAudio() {
    if (!this.ctx || !this.noiseBuffer) return;
    const now = this.ctx.currentTime;

    // Aerodynamic Wind
    this.windNoise = this.ctx.createBufferSource();
    this.windNoise.buffer = this.noiseBuffer;
    this.windNoise.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.frequency.setValueAtTime(350, now);
    this.windFilter.Q.setValueAtTime(1.8, now);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0, now);

    this.windNoise.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    this.windNoise.start();

    // Procedural Biome Ambience
    this.ambientNoise = this.ctx.createBufferSource();
    this.ambientNoise.buffer = this.noiseBuffer;
    this.ambientNoise.loop = true;

    this.ambientFilter = this.ctx.createBiquadFilter();
    this.ambientFilter.type = 'lowpass';
    this.ambientFilter.frequency.setValueAtTime(280, now);
    this.ambientFilter.Q.setValueAtTime(1.2, now);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, now);

    this.ambientNoise.connect(this.ambientFilter);
    this.ambientFilter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);
    this.ambientNoise.start();
  }

  updateEngine(speed, isGas, isAirborne = false, skinId = null) {
    if (skinId && skinId !== this.currentSkin) {
      this.setSkin(skinId);
    }
    if (!this.ctx || !this.isEngineRunning || this.isMuted) return;
    const profile = VEHICLE_AUDIO_PROFILES[this.currentSkin] || VEHICLE_AUDIO_PROFILES.standard;
    const now = this.ctx.currentTime;
    const absSpeed = Math.abs(speed);
    const speedRatio = Math.min(1.0, absSpeed / 500);

    let targetFreq = profile.idleFreq + speedRatio * (profile.maxFreq - profile.idleFreq) + (isGas ? 25 : 0);
    let targetFilter = profile.filterIdle + speedRatio * (profile.filterMax - profile.filterIdle) + (isGas ? 350 : 0);
    let targetGain = isGas ? profile.gainGas : (profile.gainIdle + speedRatio * 0.12);

    // Airborne engine over-rev
    if (isAirborne && isGas) {
      targetFreq = profile.airborneFreq || 180;
      targetFilter = profile.filterAirborne || 1450;
      targetGain = profile.airborneGain || 0.60;
    }

    if (this.engineOsc) {
      this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.05);
    }
    if (this.engineSubOsc) {
      this.engineSubOsc.frequency.setTargetAtTime(targetFreq * 0.5, now, 0.05);
    }
    if (this.engineFilter) {
      this.engineFilter.frequency.setTargetAtTime(targetFilter, now, 0.05);
    }
    if (this.engineGain) {
      this.engineGain.gain.setTargetAtTime(targetGain, now, 0.05);
    }

    // Sport turbo whistle & blow-off valve release
    if (profile.hasTurbo && this.turboOsc && this.turboGain) {
      const turboFreq = 1400 + speedRatio * 2000 + (isGas ? 600 : 0);
      const turboVol = isGas ? (0.16 + speedRatio * 0.22) : 0.001;
      this.turboOsc.frequency.setTargetAtTime(turboFreq, now, 0.08);
      this.turboGain.gain.setTargetAtTime(turboVol, now, 0.08);

      if (this.lastWasGas && !isGas && this.lastEngineSpeed > 240) {
        this.playBlowoffValve();
      }
    }

    this.lastWasGas = !!isGas;
    this.lastEngineSpeed = absSpeed;
  }

  updateSurfaceContact(speed, surfaceType = 'asphalt', onGround = true) {
    if (!this.ctx || !this.tireGain || !this.tireFilter || this.isMuted) return;
    const now = this.ctx.currentTime;
    const absSpeed = Math.abs(speed);

    if (!onGround || absSpeed < 6) {
      this.tireGain.gain.setTargetAtTime(0.0001, now, 0.08);
      return;
    }

    const mat = SURFACE_AUDIO_TYPES[surfaceType] || SURFACE_AUDIO_TYPES.asphalt;
    const speedRatio = Math.min(1.0, absSpeed / 500);
    const targetGain = mat.gainMult * (0.35 + speedRatio * 0.65);

    this.tireFilter.type = mat.filterType;
    this.tireFilter.frequency.setTargetAtTime(mat.freq + speedRatio * 250, now, 0.06);
    this.tireFilter.Q.setTargetAtTime(mat.q, now, 0.06);
    this.tireGain.gain.setTargetAtTime(targetGain, now, 0.06);

    // Random micro pebble crackle on gravel
    if (surfaceType === 'gravel' && absSpeed > 60 && Math.random() < 0.18) {
      this.playPebbleClick();
    }
  }

  updateWindAndAmbient(speed, isAirborne = false, biomeId = 'pantura') {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const absSpeed = Math.abs(speed);

    // 1. Aerodynamic Wind Whoosh
    if (this.windGain && this.windFilter) {
      let windVol = 0;
      let windFreq = 250;
      if (absSpeed > 140 || isAirborne) {
        const speedRatio = Math.min(1.0, absSpeed / 550);
        windVol = (speedRatio * 0.35) + (isAirborne ? 0.25 : 0.0);
        windFreq = 300 + speedRatio * 900 + (isAirborne ? 400 : 0);
      }
      this.windGain.gain.setTargetAtTime(windVol, now, 0.1);
      this.windFilter.frequency.setTargetAtTime(windFreq, now, 0.1);
    }

    // 2. Biome Ambient Morph
    if (this.ambientGain && this.ambientFilter) {
      const cfg = BIOME_AUDIO_CONFIG[biomeId] || BIOME_AUDIO_CONFIG.pantura;
      // Gentle cyclic oscillation (surf swell / wind wave)
      const cycle = Math.sin((now * 2 * Math.PI) / (cfg.period || 4.0));
      const targetFreq = Math.max(80, cfg.filterFreq + cycle * (cfg.sweepDepth || 100));

      this.ambientFilter.frequency.setTargetAtTime(targetFreq, now, 0.2);
      this.ambientFilter.Q.setTargetAtTime(cfg.q, now, 0.2);
      this.ambientGain.gain.setTargetAtTime(cfg.gain, now, 0.2);
    }
  }

  playBlowoffValve() {
    if (!this.ctx || this.isMuted) return;
    try {
      this.playNoiseBurst(0.30, 2200, 7000, 0.45);
    } catch (_) {}
  }

  playPebbleClick() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 1200, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (_) {}
  }

  playTeloletHorn() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    if (this.lastHornTime && (now - this.lastHornTime) < 1.4) return;
    this.lastHornTime = now;

    // Full 12-Note Basuri V3 Extended Fanfare with Dual Air-Horn Brass Acoustics
    TELOLET_MELODY_BASURI_V3.forEach((n, idx) => {
      const noteStart = now + n.t;
      const noteEnd = noteStart + n.d;

      // Primary Horn Oscillator (Sawtooth)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(n.f, noteStart);

      // Secondary Horn Oscillator (Slightly detuned for rich acoustic beating)
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(n.f * 1.004, noteStart);

      // Rich Brass Air-Horn Filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, noteStart);
      filter.Q.setValueAtTime(2.2, noteStart);

      // Final note vibrato modulation
      if (idx === TELOLET_MELODY_BASURI_V3.length - 1) {
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(5.8, noteStart); // 5.8Hz vibrato
        lfoGain.gain.setValueAtTime(18, noteStart); // +/-18Hz depth
        lfo.connect(osc1.frequency);
        lfo.connect(osc2.frequency);
        lfo.start(noteStart);
        lfo.stop(noteEnd);
      }

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.65, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);

      osc1.start(noteStart);
      osc2.start(noteStart);
      osc1.stop(noteEnd);
      osc2.stop(noteEnd);
    });
  }

  playSuspensionSpringSound() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    if (this.lastSpringTime && (now - this.lastSpringTime) < 0.22) return;
    this.lastSpringTime = now;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);

      const modOsc = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      modOsc.frequency.setValueAtTime(38, now);
      modGain.gain.setValueAtTime(45, now);
      modOsc.connect(osc.frequency);

      gain.gain.setValueAtTime(0.42, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);

      modOsc.start(now);
      osc.start(now);
      modOsc.stop(now + 0.22);
      osc.stop(now + 0.22);
    } catch (_) {}
  }

  playCoinSound() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.07);

    gain.gain.setValueAtTime(0.36, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playFuelSound() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.25);

    gain.gain.setValueAtTime(0.42, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playSplashSound() {
    if (!this.ctx || this.isMuted) return;
    this.playNoiseBurst(0.28, 600, 1800, 0.40);
  }

  playMudSound() {
    if (!this.ctx || this.isMuted) return;
    this.playNoiseBurst(0.32, 180, 450, 0.48);
  }

  playImpactSound() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.15);

    gain.gain.setValueAtTime(0.55, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playCrashSound() {
    if (!this.ctx || this.isMuted) return;
    this.playNoiseBurst(0.65, 120, 600, 0.70);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
    gain.gain.setValueAtTime(0.65, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  playVictoryFanfare() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const victoryChords = [
      { f: 523.25, d: 0.15, t: 0.00 }, // C5
      { f: 659.25, d: 0.15, t: 0.16 }, // E5
      { f: 783.99, d: 0.18, t: 0.32 }, // G5
      { f: 1046.5, d: 0.55, t: 0.50 }  // C6
    ];
    victoryChords.forEach(c => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(c.f, now + c.t);
      gain.gain.setValueAtTime(0.55, now + c.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + c.t + c.d);
      osc.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);
      osc.start(now + c.t);
      osc.stop(now + c.t + c.d);
    });
  }

  playNoiseBurst(duration, lowFreq, highFreq, volume) {
    if (!this.ctx) return;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = (lowFreq + highFreq) / 2;
      filter.Q.value = 1.2;

      const gain = this.ctx.createGain();
      gain.gain.value = volume;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain || this.ctx.destination);
      noise.start();
    } catch (_) {}
  }

  pauseEngine() {
    if (!this.ctx || !this.engineGain) return;
    this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    if (this.tireGain) this.tireGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    if (this.windGain) this.windGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
  }

  resumeEngine() {
    if (!this.ctx || !this.engineGain || this.isMuted) return;
    const profile = VEHICLE_AUDIO_PROFILES[this.currentSkin] || VEHICLE_AUDIO_PROFILES.standard;
    this.engineGain.gain.setTargetAtTime(profile.gainIdle, this.ctx.currentTime, 0.05);
  }

  stopEngine() {
    this.pauseEngine();
    this.isEngineRunning = false;
    this.stopEngineAudio();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  setMuted(muted) {
    this.isMuted = !!muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
    }
  }
}

/**
 * Maps character speaker name and emotional mood to optimized asset slug, web-safe image paths, and Tailwind gradient styles.
 */
export function getCharacterAvatarMeta(speaker = 'Tion', mood = 'normal') {
  const s = String(speaker).toLowerCase();
  const m = String(mood).toLowerCase();

  let slug = 'tion_normal';
  let gradient = 'from-sky-500/25 to-blue-700/15';
  let border = 'border-sky-400/60';
  let textColor = 'text-sky-300';

  // 1. Tion / Yon (Protagonis / Kurir MMG)
  if (s.includes('tion') || s.includes('yon') || s.includes('supir') || s.includes('kurir')) {
    gradient = 'from-sky-500/25 to-blue-700/15';
    border = 'border-sky-400/60';
    textColor = 'text-sky-300';
    if (m.includes('blush') || m.includes('shy') || m.includes('salting')) {
      slug = 'tion_blush';
    } else if (m.includes('focus') || m.includes('drive') || m.includes('menanjak')) {
      slug = 'tion_focus';
    } else {
      slug = 'tion_normal';
    }
  }
  // 2. Bu Yulie (Guru Puspa Bangsa - Batik Mega Mendung)
  else if (s.includes('yulie') || s.includes('guru')) {
    gradient = 'from-amber-400/25 to-yellow-600/15';
    border = 'border-amber-400/60';
    textColor = 'text-amber-300';
    if (m.includes('concern') || m.includes('worry') || m.includes('khawatir') || m.includes('perhatian')) {
      slug = 'bu_yulie_concern';
    } else if (m.includes('happy') || m.includes('joy') || m.includes('gembira') || m.includes('terkesan') || m.includes('laugh')) {
      slug = 'bu_yulie_happy';
    } else {
      slug = 'bu_yulie_warm';
    }
  }
  // 3. Husna (Siswi SMA Putih-Abu-Abu)
  else if (s.includes('husna') || s.includes('siswi')) {
    gradient = 'from-pink-500/25 to-cyan-500/15';
    border = 'border-pink-400/60';
    textColor = 'text-pink-300';
    if (m.includes('hungry') || m.includes('lapar') || m.includes('makan')) {
      slug = 'husna_hungry';
    } else if (m.includes('flirt') || m.includes('tease') || m.includes('kedip') || m.includes('jahil')) {
      slug = 'husna_tease';
    } else {
      slug = 'husna_cheer';
    }
  }
  // 4. Mang Abdul (Sopir Senior Veteran Safari)
  else if (s.includes('abdul') || s.includes('mang')) {
    gradient = 'from-amber-700/25 to-yellow-900/15';
    border = 'border-amber-600/60';
    textColor = 'text-amber-400';
    slug = 'mang_abdul_laugh';
  }
  // 5. Zacky (Montir Balap Merah-Hitam)
  else if (s.includes('zacky') || s.includes('montir') || s.includes('mekanik')) {
    gradient = 'from-red-600/25 to-slate-900/35';
    border = 'border-red-500/60';
    textColor = 'text-red-400';
    if (m.includes('thinking') || m.includes('analyze') || m.includes('inspeksi') || m.includes('tanya')) {
      slug = 'zacky_analyze';
    } else {
      slug = 'zacky_confident';
    }
  }

  return {
    slug,
    webpUrl: `assets/refresh/v11/characters/${slug}.webp`,
    pngUrl: `assets/refresh/v11/characters/${slug}.png`,
    gradient,
    border,
    textColor
  };
}

