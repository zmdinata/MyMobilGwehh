// game_core.js - Core Physics, Terrain, and Game Logic for MBG: Road To School
// Pure ES module for testing and browser integration.

export const BIOMES = {
  PANTURA: { id: 1, name: 'Pesisir Jalur Pantura', start: 0, end: 1200 },
  SAWAH: { id: 2, name: 'Pesawahan Terasering Hijau', start: 1200, end: 2800 },
  GUNUNG: { id: 3, name: 'Tanjakan Gunung & Kebun Teh', start: 2800, end: 4200 },
  SEKOLAH: { id: 4, name: 'Suburb Cirebon & Finis SD SMP SMA Puspa Bangsa', start: 4200, end: 4600 }
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
  { level: 1, name: 'Tugas Pagi Pertama', finishMeters: 800, distanceMeters: 800, totalMeters: 900, timeLimit: 90, timeLimitSec: 90, biomes: [BIOMES.PANTURA, BIOMES.SEKOLAH] },
  { level: 2, name: 'Angin Pesisir & Senyum Pertama', finishMeters: 900, distanceMeters: 900, totalMeters: 1000, timeLimit: 95, timeLimitSec: 95, biomes: [BIOMES.PANTURA, BIOMES.SEKOLAH] },
  { level: 3, name: 'Cieee Mas Tion!', finishMeters: 1000, distanceMeters: 1000, totalMeters: 1100, timeLimit: 100, timeLimitSec: 100, biomes: [BIOMES.PANTURA, BIOMES.SAWAH, BIOMES.SEKOLAH] },
  { level: 4, name: 'Setelan Bengkel Zacky', finishMeters: 1100, distanceMeters: 1100, totalMeters: 1200, timeLimit: 105, timeLimitSec: 105, biomes: [BIOMES.PANTURA, BIOMES.SAWAH, BIOMES.SEKOLAH] },
  { level: 5, name: 'Hujan Gerimis Pantura', finishMeters: 1200, distanceMeters: 1200, totalMeters: 1300, timeLimit: 110, timeLimitSec: 110, biomes: [BIOMES.PANTURA, BIOMES.SAWAH, BIOMES.SEKOLAH] },
  { level: 6, name: 'Kubangan Lumpur Terasering', finishMeters: 1350, distanceMeters: 1350, totalMeters: 1450, timeLimit: 120, timeLimitSec: 120, biomes: [BIOMES.SAWAH, BIOMES.PANTURA, BIOMES.SEKOLAH] },
  { level: 7, name: 'Botol Air Minum Bu Yulie', finishMeters: 1500, distanceMeters: 1500, totalMeters: 1600, timeLimit: 125, timeLimitSec: 125, biomes: [BIOMES.PANTURA, BIOMES.SAWAH, BIOMES.GUNUNG, BIOMES.SEKOLAH] },
  { level: 8, name: 'Misi Mak Comblang Husna', finishMeters: 1650, distanceMeters: 1650, totalMeters: 1750, timeLimit: 130, timeLimitSec: 130, biomes: [BIOMES.SAWAH, BIOMES.GUNUNG, BIOMES.PANTURA, BIOMES.SEKOLAH] },
  { level: 9, name: 'Uji Shockbreaker Anyar', finishMeters: 1800, distanceMeters: 1800, totalMeters: 1900, timeLimit: 135, timeLimitSec: 135, biomes: [BIOMES.GUNUNG, BIOMES.SAWAH, BIOMES.PANTURA, BIOMES.SEKOLAH] },
  { level: 10, name: 'Petuah Sang Legenda Mang Ucup', finishMeters: 2000, distanceMeters: 2000, totalMeters: 2100, timeLimit: 140, timeLimitSec: 140, biomes: [BIOMES.PANTURA, BIOMES.SAWAH, BIOMES.GUNUNG, BIOMES.SEKOLAH] },
  { level: 11, name: 'Tanjakan Kabut Perbukitan', finishMeters: 2200, distanceMeters: 2200, totalMeters: 2300, timeLimit: 150, timeLimitSec: 150, biomes: [BIOMES.SAWAH, BIOMES.GUNUNG, BIOMES.SAWAH, BIOMES.GUNUNG, BIOMES.SEKOLAH] },
  { level: 12, name: 'Melayang Demi Bu Guru', finishMeters: 2400, distanceMeters: 2400, totalMeters: 2500, timeLimit: 155, timeLimitSec: 155, biomes: [BIOMES.PANTURA, BIOMES.GUNUNG, BIOMES.SAWAH, BIOMES.GUNUNG, BIOMES.SEKOLAH] },
  { level: 13, name: 'Surat Rantang Rahasia', finishMeters: 2600, distanceMeters: 2600, totalMeters: 2700, timeLimit: 160, timeLimitSec: 160, biomes: [BIOMES.GUNUNG, BIOMES.SAWAH, BIOMES.PANTURA, BIOMES.GUNUNG, BIOMES.SEKOLAH] },
  { level: 14, name: 'Pipi Merah di Ruang Guru', finishMeters: 2800, distanceMeters: 2800, totalMeters: 2900, timeLimit: 170, timeLimitSec: 170, biomes: [BIOMES.PANTURA, BIOMES.SAWAH, BIOMES.GUNUNG, BIOMES.SAWAH, BIOMES.GUNUNG, BIOMES.SEKOLAH] },
  { level: 15, name: 'Batu Curam & Mesin Stage 15', finishMeters: 3000, distanceMeters: 3000, totalMeters: 3100, timeLimit: 175, timeLimitSec: 175, biomes: [BIOMES.GUNUNG, BIOMES.SAWAH, BIOMES.GUNUNG, BIOMES.PANTURA, BIOMES.GUNUNG, BIOMES.SEKOLAH] },
  { level: 16, name: 'Payung Teduh di Depan Gerbang', finishMeters: 3300, distanceMeters: 3300, totalMeters: 3400, timeLimit: 180, timeLimitSec: 180, biomes: [BIOMES.PANTURA, BIOMES.GUNUNG, BIOMES.SAWAH, BIOMES.GUNUNG, BIOMES.SAWAH, BIOMES.SEKOLAH] },
  { level: 17, name: 'Dukungan Penuh Zacky & Husna', finishMeters: 3600, distanceMeters: 3600, totalMeters: 3700, timeLimit: 190, timeLimitSec: 190, biomes: [BIOMES.SAWAH, BIOMES.GUNUNG, BIOMES.PANTURA, BIOMES.SAWAH, BIOMES.GUNUNG, BIOMES.PANTURA, BIOMES.SEKOLAH] },
  { level: 18, name: 'Tanjakan Penentu Nyali', finishMeters: 3900, distanceMeters: 3900, totalMeters: 4000, timeLimit: 195, timeLimitSec: 195, biomes: [BIOMES.GUNUNG, BIOMES.SAWAH, BIOMES.GUNUNG, BIOMES.PANTURA, BIOMES.GUNUNG, BIOMES.SAWAH, BIOMES.SEKOLAH] },
  { level: 19, name: 'Persiapan Pesta Gizi Akbar', finishMeters: 4200, distanceMeters: 4200, totalMeters: 4300, timeLimit: 200, timeLimitSec: 200, biomes: [BIOMES.PANTURA, BIOMES.SAWAH, BIOMES.GUNUNG, BIOMES.PANTURA, BIOMES.SAWAH, BIOMES.GUNUNG, BIOMES.SAWAH, BIOMES.SEKOLAH] },
  { level: 20, name: 'Rute Pamungkas: Demi Bu Guru Tercinta', finishMeters: 4500, distanceMeters: 4500, totalMeters: 4600, timeLimit: 210, timeLimitSec: 210, biomes: [BIOMES.PANTURA, BIOMES.SAWAH, BIOMES.GUNUNG, BIOMES.SEKOLAH] }
];

