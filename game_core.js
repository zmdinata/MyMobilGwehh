// game_core.js - Core Physics, Terrain, and Game Logic for MBG: Road To School
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
  AIR_PITCH_TORQUE: 4.0,    // rad/s^2; air control is deliberate rather than instant flips
  GROUND_GAS_PITCH_TORQUE: 260,
  GROUND_BRAKE_PITCH_TORQUE: 120, // sequential high-speed test: lifts rear tire while staying within recoverable pitch
  THROTTLE_RAMP_UP: 6.0,    // per second; softens launch and wheelie onset
  THROTTLE_RAMP_DOWN: 8.0,  // per second; releases engine torque promptly
  REVERSE_RAMP_UP: 4.0      // per second; prevents an abrupt reverse snap
};

export const LEVEL_CONFIGS = [
  { level: 1, name: 'Tugas Pagi Pertama', finishMeters: 3000, distanceMeters: 3000, totalMeters: 3150, timeLimit: 260, timeLimitSec: 260, checkpoints: [1500], biomes: [BIOMES.LEMBAH_SAWAH, BIOMES.DESA_SAWAH, BIOMES.SEKOLAH] },
  { level: 2, name: 'Angin Pesisir & Senyum Pertama', finishMeters: 3800, distanceMeters: 3800, totalMeters: 3950, timeLimit: 310, timeLimitSec: 310, checkpoints: [1900], biomes: [BIOMES.PESISIR_PANTURA, BIOMES.JALUR_PANTURA, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH] },
  { level: 3, name: 'Cieee Mas Tion!', finishMeters: 4600, distanceMeters: 4600, totalMeters: 4750, timeLimit: 360, timeLimitSec: 360, checkpoints: [2300], biomes: [BIOMES.DESA_SAWAH, BIOMES.LERENG_GUNUNG, BIOMES.PUNCAK_GUNUNG, BIOMES.SEKOLAH] },
  { level: 4, name: 'Setelan Bengkel Zacky', finishMeters: 5500, distanceMeters: 5500, totalMeters: 5650, timeLimit: 420, timeLimitSec: 420, checkpoints: [2700], biomes: [BIOMES.JALUR_PANTURA, BIOMES.LEMBAH_SAWAH, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH] },
  { level: 5, name: 'Hujan Gerimis Pantura', finishMeters: 6500, distanceMeters: 6500, totalMeters: 6650, timeLimit: 480, timeLimitSec: 480, checkpoints: [2200, 4400], biomes: [BIOMES.LERENG_GUNUNG, BIOMES.PUNCAK_GUNUNG, BIOMES.DESA_SAWAH, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH] },
  { level: 6, name: 'Kubangan Lumpur Terasering', finishMeters: 7500, distanceMeters: 7500, totalMeters: 7650, timeLimit: 540, timeLimitSec: 540, checkpoints: [2500, 5000], biomes: [BIOMES.LEMBAH_SAWAH, BIOMES.LERENG_GUNUNG, BIOMES.PUNCAK_GUNUNG, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH] },
  { level: 7, name: 'Botol Air Minum Bu Yulie', finishMeters: 8600, distanceMeters: 8600, totalMeters: 8750, timeLimit: 600, timeLimitSec: 600, checkpoints: [2800, 5700], biomes: [BIOMES.PUNCAK_GUNUNG, BIOMES.LERENG_GUNUNG, BIOMES.PESISIR_PANTURA, BIOMES.JALUR_PANTURA, BIOMES.SEKOLAH] },
  { level: 8, name: 'Misi Mak Comblang Husna', finishMeters: 9800, distanceMeters: 9800, totalMeters: 9950, timeLimit: 670, timeLimitSec: 670, checkpoints: [3200, 6500], biomes: [BIOMES.PESISIR_PANTURA, BIOMES.DESA_SAWAH, BIOMES.LERENG_GUNUNG, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH] },
  { level: 9, name: 'Uji Shockbreaker Anyar', finishMeters: 11000, distanceMeters: 11000, totalMeters: 11150, timeLimit: 740, timeLimitSec: 740, checkpoints: [3600, 7300], biomes: [BIOMES.JALUR_PANTURA, BIOMES.PUNCAK_GUNUNG, BIOMES.LEMBAH_SAWAH, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH] },
  { level: 10, name: 'Petuah Sang Legenda Mang Abdul', finishMeters: 12500, distanceMeters: 12500, totalMeters: 12650, timeLimit: 820, timeLimitSec: 820, checkpoints: [4000, 8300], biomes: [BIOMES.DESA_SAWAH, BIOMES.PESISIR_PANTURA, BIOMES.PUNCAK_GUNUNG, BIOMES.LERENG_GUNUNG, BIOMES.SEKOLAH] },
  { level: 11, name: 'Tanjakan Kabut Perbukitan', finishMeters: 13800, distanceMeters: 13800, totalMeters: 13950, timeLimit: 890, timeLimitSec: 890, checkpoints: [4500, 9200], biomes: [BIOMES.LERENG_GUNUNG, BIOMES.LEMBAH_SAWAH, BIOMES.DESA_SAWAH, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH] },
  { level: 12, name: 'Melayang Demi Bu Guru', finishMeters: 15000, distanceMeters: 15000, totalMeters: 15150, timeLimit: 960, timeLimitSec: 960, checkpoints: [5000, 10000], biomes: [BIOMES.PESISIR_PANTURA, BIOMES.JALUR_PANTURA, BIOMES.PUNCAK_GUNUNG, BIOMES.LERENG_GUNUNG, BIOMES.SEKOLAH] },
  { level: 13, name: 'Surat Rantang Rahasia', finishMeters: 16500, distanceMeters: 16500, totalMeters: 16650, timeLimit: 1040, timeLimitSec: 1040, checkpoints: [4200, 8500, 12600], biomes: [BIOMES.LEMBAH_SAWAH, BIOMES.PUNCAK_GUNUNG, BIOMES.PESISIR_PANTURA, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH] },
  { level: 14, name: 'Pipi Merah di Ruang Guru', finishMeters: 17800, distanceMeters: 17800, totalMeters: 17950, timeLimit: 1110, timeLimitSec: 1110, checkpoints: [4500, 9000, 13500], biomes: [BIOMES.DESA_SAWAH, BIOMES.LERENG_GUNUNG, BIOMES.JALUR_PANTURA, BIOMES.PUNCAK_GUNUNG, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH] },
  { level: 15, name: 'Batu Curam & Mesin Stage 15', finishMeters: 19000, distanceMeters: 19000, totalMeters: 19150, timeLimit: 1180, timeLimitSec: 1180, checkpoints: [4800, 9600, 14400], biomes: [BIOMES.PUNCAK_GUNUNG, BIOMES.LERENG_GUNUNG, BIOMES.LEMBAH_SAWAH, BIOMES.DESA_SAWAH, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH] },
  { level: 16, name: 'Payung Teduh di Depan Gerbang', finishMeters: 20200, distanceMeters: 20200, totalMeters: 20350, timeLimit: 1250, timeLimitSec: 1250, checkpoints: [5000, 10100, 15200], biomes: [BIOMES.PESISIR_PANTURA, BIOMES.LEMBAH_SAWAH, BIOMES.LERENG_GUNUNG, BIOMES.PUNCAK_GUNUNG, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH] },
  { level: 17, name: 'Dukungan Penuh Zacky & Husna', finishMeters: 21500, distanceMeters: 21500, totalMeters: 21650, timeLimit: 1320, timeLimitSec: 1320, checkpoints: [5300, 10700, 16100], biomes: [BIOMES.JALUR_PANTURA, BIOMES.DESA_SAWAH, BIOMES.LERENG_GUNUNG, BIOMES.PUNCAK_GUNUNG, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH] },
  { level: 18, name: 'Tanjakan Penentu Nyali', finishMeters: 22800, distanceMeters: 22800, totalMeters: 22950, timeLimit: 1390, timeLimitSec: 1390, checkpoints: [5600, 11300, 17100], biomes: [BIOMES.LEMBAH_SAWAH, BIOMES.DESA_SAWAH, BIOMES.PESISIR_PANTURA, BIOMES.LERENG_GUNUNG, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH] },
  { level: 19, name: 'Persiapan Pesta Gizi Akbar', finishMeters: 24000, distanceMeters: 24000, totalMeters: 24150, timeLimit: 1460, timeLimitSec: 1460, checkpoints: [5800, 11800, 17900], biomes: [BIOMES.LERENG_GUNUNG, BIOMES.PUNCAK_GUNUNG, BIOMES.JALUR_PANTURA, BIOMES.DESA_SAWAH, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH] },
  { level: 20, name: 'Rute Pamungkas: Demi Bu Guru Tercinta', finishMeters: 25000, distanceMeters: 25000, totalMeters: 25150, timeLimit: 1520, timeLimitSec: 1520, checkpoints: [5000, 10000, 15000, 20000], biomes: [BIOMES.PESISIR_PANTURA, BIOMES.JALUR_PANTURA, BIOMES.LEMBAH_SAWAH, BIOMES.DESA_SAWAH, BIOMES.LERENG_GUNUNG, BIOMES.PUNCAK_GUNUNG, BIOMES.PEMUKIMAN, BIOMES.SEKOLAH] }
];

