import { Volcano } from '@/types/vaac';

export const VOLCANOES_INDONESIA: Volcano[] = [
  // --- JAWA ---
  {
    id: 'semeru',
    name: 'Gunung Semeru',
    aliases: ['SEMERU', 'MT SEMERU', 'MOUNT SEMERU'],
    lat: -8.108,
    lon: 112.922,
    elevation: 3676,
    type: 'Stratovulkan',
    region: 'Jawa',
    province: 'Jawa Timur',
    alertLevel: 3, // Siaga
    lastEruption: 'Aktif 2026',
    description: 'Gunung tertinggi di Pulau Jawa dengan kubah lava aktif Jonggring Saloko.'
  },
  {
    id: 'krakatau',
    name: 'Anak Krakatau',
    aliases: ['KRAKATAU', 'ANAK KRAKATAU', 'MT KRAKATAU', 'MOUNT KRAKATAU'],
    lat: -6.102,
    lon: 105.423,
    elevation: 157,
    type: 'Kaldera / Gunung Api Laut',
    region: 'Sumatera',
    province: 'Lampung / Selat Sunda',
    alertLevel: 3, // Siaga
    lastEruption: 'Aktif 2026',
    description: 'Gunung api aktif di Selat Sunda yang tumbuh di dalam sisa kaldera letusan kataklismik 1883.'
  },
  {
    id: 'merapi',
    name: 'Gunung Merapi',
    aliases: ['MERAPI', 'MT MERAPI', 'MOUNT MERAPI'],
    lat: -7.540,
    lon: 110.446,
    elevation: 2968,
    type: 'Stratovulkan',
    region: 'Jawa',
    province: 'D.I. Yogyakarta / Jawa Tengah',
    alertLevel: 3, // Siaga
    lastEruption: 'Aktif 2026',
    description: 'Salah satu gunung api paling aktif di dunia dengan kubah lava dan awan panas guguran rutin.'
  },
  {
    id: 'bromo',
    name: 'Gunung Bromo',
    aliases: ['BROMO', 'MT BROMO', 'TENGGER BROMO'],
    lat: -7.942,
    lon: 112.950,
    elevation: 2329,
    type: 'Kaldera Kerucut Sinder',
    region: 'Jawa',
    province: 'Jawa Timur',
    alertLevel: 2, // Waspada
    lastEruption: '2021',
    description: 'Terkenal di Kaldera Tengger dengan aktivitas solfatara dan abu vulkanik periodik.'
  },
  {
    id: 'kelud',
    name: 'Gunung Kelud',
    aliases: ['KELUD', 'MT KELUD'],
    lat: -7.930,
    lon: 112.308,
    elevation: 1731,
    type: 'Stratovulkan',
    region: 'Jawa',
    province: 'Jawa Timur',
    alertLevel: 1, // Normal
    lastEruption: '2014',
    description: 'Terkenal dengan letusan eksplosif 2014 yang menyebarkan abu hingga ratusan kilometer ke Jawa Barat.'
  },
  {
    id: 'raung',
    name: 'Gunung Raung',
    aliases: ['RAUNG', 'MT RAUNG'],
    lat: -8.125,
    lon: 114.042,
    elevation: 3332,
    type: 'Stratovulkan Kaldera',
    region: 'Jawa',
    province: 'Jawa Timur',
    alertLevel: 2, // Waspada
    lastEruption: '2021',
    description: 'Memiliki kaldera raksasa sedalam 500 meter dan sering memuntahkan abu strombolian tinggi.'
  },
  {
    id: 'slamet',
    name: 'Gunung Slamet',
    aliases: ['SLAMET', 'MT SLAMET'],
    lat: -7.242,
    lon: 109.208,
    elevation: 3428,
    type: 'Stratovulkan',
    region: 'Jawa',
    province: 'Jawa Tengah',
    alertLevel: 2, // Waspada
    lastEruption: '2014',
    description: 'Gunung tertinggi kedua di Pulau Jawa yang terletak di perbatasan 5 kabupaten.'
  },
  {
    id: 'ijen',
    name: 'Gunung Ijen',
    aliases: ['IJEN', 'KAWAH IJEN', 'MT IJEN'],
    lat: -8.058,
    lon: 114.242,
    elevation: 2769,
    type: 'Kompleks Stratovulkan',
    region: 'Jawa',
    province: 'Jawa Timur',
    alertLevel: 2, // Waspada
    lastEruption: '1999',
    description: 'Terkenal dengan danau kawah asam terbesar di dunia dan fenomena api biru (blue fire).'
  },
  {
    id: 'tangkuban-parahu',
    name: 'Tangkuban Parahu',
    aliases: ['TANGKUBAN PARAHU', 'TANGKUBAN PERAHU', 'MT TANGKUBAN PARAHU'],
    lat: -6.770,
    lon: 107.600,
    elevation: 2084,
    type: 'Stratovulkan',
    region: 'Jawa',
    province: 'Jawa Barat',
    alertLevel: 2, // Waspada
    lastEruption: '2019',
    description: 'Destinasi wisata aktif dengan beberapa kawah aktif seperti Kawah Ratu dan Kawah Upas.'
  },
  {
    id: 'gede',
    name: 'Gunung Gede',
    aliases: ['GEDE', 'MT GEDE', 'GEDE PANGRANGO'],
    lat: -6.780,
    lon: 106.980,
    elevation: 2958,
    type: 'Stratovulkan',
    region: 'Jawa',
    province: 'Jawa Barat',
    alertLevel: 1, // Normal
    lastEruption: '1957',
    description: 'Terletak di Taman Nasional Gunung Gede Pangrango dekat kawasan Jabodetabek.'
  },
  {
    id: 'papandayan',
    name: 'Gunung Papandayan',
    aliases: ['PAPANDAYAN', 'MT PAPANDAYAN'],
    lat: -7.320,
    lon: 107.730,
    elevation: 2665,
    type: 'Stratovulkan Kompleks',
    region: 'Jawa',
    province: 'Jawa Barat',
    alertLevel: 1, // Normal
    lastEruption: '2002',
    description: 'Memiliki lapangan fumarol yang luas dan kawah belerang aktif di Garut.'
  },

  // --- MALUKU & HALMAHERA ---
  {
    id: 'dukono',
    name: 'Gunung Dukono',
    aliases: ['DUKONO', 'MT DUKONO', 'MOUNT DUKONO'],
    lat: 1.693,
    lon: 127.894,
    elevation: 1335,
    type: 'Kompleks Vulkanik',
    region: 'Maluku',
    province: 'Maluku Utara',
    alertLevel: 2, // Waspada
    lastEruption: 'Aktif 2026',
    description: 'Gunung api sangat aktif di Halmahera Utara yang terus menerus melepaskan kolom abu ke udara.'
  },
  {
    id: 'ibu',
    name: 'Gunung Ibu',
    aliases: ['IBU', 'MT IBU', 'MOUNT IBU'],
    lat: 1.488,
    lon: 127.630,
    elevation: 1325,
    type: 'Stratovulkan',
    region: 'Maluku',
    province: 'Maluku Utara',
    alertLevel: 3, // Siaga
    lastEruption: 'Aktif 2026',
    description: 'Sangat sering mengalami erupsi eksplosif harian dengan ketinggian abu mencapai ribuan meter.'
  },
  {
    id: 'gamalama',
    name: 'Gunung Gamalama',
    aliases: ['GAMALAMA', 'MT GAMALAMA'],
    lat: 0.800,
    lon: 127.330,
    elevation: 1715,
    type: 'Stratovulkan Pulau',
    region: 'Maluku',
    province: 'Maluku Utara (Ternate)',
    alertLevel: 2, // Waspada
    lastEruption: '2018',
    description: 'Membentuk keseluruhan pulau Ternate, sering mengganggu operasional Bandara Sultan Babullah saat erupsi.'
  },
  {
    id: 'gamkonora',
    name: 'Gunung Gamkonora',
    aliases: ['GAMKONORA', 'MT GAMKONORA'],
    lat: 1.380,
    lon: 127.530,
    elevation: 1635,
    type: 'Stratovulkan',
    region: 'Maluku',
    province: 'Maluku Utara',
    alertLevel: 2, // Waspada
    lastEruption: '2013',
    description: 'Puncak tertinggi di Pulau Halmahera bagian barat laut.'
  },
  {
    id: 'banda-api',
    name: 'Gunung Banda Api',
    aliases: ['BANDA API', 'MT BANDA API'],
    lat: -4.525,
    lon: 129.871,
    elevation: 640,
    type: 'Kaldera Pulau',
    region: 'Maluku',
    province: 'Maluku',
    alertLevel: 1, // Normal
    lastEruption: '1988',
    description: 'Gunung api pulau di tengah Kepulauan Banda yang bersejarah.'
  },

  // --- SUMATERA ---
  {
    id: 'marapi',
    name: 'Gunung Marapi',
    aliases: ['MARAPI', 'MT MARAPI', 'MOUNT MARAPI'],
    lat: -0.381,
    lon: 100.473,
    elevation: 2891,
    type: 'Kompleks Stratovulkan',
    region: 'Sumatera',
    province: 'Sumatera Barat',
    alertLevel: 3, // Siaga
    lastEruption: 'Aktif 2024-2026',
    description: 'Gunung paling aktif di Sumatera Barat dengan erupsi freatik dan magmatik frekuentif.'
  },
  {
    id: 'sinabung',
    name: 'Gunung Sinabung',
    aliases: ['SINABUNG', 'MT SINABUNG', 'MOUNT SINABUNG'],
    lat: 3.170,
    lon: 98.392,
    elevation: 2460,
    type: 'Stratovulkan',
    region: 'Sumatera',
    province: 'Sumatera Utara (Karo)',
    alertLevel: 2, // Waspada
    lastEruption: '2021',
    description: 'Aktif kembali sejak 2010 setelah tidur selama 400 tahun, menghasilkan aliran piroklastik dahsyat.'
  },
  {
    id: 'kerinci',
    name: 'Gunung Kerinci',
    aliases: ['KERINCI', 'MT KERINCI'],
    lat: -1.697,
    lon: 101.264,
    elevation: 3805,
    type: 'Stratovulkan',
    region: 'Sumatera',
    province: 'Jambi / Sumatera Barat',
    alertLevel: 2, // Waspada
    lastEruption: '2023',
    description: 'Gunung berapi tertinggi di Indonesia dan puncak tertinggi di Pulau Sumatera.'
  },
  {
    id: 'dempo',
    name: 'Gunung Dempo',
    aliases: ['DEMPO', 'MT DEMPO'],
    lat: -4.030,
    lon: 103.130,
    elevation: 3173,
    type: 'Stratovulkan',
    region: 'Sumatera',
    province: 'Sumatera Selatan',
    alertLevel: 2, // Waspada
    lastEruption: '2023',
    description: 'Menjulang di dataran tinggi Pagaralam dengan danau kawah kawah aktif.'
  },
  {
    id: 'sorikmarapi',
    name: 'Sorikmarapi',
    aliases: ['SORIKMARAPI', 'SORIK MARAPI', 'MT SORIKMARAPI'],
    lat: 0.686,
    lon: 99.622,
    elevation: 2145,
    type: 'Stratovulkan',
    region: 'Sumatera',
    province: 'Sumatera Utara',
    alertLevel: 1, // Normal
    lastEruption: '1986',
    description: 'Terletak di Mandailing Natal dengan danau kawah dan fumarol aktif.'
  },

  // --- BALI & NUSA TENGGARA ---
  {
    id: 'lewotobi-laki-laki',
    name: 'Lewotobi Laki-laki',
    aliases: ['LEWOTOBI', 'LEWOTOBI LAKI-LAKI', 'MT LEWOTOBI', 'MOUNT LEWOTOBI'],
    lat: -8.538,
    lon: 122.768,
    elevation: 1584,
    type: 'Stratovulkan Kembar',
    region: 'Bali & Nusa Tenggara',
    province: 'Nusa Tenggara Timur (Flores Timur)',
    alertLevel: 4, // Awas
    lastEruption: 'Aktif 2024-2026',
    description: 'Mengalami erupsi eksplosif paroksismal besar pada 2024-2026 dengan kolom abu mencapai FL500.'
  },
  {
    id: 'lewotobi-perempuan',
    name: 'Lewotobi Perempuan',
    aliases: ['LEWOTOBI PEREMPUAN'],
    lat: -8.553,
    lon: 122.792,
    elevation: 1703,
    type: 'Stratovulkan Kembar',
    region: 'Bali & Nusa Tenggara',
    province: 'Nusa Tenggara Timur (Flores Timur)',
    alertLevel: 2, // Waspada
    lastEruption: '1935',
    description: 'Saudara kembar Lewotobi Laki-laki dengan puncak sedikit lebih tinggi.'
  },
  {
    id: 'ili-lewotolok',
    name: 'Ili Lewotolok',
    aliases: ['LEWOTOLOK', 'ILI LEWOTOLOK', 'MT LEWOTOLOK'],
    lat: -8.272,
    lon: 123.505,
    elevation: 1423,
    type: 'Stratovulkan',
    region: 'Bali & Nusa Tenggara',
    province: 'Nusa Tenggara Timur (Lembata)',
    alertLevel: 3, // Siaga
    lastEruption: 'Aktif 2026',
    description: 'Terletak di semenanjung utara Pulau Lembata dengan letusan eksplosif strombolian berkelanjutan.'
  },
  {
    id: 'agung',
    name: 'Gunung Agung',
    aliases: ['AGUNG', 'MT AGUNG', 'MOUNT AGUNG'],
    lat: -8.343,
    lon: 115.508,
    elevation: 3031,
    type: 'Stratovulkan',
    region: 'Bali & Nusa Tenggara',
    province: 'Bali',
    alertLevel: 1, // Normal
    lastEruption: '2019',
    description: 'Puncak suci tertinggi di Bali yang pernah meletus hebat pada 1963 dan 2017-2019.'
  },
  {
    id: 'batur',
    name: 'Gunung Batur',
    aliases: ['BATUR', 'MT BATUR'],
    lat: -8.242,
    lon: 115.375,
    elevation: 1717,
    type: 'Kaldera Kerucut Berlapis',
    region: 'Bali & Nusa Tenggara',
    province: 'Bali',
    alertLevel: 1, // Normal
    lastEruption: '2000',
    description: 'Kaldera ganda spektakuler dengan danau bulan sabit kaldera Batur di Kintamani.'
  },
  {
    id: 'rinjani',
    name: 'Gunung Rinjani',
    aliases: ['RINJANI', 'MT RINJANI'],
    lat: -8.420,
    lon: 116.470,
    elevation: 3726,
    type: 'Stratovulkan Kaldera',
    region: 'Bali & Nusa Tenggara',
    province: 'Nusa Tenggara Barat (Lombok)',
    alertLevel: 2, // Waspada
    lastEruption: '2016',
    description: 'Memiliki danau Segara Anak dan kerucut baru Gunung Barujari di dalam kalderanya.'
  },
  {
    id: 'sangeang-api',
    name: 'Sangeang Api',
    aliases: ['SANGEANG API', 'SANGEANG', 'MT SANGEANG API'],
    lat: -8.200,
    lon: 119.070,
    elevation: 1949,
    type: 'Pulau Vulkanik Kompleks',
    region: 'Bali & Nusa Tenggara',
    province: 'Nusa Tenggara Barat (Bima)',
    alertLevel: 2, // Waspada
    lastEruption: '2014',
    description: 'Pulau gunung berapi aktif di timur laut Sumbawa yang memuntahkan abu melintasi Laut Flores.'
  },
  {
    id: 'tambora',
    name: 'Gunung Tambora',
    aliases: ['TAMBORA', 'MT TAMBORA'],
    lat: -8.250,
    lon: 118.000,
    elevation: 2850,
    type: 'Stratovulkan Kaldera Raksasa',
    region: 'Bali & Nusa Tenggara',
    province: 'Nusa Tenggara Barat (Sumbawa)',
    alertLevel: 1, // Normal
    lastEruption: '1967',
    description: 'Pencetus letusan terbesar dalam sejarah modern (1815) yang menyebabkan "Year Without a Summer" di belahan bumi utara.'
  },
  {
    id: 'iya',
    name: 'Gunung Iya',
    aliases: ['IYA', 'MT IYA'],
    lat: -8.897,
    lon: 121.645,
    elevation: 637,
    type: 'Stratovulkan Semenanjung',
    region: 'Bali & Nusa Tenggara',
    province: 'Nusa Tenggara Timur (Ende)',
    alertLevel: 3, // Siaga
    lastEruption: '1969',
    description: 'Terletak di semenanjung sempit selatan Kota Ende, Flores.'
  },

  // --- SULAWESI & SANGIHE ---
  {
    id: 'ruang',
    name: 'Gunung Ruang',
    aliases: ['RUANG', 'MT RUANG', 'MOUNT RUANG'],
    lat: 2.301,
    lon: 125.368,
    elevation: 725,
    type: 'Stratovulkan Pulau',
    region: 'Sulawesi',
    province: 'Sulawesi Utara (Sitaro)',
    alertLevel: 3, // Siaga
    lastEruption: 'Aktif 2024-2026',
    description: 'Menghasilkan letusan dahsyat dan kilat vulkanik pada April 2024 dengan kolom abu mencapai 19 km (FL630).'
  },
  {
    id: 'karangetang',
    name: 'Gunung Karangetang',
    aliases: ['KARANGETANG', 'MT KARANGETANG'],
    lat: 2.781,
    lon: 125.405,
    elevation: 1784,
    type: 'Stratovulkan',
    region: 'Sulawesi',
    province: 'Sulawesi Utara (Pulau Siau)',
    alertLevel: 3, // Siaga
    lastEruption: 'Aktif 2024-2026',
    description: 'Gunung api paling aktif di Kepulauan Sitaro dengan lelehan lava pijar dan awan panas guguran rutin.'
  },
  {
    id: 'lokon',
    name: 'Gunung Lokon',
    aliases: ['LOKON', 'MT LOKON', 'LOKON EMPUNG'],
    lat: 1.358,
    lon: 124.792,
    elevation: 1580,
    type: 'Stratovulkan',
    region: 'Sulawesi',
    province: 'Sulawesi Utara (Tomohon)',
    alertLevel: 2, // Waspada
    lastEruption: '2023',
    description: 'Pusat letusan berada di kawah Tompaluan di pelana antara puncak Lokon dan Empung.'
  },
  {
    id: 'soputan',
    name: 'Gunung Soputan',
    aliases: ['SOPUTAN', 'MT SOPUTAN'],
    lat: 1.112,
    lon: 124.737,
    elevation: 1785,
    type: 'Stratovulkan',
    region: 'Sulawesi',
    province: 'Sulawesi Utara (Minahasa)',
    alertLevel: 2, // Waspada
    lastEruption: '2018',
    description: 'Salah satu gunung api teraktif di Sulawesi dengan kubah lava dan letusan tipe strombolian/vulcanian.'
  },
  {
    id: 'awu',
    name: 'Gunung Awu',
    aliases: ['AWU', 'MT AWU'],
    lat: 3.670,
    lon: 125.456,
    elevation: 1320,
    type: 'Stratovulkan',
    region: 'Sulawesi',
    province: 'Sulawesi Utara (Sangihe)',
    alertLevel: 3, // Siaga
    lastEruption: '2004',
    description: 'Gunung terbesar di Pulau Sangihe dengan potensi bahaya lahar letusan dari danau kawah.'
  }
];

export const INDONESIA_REGIONS = [
  'Semua Wilayah',
  'Jawa',
  'Sumatera',
  'Bali & Nusa Tenggara',
  'Maluku',
  'Sulawesi'
] as const;