export const STORY_DIALOGUES = {
  1: {
    intro: [
      { speaker: 'Mang Ucup', role: 'Sopir Senior', mood: 'wise', text: 'Tion, hari ini tugas perdana lu bawa armada MBG. Rutenya lempang pesisir Pantura, tapi jangan lengah!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'Siap Mang Ucup! 500 porsi paket gizi hangat aman terkunci di boks belakang. Gaskeun!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Selamat pagi! Mas Tion ya? Terima kasih banyak ya, kiriman makanannya tiba tepat waktu.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: '(A-aduh manis banget senyumnya... jantungku kok malah balapan melebihi rpm mesin!)' }
    ]
  },
  2: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Jenius', mood: 'craftsman', text: 'Gimana armada kemarin, Jon? Masih enak kan tarikannya? Rajin-rajin kumpulin koin gizi di jalan buat modal upgrade!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'Aman Zack! Pagi ini hawanya sejuk, semangat antar makanan ke Bu Yulie... eh, maksudnya ke sekolah!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Mas Tion kelihatan keringetan? Ini ada teh manis hangat dari ruang guru, diminum dulu Mas.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'E-eh, terima kasih banyak Bu Yulie... berkah banget rasanya pagi-pagi begini.' }
    ]
  },
  3: {
    intro: [
      { speaker: 'Husna', role: 'Siswi SMA', mood: 'flirt', text: 'Hehehe, Mas Tion! Dari kejauhan suara klakson teloletnya udah ketebak banget!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Husna! Jangan nongkrong di pinggir jalan, nanti telat masuk kelas lho!' }
    ],
    outro: [
      { speaker: 'Husna', role: 'Siswi SMA', mood: 'flirt', text: 'Cieee Mas Tion! Matanya curi-curi pandang ke Bu Yulie mulu. Mau aku comblangin gak nih?' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'Hush! Husna ngomongnya kenceng amat, malu didenger guru lain tau!' }
    ]
  },
  4: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Jenius', mood: 'craftsman', text: 'Hari ini rute mulai masuk area persawahan, Jon. Tanahnya gembur dan licin, lu butuh grip ban lebih mantap!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Untung koin gizi kemarin udah kekumpul buat poles grip di bengkel lu, Zack!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Anak-anak suka sekali menu hari ini, Mas Tion. Sayur lodeh dan ayam serundengnya gurih hangat!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'Alhamdulillah Bu! Selama Bu Yulie dan murid-murid suka, saya gas terus sekuat tenaga!' }
    ]
  },
  5: {
    intro: [
      { speaker: 'Mang Ucup', role: 'Sopir Senior', mood: 'wise', text: 'Langit mendung di atas pesisir, Tion. Jalanan aspal basah gampang bikin mobil melintir. Mainkan pedal rem sehalus sutra!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Siap Mang Ucup, kestabilan mobil dan keamanan kargo gizi nomor satu!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'concern', text: 'Untung Mas Tion tiba sebelum hujan lebat turun. Hati-hati ya Mas kalau jalanan licin.' },
      { speaker: 'Husna', role: 'Siswi SMA', mood: 'flirt', text: 'Tuh kan Mas Tion! Bu Yulie dari tadi nengok ke pintu gerbang terus nungguin Mas Tion!' }
    ]
  },
  6: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Jenius', mood: 'thinking', text: 'Kubangan lumpur di persawahan depan cukup dalam, Jon! Jangan asal bejek gas biar ban gak slip di tempat!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Fokus penuh! Rantang gizi gak boleh ada yang terciprat lumpur kotor!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Hebat sekali! Bodi truknya penuh cipratan lumpur, tapi ompreng makanannya tetap higienis dan rapi.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'Dedikasi kurir gizi sejati, Bu Yulie! Bersih di dalam, tangguh di luar.' }
    ]
  },
  7: {
    intro: [
      { speaker: 'Husna', role: 'Siswi SMA', mood: 'hungry', text: 'Mas Tion! Tadi Bu Yulie nitip pesan, katanya jangan ngebut-ngebut di tanjakan bukit ya!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'Beneran Bu Yulie yang titip pesan, atau kamu yang iseng ngarang-ngarang, Husna?' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'concern', text: 'Husna benar kok Mas Tion, saya memang khawatir tanjakan bukit semakin terjal.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: '(Duh Gusti... diperhatikan begini bikin mesin mobil kalah panas sama pipi!)' }
    ]
  },
  8: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Jenius', mood: 'craftsman', text: 'Gua denger gosip lu makin rajin narik gara-gara Bu Guru ya? Nih suspensi udah gua kencengin biar gak goyang!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'Bantuin doa aja Zack, semoga tanjakan dan rintangan balok kayu hari ini lancar jaya!' }
    ],
    outro: [
      { speaker: 'Husna', role: 'Siswi SMA', mood: 'flirt', text: 'Bocoran intel gratis nih Mas Tion! Bu Yulie sukanya cowok pekerja keras yang bertanggung jawab!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'Makasih infonya detektif Husna! Nanti kutraktir susu murni porsi dobel!' }
    ]
  },
  9: {
    intro: [
      { speaker: 'Mang Ucup', role: 'Sopir Senior', mood: 'wise', text: 'Bebatuan lepas di lereng kebun teh bisa bikin mobil mental kalau suspensinya kaku, Tion.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Zacky udah pasang per shockbreaker empuk Mang, siap melompat dan mendarat mulus!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Tadi dari jendela kantor guru, saya lihat mobil Mas Tion melompat anggun sekali di bukit!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'Hehehe, demi mendaratkan senyuman di hadapan Bu Yulie tepat waktu!' }
    ]
  },
  10: {
    intro: [
      { speaker: 'Mang Ucup', role: 'Sopir Senior', mood: 'wise', text: 'Udah level 10, Tion! Ingat ilmu Mang Ucup: gas itu keberanian, rem itu kebijaksanaan. Deketin cewek juga sama!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'Siap petuah emasnya Mang! Bakal saya terapkan di pedal gas dan di lubuk hati!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Sudah sepuluh trayek Mas Tion mengantar tanpa pernah terlambat. Anak-anak makin sehat dan ceria.' },
      { speaker: 'Husna', role: 'Siswi SMA', mood: 'cheer', text: 'Dan Mas Tion makin keren ya Bu kalau pakai kemeja kurir biru begini!' }
    ]
  },
  11: {
    intro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'concern', text: 'Mas Tion, jalur pegunungan atas berkabut pekat pagi ini. Jaga jarak pandang dan hati-hati ya.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'Tenang Bu Yulie, klakson telolet MBG siap berkumandang menembus kabut!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Hati saya langsung tenang begitu mendengar alunan telolet Mas Tion di gerbang sekolah...' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'Alunan telolet itu memang nada rindu khusus buat Bu Yulie kok...' }
    ]
  },
  12: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Jenius', mood: 'thinking', text: 'Tanjakan grade 12 makin menantang, Jon! Lu butuh tenaga kuda lebih besar kalau mau nanjak tanpa tekor bensin!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Tabungan koin gizi udah siap buat upgrade mesin di bengkel lu, Zack!' }
    ],
    outro: [
      { speaker: 'Husna', role: 'Siswi SMA', mood: 'cheer', text: 'Keren banget tadi standing wheelie di tikungan atas Mas! Udah kayak film action!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'Yang penting paket gizinya mendarat dengan selamat tanpa tumpah setetes pun!' }
    ]
  },
  13: {
    intro: [
      { speaker: 'Husna', role: 'Siswi SMA', mood: 'flirt', text: 'Mas Tion, aku ada ide cemerlang! Kita selipin kartu ucapan manis di rantang makan siang Bu Yulie!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'Ehhh jangan Husna! Nanti kalau ketahuan kepala sekolah gimana urusannya?!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: '"Semangat mengajar bidadari Puspa Bangsa"... ini tulisan siapa ya Mas Tion?' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'A-anu Bu... itu... Husna yang nulis tapi idenya... eh bukan, maaf Bu!' }
    ]
  },
  14: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Jenius', mood: 'craftsman', text: 'Gimana suratnya kemarin Jon? Sukses bikin Bu Guru baper gak? Hari ini rutenya panjang 2800 meter!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Gua hampir pingsan nahan grogi Zack! Sekarang harus fokus libas 6 bioma berliku!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Mas Tion... kartu ucapan kemarin lucu dan manis sekali. Terima kasih sudah bikin saya tersenyum.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: '(Alhamdulillah ya Allah! Ternyata Bu Yulie suka!)' }
    ]
  },
  15: {
    intro: [
      { speaker: 'Mang Ucup', role: 'Sopir Senior', mood: 'wise', text: 'Tanjakan ekstrem di depan dijuluki Tanjakan Gigi Satu. Mesin dan nyali lu harus siap penuh, Tion!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Zacky udah pasang komponen stage 15 Mang! Tanjakan terjal pun bakal kita taklukkan!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Luar biasa, tanjakan securam itu bisa dilewati tanpa terlambat satu detik pun.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'Karena ada senyuman Bu Guru yang selalu saya nantikan di garis finis.' }
    ]
  },
  16: {
    intro: [
      { speaker: 'Husna', role: 'Siswi SMA', mood: 'cheer', text: 'Mas Tion, bocoran berharga! Hari ini Bu Yulie ulang tahun lho! Mau kasih kejutan apa?' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'Wah serius?! Aku harus bawa pengantaran paling sempurna dan kado terindah!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Mas Tion basah kuyup karena gerimis? Mari payungan berdua sampai ke beranda sekolah...' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: '(Payungan berdua sama Bu Yulie... rasanya dunia serasa milik berdua!)' }
    ]
  },
  17: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Jenius', mood: 'craftsman', text: 'Waktunya pembuktian Jon! 17 level udah lu taklukkan, keahlian nyetir lu udah sekelas juara reli!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Demi kesehatan anak-anak dan masa depan bersama Bu Yulie, gaskeun pol!' }
    ],
    outro: [
      { speaker: 'Husna', role: 'Siswi SMA', mood: 'cheer', text: 'Ayo dong Mas Tion, jangan digantung terus! Nyatakan perasaan ke Bu Yulie pas festival besok!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'Husnaaa! Jangan teriak-teriak di depan umum, malu didenger orang!' }
    ]
  },
  18: {
    intro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'concern', text: 'Angin kencang berhembus di bibir tebing Mas Tion. Jaga kestabilan bodi mobilnya ya.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Bodi aerodinamis dan ban berpola cengkeram tinggi siap menerjang angin bukit, Bu Yulie!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Saya bangga sekali melihat kegigihan dan tanggung jawab Mas Tion setiap hari.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: 'Mendengar apresiasi dari Bu Yulie adalah bahan bakar terkuat di hati saya.' }
    ]
  },
  19: {
    intro: [
      { speaker: 'Mang Ucup', role: 'Sopir Senior', mood: 'wise', text: 'Besok pesta gizi akbar 500 porsi paket komplit. Ini gladi resik rute terberat, Tion!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'focus', text: 'Siap Mang Ucup! Semua komponen mobil sudah di puncak performa maksimal!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'warm', text: 'Semua persiapan lancar berkat Mas Tion. Besok selesai acara... ada yang ingin saya bicarakan berdua.' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'blush', text: '(Deg-degan luar biasa! Apakah impian hatiku bakal terwujud besok?!)' }
    ]
  },
  20: {
    intro: [
      { speaker: 'Zacky', role: 'Montir Jenius', mood: 'craftsman', text: 'Ini dia Grand Finale Jon! Rute 4500 meter penuh melintasi seluruh Pantura, Sawah, Gunung, sampai Sekolah!' },
      { speaker: 'Husna', role: 'Siswi SMA', mood: 'cheer', text: 'Semangat Mas Tion! Seluruh murid dan guru menanti di gerbang Puspa Bangsa!' },
      { speaker: 'Mang Ucup', role: 'Sopir Senior', mood: 'wise', text: 'Buktikan jiwa kesatria kurir gizi sejati! Berangkatkan kargo cintamu, Tion!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'normal', text: 'GAS POLL! DEMI GIZI ANAK BANGSA DAN CINTA BU YULIE!' }
    ],
    outro: [
      { speaker: 'Bu Yulie', role: 'Guru Puspa Bangsa', mood: 'happy', text: 'Mas Tion... perjalanan panjang ini membuktikan ketulusan dan ketangguhan hatimu. Saya menerima perasaan Mas Tion.' },
      { speaker: 'Husna', role: 'Siswi SMA', mood: 'cheer', text: 'HOREEEE! AKHIRNYA JADIAN JUGA! MAKAN-MAKAN GIZI GRATIS!' },
      { speaker: 'Zacky', role: 'Montir Jenius', mood: 'craftsman', text: 'Selamat Jon! Lu resmi jadi Pahlawan Cinta dan Logistik Pantura!' },
      { speaker: 'Mang Ucup', role: 'Sopir Senior', mood: 'wise', text: 'Tangis haru Mang Ucup gak terbendung lagi... selamat Tion dan Bu Yulie!' },
      { speaker: 'Tion', role: 'Kurir MBG', mood: 'happy', text: 'Alhamdulillah... terima kasih semuanya! Misi MBG Sukses Sempurna!' }
    ]
  }
};