export const STORY_DIALOGUES = {
  1: {
    intro: [
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Tion, tugas perdana lu bawa armada MBG 500 porsi! Rutenya lempang pesisir Pantura, tapi angin laut kencang. Gas itu keberanian, rem itu kebijaksanaan, bawa kargo aman itu kehormatan!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'Siap Mang Abdul! Nasi pulen karbohidrat kompleks 150 gram per porsi (total ~650 kkal AKG Kemenkes) aman terkunci di boks pemanas. Biar adik-adik SD Puspa Bangsa bertenaga penuh!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Selamat pagi! Mas Tion ya? Masya Allah, harum sekali makanannya tiba masih mengepul hangat tepat waktu. Terima kasih banyak ya Mas...' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: '(D-duh Gusti... senyumnya Bu Yulie manis banget, pipiku langsung panas merona, rpm jantung mendadak tembus redline 9000!) S-sama-sama Bu Yulie!' }
    ]
  },
  2: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Pagi Jon! Menu hari ini ayam serundeng lengkuas. Ayam punya 22g protein hewani berkualitas per 100g buat regenerasi jaringan sel anak-anak. Ban udah gua setel cengkeramannya biar gak selip di jalan asin pesisir!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'Mantap Zack! Semangat antar nutrisi tinggi buat Bu Yulie... eh, maksudnya buat murid-murid di sekolah Puspa Bangsa!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Mas Tion kelihatan keringetan sekali? Ini saya buatkan teh melati hangat dari ruang guru, diminum dulu Mas biar gak dehidrasi.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'E-eh Bu Yulie repot-repot... (Pas nerima cangkir teh, jari kita sempat bersentuhan... rasanya kayak kesetrum voltase aki 24 volt!)' }
    ]
  },
  3: {
    intro: [
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'flirt', text: 'Hahaha Mas Tion! Dari kejauhan nada klakson telolet armada MBG udah ketebak banget! Buruan Mas, Bu Yulie dari tadi bolak-balik liat jam nungguin Mas Tion lho~' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Husna! Jangan godain di jalan raya dong! Hari ini ada tempe orek manis & tahu bacem, protein nabati fermentasi kaya isoflavon dan serat probiotik pencegah stunting!' }
    ],
    outro: [
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'flirt', text: 'Cieee Mas Tion! Pas serah terima ompreng matanya salting ke mana-mana sampai nabrak pintu! Mau aku comblangin resmi sama Bu Yulie gak nih?' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'Hush Husna! Ssst, ngomongnya kenceng amat, malu didenger guru lain dan bapak kepala sekolah tau!' }
    ]
  },
  4: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Rute mulai masuk persawahan gembur Jon! Sayur lodeh labu siam dan daun melinjo ini kaya serat pangan, vitamin A, dan folat. Bejek gas halus biar kuah lodeh gak tumpah di kubangan tanah!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Siap mekanik andalan! Rantang gizi bersekat ganda udah terkunci rapat. Demi gizi seimbang anak bangsa, lumpur pematang sawah kita libas!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Alhamdulillah sayur lodehnya masih segar dan hangat sempurna. Mas Tion hebat sekali bisa menyeimbangkan truk katering di jalan sawah yang bergelombang.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'B-berkat doa restu Bu Yulie... eh maksud saya berkat doa keselamatan di jalan raya Bu!' }
    ]
  },
  5: {
    intro: [
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Tion! Rute lumpur terasering makin licin! Ingat ilmu Mang Abdul: licinnya jalanan itu kayak ujian asmara, kalau panik lu ngepot terbalik, kalau tenang lu selamat! Bawa bandeng presto tanpa durinya utuh!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Siap Mang Abdul! Bandeng presto khas Pantura kaya asam lemak omega-3 EPA & DHA 1200mg buat ketajaman daya pikir murid-murid harus tiba selamat!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Murid-murid lahap sekali makan bandeng presto tanpa durinya! Bodi truk Mas Tion penuh cipratan lumpur perjuangan, tapi paket makanannya tetap bersih higienis.' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'flirt', text: 'Keringat Mas Tion bau dedikasi pahlawan katering ya Bu Guru? Hihihi!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: '(Husna beneran gak ada remnya, tapi Bu Yulie malah tertawa manis... adem banget hati ini!)' }
    ]
  },
  6: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'thinking', text: 'Jon, ada rintangan balok kayu di jalur irigasi! Menu hari ini telur rebus balado bumbu tomat segar, kaya kolin 147mg buat pembentukan sel memori otak. Jaga kompresi suspensi pas mendarat!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Per dan damper racikan lu udah gua kalibrasi Zack! Telur balado kaya albumin ini bakal mendarat bulat utuh tanpa retak sedikit pun!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Mas Tion, ini saya bawakan handuk kecil bersih. Keringat di dahi diseka dulu Mas, nanti masuk angin kalau kena angin persawahan.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: '(Aroma lavender di handuk Bu Yulie lembut sekali... rasanya mau melayang saking saltingnya!)' }
    ]
  },
  7: {
    intro: [
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'hungry', text: 'Mas Tion! Tanjakan bukit jati di depan lumayan terjal lho! Muatan pisang raja dan jeruk manis lokal jangan sampai menggelinding keluar ya!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'Tenang Husna! Buah segar ini kaya kalium 350mg dan vitamin C 45mg sebagai antioksidan alami biar kalian gak gampang flu pas pergantian cuaca!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Jeruknya manis dan segar sekali Mas Tion. Saya perhatikan Mas Tion selalu memastikan porsi nutrisi anak-anak tercukupi dengan penuh ketulusan hati.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'M-melihat senyuman Bu Yulie dan keceriaan murid-murid adalah vitamin terhebat bagi saya di dunia Bu...' }
    ]
  },
  8: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Bebatuan lepas di hutan jati bisa bikin mobil mental kalau redaman shockbreaker lu kaku, Jon! Sayur bening bayam jagung manis ini sumber zat besi, lutein, dan zeaxanthin buat kesehatan retina mata. Atur throttle seimbang!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Grip ban level 8 siap mencengkeram bebatuan terjal Zack! Paket sayur bayam segar bakal tiba tepat waktu!' }
    ],
    outro: [
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'cheer', text: 'Mas Tion! Tadi Bu Yulie cerita ke guru lain, katanya Mas Tion itu pria paling gigih, tepat janji, dan berhati lembut yang pernah beliau kenal!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'B-beneran Husna?! Jangan bikin aku kepikiran seharian lho, jantungku bisa copot dari dada nih!' }
    ]
  },
  9: {
    intro: [
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Tion! Rute perkebunan kopi mulai menanjak tajam! Susu murni pasteurisasi dari peternakan sapi lokal Kuningan di boks pendingin harus aman! Kalsium 300mg dan vitamin D itu investasi tulang anak bangsa!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Siap Mang Abdul! Susu pasteurisasi dingin terjaga higienis di 4 derajat Celsius. Bodi aerodinamis siap melesat menanjak!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Susunya segar dan gurih sekali, anak-anak langsung menghabiskannya sampai tetes terakhir. Mas Tion, terima kasih ya sudah selalu berjuang sejauh ini...' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'Demi senyuman Bu Guru dan masa depan anak-anak, mendaki bukit terjal pun saya lakoni dengan setulus hati!' }
    ]
  },
  10: {
    intro: [
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Udah level 10, Tion! Separuh perjalanan! Ingat filosofi Mang Abdul: di tanjakan terjal jangan bernafsu geber gas pol, jaga momentum dan putaran mesin! Ngedeketin cewek juga sama, jangan terburu-buru tapi harus konsisten!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'Petuah emas Mang Abdul selalu meresap di sanubari! Hari ini ada capcay sayur pelangi kaya beta-karoten, likopen, dan vitamin K pembekuan darah sehat!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Sudah sepuluh trayek Mas Tion selalu hadir tepat waktu sebelum bel istirahat berbunyi. Ini ada bekal sarapan kecil buatan saya, dinikmati ya Mas.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: '(M-masakan buatan tangan Bu Yulie sendiri?! Ya ampun... ini hari paling indah dalam sejarah hidupku!)' }
    ]
  },
  11: {
    intro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'concern', text: 'Mas Tion, kabut pagi di lereng Gunung Ciremai sangat tebal dan dingin. Jangan memaksakan kecepatan ya Mas, keselamatan Mas Tion nomor satu bagi kami...' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'Didengar Bu Yulie sekhawatir itu... dinginnya kabut langsung kalah sama hangatnya hati ini! Semur daging sapi kaya zat besi heme bioavailable tinggi siap meluncur aman!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Melihat sorot lampu kabut truk Mas Tion menembus kabut tebal tadi, hati saya rasanya langsung tenang dan lega luar biasa...' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'Sorot lampu ini selalu terarah ke gerbang sekolah tempat Bu Yulie berdiri menyambut saya...' }
    ]
  },
  12: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'thinking', text: 'Tanjakan Grade 12 ini dijuluki Tanjakan Gigi Satu Jon! Lu butuh torsi mesin besar! Menu tumis buncis tempe giling ini indeks glikemiknya rendah, bikin energi anak-anak stabil tanpa mengantuk sehabis makan siang!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Tenaga mesin upgrade bengkel lu terbukti perkasa Zack! Tanjakan ekstrem ini bakal kita taklukkan dengan sempurna!' }
    ],
    outro: [
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'cheer', text: 'Keren banget tadi pas mobil Mas Tion mendarat mulus di tanjakan atas! Udah kayak stuntman profesional! Bu Yulie sampai tepuk tangan bangga lho!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'Yang paling penting nutrisi anak-anak mendarat utuh tanpa tumpah setetes kuah pun!' }
    ]
  },
  13: {
    intro: [
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'flirt', text: 'Mas Tion! Pepes ikan mas kemanginya harum banget! Husna selipin amplop pantun titipan Mas Tion di rantang makan siang Bu Yulie ya?' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'Ehhh Husna jangan sembarangan! Amplop pantun yang mana?! Aduh bisa copot jantungku kalau Bu Yulie baca sekarang!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Mas Tion... amplop kecil berisi pantun di samping rantang ini... "Jalan berliku di lereng Ciremai, melihat senyum Bu Guru hati pun damai"... Mas Tion yang tulis ya?' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: '(Gawat Husna beneran nekat! Muka merah padam kayak kepiting rebus!) E-eh... iya Bu... mohon maaf kalau lancang...' },
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Pantunnya indah dan tulus sekali kok Mas... terima kasih ya.' }
    ]
  },
  14: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Rute panjang 2800 meter melintasi 6 bioma Jon! Sambal goreng hati sapi dan kentang dadu ini gudangnya vitamin B12 dan asam folat pembentuk sel darah merah pencegah anemia. Jaga kestabilan di tikungan hairpin tebing!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Suspensi anti-roll dan traksi ban prima bikin mobil anteng meliuk di kelokan tebing! Gas pol!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Anak-anak perempuan di kelas memuji sambal goreng hatinya sangat empuk dan bumbunya pas. Mas Tion memang kurir paling berdedikasi.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'Apalagi kalau kurirnya dapat senyuman manis dari Bu Guru setiap hari, tenaganya berlipat ganda berkali-kali lipat Bu!' }
    ]
  },
  15: {
    intro: [
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Angin lembah bertiup kencang di jembatan tebing, Tion! Ingat petuah Mang Abdul: sop ayam kaldu hangat ini butuh keseimbangan bodi tingkat dewa. Miring sedikit kuah tumpah! Rilekskan tangan di kemudi!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Siap Mang Abdul! Sop ayam kampung makaroni kaya kolagen alami 1500mg dan elektrolit ini bakal sampai di mangkok murid-murid dalam suhu prima!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Di udara dingin pegunungan begini, kuah kaldu hangat Mas Tion menghangatkan seluruh sekolah. Sungguh berkah yang luar biasa...' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'Dan kehangatan tutur kata Bu Yulie menghangatkan jiwa saya sepanjang hari...' }
    ]
  },
  16: {
    intro: [
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'cheer', text: 'Mas Tion, bocoran berharga! Hari ini Bu Yulie ulang tahun lho! Puding agar-agar melon dan chia seed kaya serat pektin pencernaan ini segar banget, ada kado spesial gak buat Bu Guru?' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'Wah serius?! Hari ini aku harus bawa pengantaran paling mulus, tanpa keterlambatan satu detik pun demi hari bahagia Bu Yulie!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Mas Tion sampai basah kuyup kena gerimis demi mengantar puding ulang tahun ini? Mari payungan berdua masuk ke ruang guru, saya ambilkan handuk bersih...' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: '(Payungan berdua langkah demi langkah... rasanya dunia serasa milik berdua!)' }
    ]
  },
  17: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Jalur bypass lurus panjang Jon! Waktunya buktikan top speed mesin bertenaga tinggi! Opor ayam kampung bumbu rempah kunyit ini kaya kurkumin antiinflamasi alami pemelihara imunitas tubuh dari kuman penyakit. Gaskeun!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Top speed tinggi siap kita pacu tanpa kompromi pada keselamatan 500 porsi paket gizi hangat!' }
    ],
    outro: [
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'cheer', text: 'Mas Tion, besok adalah hari terakhir semester dan festival gizi akbar! Jangan jadi kurir pengecut ya, utarakan isi hatimu ke Bu Yulie besok!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'Husnaaa! Jangan teriak-teriak! Tapi... doakan ya Husna, besok aku bakal beranikan diri...' }
    ]
  },
  18: {
    intro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'concern', text: 'Mas Tion, cuaca pesisir hari ini sangat bersahabat dengan semburat senja keemasan. Sayur asem Sunda segar jagung manis kaya mineral magnesium dan asam organik pemulih stamina siap dinikmati anak-anak.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Siap Bu Yulie! Bodi aerodinamis dan ban berpola cengkeram tinggi siap menerjang angin senja mengantarkan nutrisi terbaik!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Mas Tion... besok setelah pesta perayaan 500 porsi MBG selesai... ada yang ingin saya bicarakan berdua di taman sekolah...' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: '(Deg-degan luar biasa! Apakah impian hatiku selama ini bakal terwujud besok? Ya Allah, berkahilah perjalananku!)' }
    ]
  },
  19: {
    intro: [
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Besok hari penentuan, Tion! Hari ini gladi resik rute terberat 24.000 meter! Ingat petuah Mang Abdul: sopir sejati gak cuma piawai tancap gas di aspal, tapi juga punya keberanian sejati memperjuangkan cinta hidupnya!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Siap Mang Abdul! Rantang komplit 4 Sehat 5 Sempurna MBG (680 kkal standar Kemenkes RI AKG makan siang) siap kita antarkan tanpa kurang sebutir nasi pun!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Semua persiapan pesta akbar besok sempurna berkat kerja keras dan ketulusan Mas Tion. Saya menunggu kehadiran Mas Tion di garis finis besok ya...' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'Pasti Bu Yulie! Saya akan tiba dengan armada terbaik dan kargo cinta paling tulus!' }
    ]
  },
  20: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Ini dia Grand Finale Jon! 20 level udah lu taklukkan! Bodi truk baru berkilau, mesin bertenaga 3720 watt, ban mencengkeram tanah dengan sempurna!' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'cheer', text: 'Seluruh murid SD, SMP, SMA Puspa Bangsa udah berkumpul bawa spanduk selamat datang Mas Tion sang pahlawan gizi!' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Buktikan jiwa kesatria kurir MBG Pantura sejati! Gas itu keberanian, rem itu kebijaksanaan, cinta Bu Yulie itu tujuan akhirmu! Berangkatkan kargo cintamu, Tion!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'BISMILLAH! GAS POLLL DEMI GIZI 500 SISWA DAN CINTA SEJATI BU YULIE!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Mas Tion... selama 20 perjalanan penuh tantangan ini, saya melihat ketulusan, tanggung jawab, dan kebaikan hati Mas Tion. Hari ini di depan seluruh sekolah, saya menerima perasaan Mas Tion...' },
      { speaker: 'Husna', role: 'Siswi SMA Puspa Bangsa', mood: 'cheer', text: 'HOREEEE! AKHIRNYA MAS TION GAK JOMBLO LAGI! MAKAN GIZI GRATIS SETIAP HARI!' },
      { speaker: 'Zacky', role: 'Montir Garasi Zacky', mood: 'craftsman', text: 'Selamat Jon! Lu resmi dinobatkan jadi Pahlawan Logistik Gizi dan Juara Cinta Pantura!' },
      { speaker: 'Mang Abdul', role: 'Sopir Senior Pantura', mood: 'wise', text: 'Air mata bahagia Mang Abdul tumpah ruah... ini kemenangan terindah seorang sopir sejati!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'happy', text: 'Alhamdulillah ya Allah... terima kasih semuanya! Misi MBG Sukses Sempurna, dan cintaku berlabuh di hati Bu Guru tercinta!' }
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
        const bStart = boundary - 60;
        const bEnd = boundary + 60;
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
    const slopeScale = this.levelConfig ? (1 + (this.levelConfig.level - 1) * 0.028) : 1.0;
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
      const flipName = totalFlips > 1 ? `${totalFlips}x ${isBackflip ? 'BACKFLIP' : 'FRONTFLIP'}` : (isBackflip ? 'BACKFLIP' : 'FRONTFLIP');
      this.stuntMessage = `${flipName}! ⭐`;
      this.stuntTimer = 1.8;
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

    // Count collected coins
    this.coinsCollected = terrain.coins.filter(c => c.collected).length;

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