export function buildLevelSegments(levelConfig) {
  const biomes = levelConfig.biomes;
  const count = biomes.length;
  const total = levelConfig.totalMeters;
  const schoolLen = Math.max(200, Math.min(400, Math.floor(total * 0.15)));
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
    this.coins = [];    // [meterX, collected]

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
    this.coins = [];

    // Distribute hazards according to segment biomes
    for (const seg of this.segments) {
      const segLen = seg.end - seg.start;
      if (seg.id === 1 && segLen > 150) {
        // Pantura puddles
        const pMid = seg.start + segLen * 0.45;
        this.puddles.push({ start: pMid - 35, end: pMid + 35 });
      } else if (seg.id === 2 && segLen > 150) {
        // Sawah mud pits
        const mMid = seg.start + segLen * 0.5;
        this.mudPits.push({ start: mMid - 40, end: mMid + 40 });
      } else if (seg.id === 3 && segLen > 150) {
        // Mountain wooden logs
        const lMid = seg.start + segLen * 0.55;
        this.logs.push({ x: Math.round(lMid), radius: 14 });
      }
    }

    // Speed bumps in the school district approach
    const fin = cfg.finishMeters;
    this.speedBumps = [Math.max(100, fin - 240), Math.max(120, fin - 140), Math.max(140, fin - 60)];

    // Launch kickers spaced every ~350m
    for (let m = 280; m < fin - 150; m += 380) {
      this.launchRamps.push({ start: m, rise: 12, drop: 6, height: 65 });
    }

    // Fuel canisters every ~380m
    for (let m = 220; m < fin - 100; m += 380) {
      this.fuelCans.push({ x: m, collected: false, dynamic: false });
    }

    // Coins scattered along hills
    for (let m = 40; m < fin; m += 40) {
      if (Math.sin(m * 0.05) > -0.2) {
        this.coins.push({ x: m, collected: false });
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

  getBiomeAt(meterX) {
    if (this.levelConfig && this.segments) {
      for (let i = 0; i < this.segments.length; i++) {
        if (meterX < this.segments[i].end) {
          const id = this.segments[i].id;
          return id === 1 ? BIOMES.PANTURA : id === 2 ? BIOMES.SAWAH : id === 3 ? BIOMES.GUNUNG : BIOMES.SEKOLAH;
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
          const fromId = this.segments[i].id;
          const toId = this.segments[i + 1].id;
          const fromB = fromId === 1 ? BIOMES.PANTURA : fromId === 2 ? BIOMES.SAWAH : fromId === 3 ? BIOMES.GUNUNG : BIOMES.SEKOLAH;
          const toB = toId === 1 ? BIOMES.PANTURA : toId === 2 ? BIOMES.SAWAH : toId === 3 ? BIOMES.GUNUNG : BIOMES.SEKOLAH;
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
      if (biomeId === 2) {
        // Biome 2: Sawah - Stepped terraced rice paddies with table jumps and rolling mounds
        const localM = m - 1200;
        const terrace = Math.sin(localM * 0.07) * 55;
        const rolls = Math.sin(localM * 0.14) * 26;
        const baseWave = Math.sin(localM * 0.025) * 45;
        return baseElevation - 30 + terrace + rolls + baseWave;
      }
      if (biomeId === 3) {
        // Biome 3: Gunung - Mountain slopes & tea plantations with steep launch kickers
        const localM = m - 2800;
        const bigClimb = -Math.min(160, localM * 0.11);
        const kicker = Math.sin(localM * 0.08) * 80;
        const mountainWave = Math.sin(localM * 0.025) * 60;
        return baseElevation - 50 + bigClimb + kicker + mountainWave;
      }
      // Biome 4: Suburb Cirebon - Approaching the fictional school district
      const localM = m - 4200;
      return baseElevation - 90 + Math.sin(localM * 0.04) * 20;
    }

    // Dynamic segments for custom 20-level mode
    const localM = Math.max(0, m - segStart);
    if (biomeId === 1) {
      const h1 = Math.sin(localM * 0.08) * 40;
      const h2 = Math.sin(localM * 0.03) * 50;
      const ramp = Math.sin(localM * 0.12) * 25;
      return baseElevation + (h1 + h2 + ramp);
    }
    if (biomeId === 2) {
      const terrace = Math.sin(localM * 0.07) * 55;
      const rolls = Math.sin(localM * 0.14) * 26;
      const baseWave = Math.sin(localM * 0.025) * 45;
      return baseElevation - 30 + terrace + rolls + baseWave;
    }
    if (biomeId === 3) {
      const bigClimb = -Math.min(160, localM * 0.11);
      const kicker = Math.sin(localM * 0.08) * 80;
      const mountainWave = Math.sin(localM * 0.025) * 60;
      return baseElevation - 50 + bigClimb + kicker + mountainWave;
    }
    return baseElevation - 90 + Math.sin(localM * 0.04) * 20;
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

      return y;
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

    return y;
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

  applyUpgrades(upgrades = {}) {
    const engineLvl = Math.max(1, Math.min(20, upgrades.engine || 1));
    const gripLvl = Math.max(1, Math.min(20, upgrades.grip || 1));
    const suspLvl = Math.max(1, Math.min(20, upgrades.suspension || 1));

    // Baseline Level 1 WAJIB TETAP: enginePower = 2200, kSpring = 180, kDamper = 18.8
    this.enginePower = 2200 + (engineLvl - 1) * 80;
    this.tireGrip = 1.0 + (gripLvl - 1) * 0.03;
    this.kSpring = 180 + (suspLvl - 1) * 4;
    this.kDamper = 18.8 + (suspLvl - 1) * 0.4;
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
      ? PHYSICS_CONSTANTS.THROTTLE_RAMP_UP
      : PHYSICS_CONSTANTS.THROTTLE_RAMP_DOWN;
    this.engineThrottle += Math.sign(throttleTarget - this.engineThrottle)
      * Math.min(Math.abs(throttleTarget - this.engineThrottle), throttleRate * dt);

    const reverseTarget = inputs.brake && this.fuel > 0 && Math.abs(chassisTrackSpeed) <= 12 ? 1 : 0;
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
        const speedTorqueScale = Math.max(0.25,
          1 - Math.abs(this.vx) / PHYSICS_CONSTANTS.MAX_FORWARD_SPEED);
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
    // A fixed arcade speed envelope prevents constant-force runaway on long
    // descents while leaving enough pace to finish within the game deadline.
    this.vx = Math.max(-PHYSICS_CONSTANTS.MAX_REVERSE_SPEED,
      Math.min(PHYSICS_CONSTANTS.MAX_FORWARD_SPEED, this.vx));
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
        this.applyImpactShock(normalImpactSpeed + 40);
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
        // Brake against current travel first; only select reverse near a stop.
        // This keeps the same pedal useful for both HCR-style braking and the
        // game's advertised reverse control without instantly throwing the truck backward.
        const speedAlongTrack = this.vx * tangent.x + this.vy * tangent.y;
        if (speedAlongTrack > 12) {
          driveForce = -this.brakePower * tractionFactor;
        } else if (speedAlongTrack < -12) {
          driveForce = this.brakePower * tractionFactor;
        } else {
          // Reverse is engine torque, not a mechanical braking force. Empty
          // fuel must therefore disable it just as it disables forward drive.
          driveForce = isDriveWheel && this.fuel > 0
            ? -this.enginePower * 0.45 * this.reverseThrottle * tractionFactor
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
        ? -vDotT * PHYSICS_CONSTANTS.MUD_DRAG_RATE * 0.5
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
          this.applyImpactShock(Math.abs(PHYSICS_CONSTANTS.LOG_IMPULSE_VY) + 15);
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
    const damage = Math.min(25, (intensity - 100) * 0.06);
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

    // Coins
    for (const coin of terrain.coins) {
      if (!coin.collected && Math.abs(truckMeterX - coin.x) < 2.0) {
        coin.collected = true;
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
