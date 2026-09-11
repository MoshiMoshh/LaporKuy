export interface CityData {
  id: string;
  name: string;
  districts: string[];
  lat: number;
  lng: number;
}

export interface ProvinceData {
  id: string;
  name: string;
  cities: CityData[];
}

export interface IslandData {
  id: string;
  name: string;
  provinces: ProvinceData[];
}

export const INDONESIA_REGIONS: IslandData[] = [
  {
    id: 'jawa',
    name: 'Pulau Jawa',
    provinces: [
      {
        id: 'jabar',
        name: 'Jawa Barat',
        cities: [
          {
            id: 'kota-bogor',
            name: 'Kota Bogor',
            districts: ['Bogor Tengah', 'Bogor Selatan', 'Bogor Timur', 'Bogor Utara', 'Bogor Barat', 'Tanah Sareal'],
            lat: -6.595,
            lng: 106.816,
          },
          {
            id: 'kab-bogor',
            name: 'Kabupaten Bogor',
            districts: ['Sukaraja', 'Babakan Madang', 'Cibinong', 'Ciawi', 'Bojonggede', 'Citeureup', 'Gunung Putri', 'Cileungsi', 'Parung', 'Cibungbulang', 'Jasinga', 'Leuwiliang'],
            lat: -6.482,
            lng: 106.843,
          },
          {
            id: 'kota-bandung',
            name: 'Kota Bandung',
            districts: ['Coblong', 'Sukajadi', 'Cicendo', 'Andir', 'Bandung Wetan', 'Sumur Bandung', 'Lengkong', 'Antapani', 'Kiaracondong', 'Buahbatu', 'Arcamanik', 'Cibeunying Kaler'],
            lat: -6.917,
            lng: 107.619,
          },
          {
            id: 'kab-bandung',
            name: 'Kabupaten Bandung',
            districts: ['Soreang', 'Baleendah', 'Dayeuhkolot', 'Margahayu', 'Bojongsoang', 'Banjaran', 'Cileunyi', 'Katapang'],
            lat: -7.025,
            lng: 107.519,
          },
          {
            id: 'kota-bekasi',
            name: 'Kota Bekasi',
            districts: ['Bekasi Barat', 'Bekasi Timur', 'Bekasi Utara', 'Bekasi Selatan', 'Rawalumbu', 'Pondok Gede', 'Jatiasih', 'Medan Satria'],
            lat: -6.238,
            lng: 106.975,
          },
          {
            id: 'kab-bekasi',
            name: 'Kabupaten Bekasi',
            districts: ['Cikarang Pusat', 'Cikarang Utara', 'Cikarang Selatan', 'Cikarang Barat', 'Cikarang Timur', 'Tambun Selatan', 'Tambun Utara', 'Cibitung'],
            lat: -6.364,
            lng: 107.172,
          },
          {
            id: 'kota-depok',
            name: 'Kota Depok',
            districts: ['Pancoran Mas', 'Beji', 'Sukmajaya', 'Cimanggis', 'Sawangan', 'Cinere', 'Tapos', 'Bojongsari', 'Cipayung', 'Cilodong', 'Limo'],
            lat: -6.402,
            lng: 106.794,
          },
          {
            id: 'kota-cirebon',
            name: 'Kota Cirebon',
            districts: ['Kejaksan', 'Kesambi', 'Harjamukti', 'Pekalipan', 'Lemahwungkuk'],
            lat: -6.732,
            lng: 108.552,
          },
          {
            id: 'kota-sukabumi',
            name: 'Kota Sukabumi',
            districts: ['Cikole', 'Citamiang', 'Gunungpuyuh', 'Warudoyong', 'Baros', 'Lembursitu'],
            lat: -6.927,
            lng: 106.927,
          },
          {
            id: 'kab-sukabumi',
            name: 'Kabupaten Sukabumi',
            districts: ['Palabuhanratu', 'Cibadak', 'Cisaat', 'Cicurug', 'Parungkuda', 'Cisolok'],
            lat: -6.989,
            lng: 106.551,
          },
          {
            id: 'kab-cianjur',
            name: 'Kabupaten Cianjur',
            districts: ['Cianjur', 'Cipanas', 'Pacet', 'Karangtengah', 'Ciranjang', 'Warungkondang'],
            lat: -6.822,
            lng: 107.139,
          },
          {
            id: 'kota-tasikmalaya',
            name: 'Kota Tasikmalaya',
            districts: ['Cihideung', 'Cipedes', 'Tawang', 'Indihiang', 'Kawalu', 'Mangkubumi'],
            lat: -7.327,
            lng: 108.220,
          },
          {
            id: 'kab-garut',
            name: 'Kabupaten Garut',
            districts: ['Garut Kota', 'Tarogong Kidul', 'Tarogong Kaler', 'Samarang', 'Leles', 'Kadungora'],
            lat: -7.227,
            lng: 107.908,
          },
        ],
      },
      {
        id: 'dki',
        name: 'DKI Jakarta',
        cities: [
          {
            id: 'jakpus',
            name: 'Jakarta Pusat',
            districts: ['Gambir', 'Menteng', 'Tanah Abang', 'Sawah Besar', 'Kemayoran', 'Cempaka Putih', 'Johar Baru', 'Senen'],
            lat: -6.180,
            lng: 106.828,
          },
          {
            id: 'jaksel',
            name: 'Jakarta Selatan',
            districts: ['Kebayoran Baru', 'Kebayoran Lama', 'Cilandak', 'Pasar Minggu', 'Mampang Prapatan', 'Pancoran', 'Tebet', 'Setiabudi', 'Jagakarsa', 'Pesanggrahan'],
            lat: -6.261,
            lng: 106.810,
          },
          {
            id: 'jaktim',
            name: 'Jakarta Timur',
            districts: ['Jatinegara', 'Duren Sawit', 'Kramat Jati', 'Pasar Rebo', 'Ciracas', 'Cipayung', 'Makasar', 'Cakung', 'Pulogadung', 'Matraman'],
            lat: -6.225,
            lng: 106.900,
          },
          {
            id: 'jakbar',
            name: 'Jakarta Barat',
            districts: ['Grogol Petamburan', 'Palmerah', 'Kebon Jeruk', 'Kembangan', 'Cengkareng', 'Kalideres', 'Tambora', 'Taman Sari'],
            lat: -6.168,
            lng: 106.758,
          },
          {
            id: 'jakut',
            name: 'Jakarta Utara',
            districts: ['Penjaringan', 'Pademangan', 'Tanjung Priok', 'Koja', 'Kelapa Gading', 'Cilincing'],
            lat: -6.121,
            lng: 106.883,
          },
          {
            id: 'kep-seribu',
            name: 'Kepulauan Seribu',
            districts: ['Kepulauan Seribu Utara', 'Kepulauan Seribu Selatan'],
            lat: -5.612,
            lng: 106.561,
          },
        ],
      },
      {
        id: 'jatim',
        name: 'Jawa Timur',
        cities: [
          {
            id: 'surabaya',
            name: 'Kota Surabaya',
            districts: ['Wonokromo', 'Gubeng', 'Tegalsari', 'Genteng', 'Bubutan', 'Sukolilo', 'Rungkut', 'Sawahan', 'Mulyorejo', 'Tambaksari', 'Kenjeran'],
            lat: -7.257,
            lng: 112.752,
          },
          {
            id: 'malang',
            name: 'Kota Malang',
            districts: ['Klojen', 'Lowokwaru', 'Blimbing', 'Sukun', 'Kedungkandang'],
            lat: -7.966,
            lng: 112.632,
          },
          {
            id: 'sidoarjo',
            name: 'Kabupaten Sidoarjo',
            districts: ['Sidoarjo', 'Waru', 'Gedangan', 'Candi', 'Porong', 'Krian', 'Taman', 'Buduran'],
            lat: -7.472,
            lng: 112.721,
          },
          {
            id: 'gresik',
            name: 'Kabupaten Gresik',
            districts: ['Gresik', 'Kebomas', 'Manyar', 'Driyorejo', 'Menganti'],
            lat: -7.159,
            lng: 112.655,
          },
          {
            id: 'batu',
            name: 'Kota Batu',
            districts: ['Batu', 'Bumiaji', 'Junrejo'],
            lat: -7.867,
            lng: 112.523,
          },
          {
            id: 'jember',
            name: 'Kabupaten Jember',
            districts: ['Kaliwates', 'Sumbersari', 'Patrang', 'Tanggul', 'Ambulu'],
            lat: -8.184,
            lng: 113.668,
          },
          {
            id: 'kediri',
            name: 'Kota Kediri',
            districts: ['Kota', 'Mojoroto', 'Pesantren'],
            lat: -7.848,
            lng: 112.017,
          },
        ],
      },
      {
        id: 'jateng',
        name: 'Jawa Tengah',
        cities: [
          {
            id: 'semarang',
            name: 'Kota Semarang',
            districts: ['Semarang Tengah', 'Semarang Barat', 'Semarang Timur', 'Semarang Selatan', 'Semarang Utara', 'Banyumanik', 'Candisari', 'Pedurungan', 'Tembalang'],
            lat: -6.966,
            lng: 110.438,
          },
          {
            id: 'surakarta',
            name: 'Kota Surakarta (Solo)',
            districts: ['Banjarsari', 'Jebres', 'Laweyan', 'Pasar Kliwon', 'Serengan'],
            lat: -7.575,
            lng: 110.824,
          },
          {
            id: 'banyumas',
            name: 'Kabupaten Banyumas (Purwokerto)',
            districts: ['Purwokerto Timur', 'Purwokerto Barat', 'Purwokerto Selatan', 'Purwokerto Utara', 'Sokaraja', 'Ajibarang'],
            lat: -7.424,
            lng: 109.230,
          },
          {
            id: 'magelang',
            name: 'Kota Magelang',
            districts: ['Magelang Tengah', 'Magelang Selatan', 'Magelang Utara'],
            lat: -7.470,
            lng: 110.217,
          },
          {
            id: 'tegal',
            name: 'Kota Tegal',
            districts: ['Tegal Barat', 'Tegal Timur', 'Tegal Selatan', 'Margadana'],
            lat: -6.869,
            lng: 109.140,
          },
          {
            id: 'pekalongan',
            name: 'Kota Pekalongan',
            districts: ['Pekalongan Barat', 'Pekalongan Timur', 'Pekalongan Selatan', 'Pekalongan Utara'],
            lat: -6.888,
            lng: 109.675,
          },
        ],
      },
      {
        id: 'banten',
        name: 'Banten',
        cities: [
          {
            id: 'tangerang',
            name: 'Kota Tangerang',
            districts: ['Tangerang', 'Cipondoh', 'Ciledug', 'Karawaci', 'Batuceper', 'Benda', 'Cibodas', 'Jatiuwung', 'Periuk', 'Pinang'],
            lat: -6.178,
            lng: 106.631,
          },
          {
            id: 'tangsel',
            name: 'Kota Tangerang Selatan',
            districts: ['Serpong', 'Serpong Utara', 'Ciputat', 'Ciputat Timur', 'Pamulang', 'Pondok Aren', 'Setu'],
            lat: -6.288,
            lng: 106.717,
          },
          {
            id: 'kab-tangerang',
            name: 'Kabupaten Tangerang',
            districts: ['Tigaraksa', 'Kelapa Dua', 'Curug', 'Pasar Kemis', 'Balaraja', 'Cikupa'],
            lat: -6.225,
            lng: 106.520,
          },
          {
            id: 'serang',
            name: 'Kota Serang',
            districts: ['Serang', 'Cipocok Jaya', 'Curug', 'Kasemen', 'Taktakan', 'Walantaka'],
            lat: -6.110,
            lng: 106.150,
          },
          {
            id: 'cilegon',
            name: 'Kota Cilegon',
            districts: ['Cilegon', 'Cibeber', 'Ciwandan', 'Pulomerak', 'Jombang'],
            lat: -6.017,
            lng: 106.053,
          },
        ],
      },
      {
        id: 'diy',
        name: 'DI Yogyakarta',
        cities: [
          {
            id: 'yogyakarta',
            name: 'Kota Yogyakarta',
            districts: ['Danurejan', 'Gedongtengen', 'Gondomanan', 'Jetis', 'Kotagede', 'Kraton', 'Mantrijeron', 'Mergangsan', 'Ngampilan', 'Pakualaman', 'Tegalrejo', 'Umbulharjo', 'Wirobrajan'],
            lat: -7.795,
            lng: 110.369,
          },
          {
            id: 'sleman',
            name: 'Kabupaten Sleman',
            districts: ['Depok', 'Mlati', 'Gamping', 'Ngaglik', 'Kalasan', 'Berbah', 'Seyegan', 'Tempel'],
            lat: -7.715,
            lng: 110.355,
          },
          {
            id: 'bantul',
            name: 'Kabupaten Bantul',
            districts: ['Bantul', 'Sewon', 'Banguntapan', 'Kasihan', 'Piyungan', 'Imogiri'],
            lat: -7.889,
            lng: 110.329,
          },
        ],
      },
    ],
  },
  {
    id: 'sumatera',
    name: 'Pulau Sumatera',
    provinces: [
      {
        id: 'sumut',
        name: 'Sumatera Utara',
        cities: [
          {
            id: 'medan',
            name: 'Kota Medan',
            districts: ['Medan Kota', 'Medan Baru', 'Medan Barat', 'Medan Timur', 'Medan Petisah', 'Medan Helvetia', 'Medan Sunggal', 'Medan Tembung', 'Medan Amplas', 'Medan Johor'],
            lat: 3.595,
            lng: 98.672,
          },
          {
            id: 'deli-serdang',
            name: 'Kabupaten Deli Serdang',
            districts: ['Lubuk Pakam', 'Percut Sei Tuan', 'Sunggal', 'Tanjung Morawa'],
            lat: 3.555,
            lng: 98.863,
          },
          {
            id: 'binjai',
            name: 'Kota Binjai',
            districts: ['Binjai Kota', 'Binjai Barat', 'Binjai Timur', 'Binjai Utara', 'Binjai Selatan'],
            lat: 3.600,
            lng: 98.485,
          },
        ],
      },
      {
        id: 'sumbar',
        name: 'Sumatera Barat',
        cities: [
          {
            id: 'padang',
            name: 'Kota Padang',
            districts: ['Padang Barat', 'Padang Timur', 'Padang Selatan', 'Padang Utara', 'Koto Tangah', 'Kuranji', 'Nanggalo'],
            lat: -0.949,
            lng: 100.354,
          },
          {
            id: 'bukittinggi',
            name: 'Kota Bukittinggi',
            districts: ['Guguk Panjang', 'Mandiangin Koto Selayan', 'Aur Birugo Tigo Baleh'],
            lat: -0.305,
            lng: 100.369,
          },
        ],
      },
      {
        id: 'riau',
        name: 'Riau',
        cities: [
          {
            id: 'pekanbaru',
            name: 'Kota Pekanbaru',
            districts: ['Sukajadi', 'Senapelan', 'Pekanbaru Kota', 'Rumbai', 'Marpoyan Damai', 'Tampan', 'Bukit Raya'],
            lat: 0.507,
            lng: 101.447,
          },
          {
            id: 'dumai',
            name: 'Kota Dumai',
            districts: ['Dumai Kota', 'Dumai Barat', 'Dumai Timur', 'Dumai Selatan'],
            lat: 1.666,
            lng: 101.448,
          },
        ],
      },
      {
        id: 'sumsel',
        name: 'Sumatera Selatan',
        cities: [
          {
            id: 'palembang',
            name: 'Kota Palembang',
            districts: ['Ilir Barat I', 'Ilir Barat II', 'Ilir Timur I', 'Ilir Timur II', 'Seberang Ulu I', 'Seberang Ulu II', 'Sukarami', 'Sako'],
            lat: -2.976,
            lng: 104.775,
          },
        ],
      },
      {
        id: 'lampung',
        name: 'Lampung',
        cities: [
          {
            id: 'bandar-lampung',
            name: 'Kota Bandar Lampung',
            districts: ['Tanjungkarang Pusat', 'Tanjungkarang Timur', 'Tanjungkarang Barat', 'Telukbetung Selatan', 'Telukbetung Utara', 'Kedaton', 'Way Halim', 'Sukarame'],
            lat: -5.450,
            lng: 105.266,
          },
        ],
      },
      {
        id: 'kepri',
        name: 'Kepulauan Riau',
        cities: [
          {
            id: 'batam',
            name: 'Kota Batam',
            districts: ['Batam Kota', 'Lubuk Baja', 'Batu Ampar', 'Bengkong', 'Sekupang', 'Sagulung', 'Nongsa', 'Batu Aji'],
            lat: 1.130,
            lng: 104.052,
          },
          {
            id: 'tanjungpinang',
            name: 'Kota Tanjungpinang',
            districts: ['Tanjungpinang Kota', 'Tanjungpinang Barat', 'Tanjungpinang Timur', 'Bukit Bestari'],
            lat: 0.916,
            lng: 104.458,
          },
        ],
      },
      {
        id: 'aceh',
        name: 'Aceh',
        cities: [
          {
            id: 'banda-aceh',
            name: 'Kota Banda Aceh',
            districts: ['Baiturrahman', 'Kuta Alam', 'Meuraxa', 'Syiah Kuala', 'Lueng Bata', 'Ulee Kareng'],
            lat: 5.548,
            lng: 95.323,
          },
        ],
      },
    ],
  },
  {
    id: 'kalimantan',
    name: 'Pulau Kalimantan',
    provinces: [
      {
        id: 'kaltim',
        name: 'Kalimantan Timur',
        cities: [
          {
            id: 'samarinda',
            name: 'Kota Samarinda',
            districts: ['Samarinda Kota', 'Samarinda Ulu', 'Samarinda Ilir', 'Samarinda Utara', 'Sungai Kunjang'],
            lat: -0.502,
            lng: 117.153,
          },
          {
            id: 'balikpapan',
            name: 'Kota Balikpapan',
            districts: ['Balikpapan Kota', 'Balikpapan Selatan', 'Balikpapan Tengah', 'Balikpapan Utara', 'Balikpapan Barat', 'Balikpapan Timur'],
            lat: -1.237,
            lng: 116.828,
          },
          {
            id: 'ikn-penajam',
            name: 'IKN Nusantara / Penajam Paser Utara',
            districts: ['Sepaku (KIPP)', 'Penajam', 'Waru', 'Babulu'],
            lat: -0.973,
            lng: 116.708,
          },
        ],
      },
      {
        id: 'kalbar',
        name: 'Kalimantan Barat',
        cities: [
          {
            id: 'pontianak',
            name: 'Kota Pontianak',
            districts: ['Pontianak Kota', 'Pontianak Selatan', 'Pontianak Barat', 'Pontianak Timur', 'Pontianak Utara', 'Pontianak Tenggara'],
            lat: -0.026,
            lng: 109.342,
          },
        ],
      },
      {
        id: 'kalsel',
        name: 'Kalimantan Selatan',
        cities: [
          {
            id: 'banjarmasin',
            name: 'Kota Banjarmasin',
            districts: ['Banjarmasin Tengah', 'Banjarmasin Barat', 'Banjarmasin Timur', 'Banjarmasin Selatan', 'Banjarmasin Utara'],
            lat: -3.319,
            lng: 114.590,
          },
          {
            id: 'banjarbaru',
            name: 'Kota Banjarbaru',
            districts: ['Banjarbaru Utara', 'Banjarbaru Selatan', 'Landasan Ulin'],
            lat: -3.440,
            lng: 114.830,
          },
        ],
      },
    ],
  },
  {
    id: 'sulawesi',
    name: 'Pulau Sulawesi',
    provinces: [
      {
        id: 'sulsel',
        name: 'Sulawesi Selatan',
        cities: [
          {
            id: 'makassar',
            name: 'Kota Makassar',
            districts: ['Ujung Pandang', 'Mariso', 'Mamajang', 'Makassar', 'Bontoala', 'Wajo', 'Tallo', 'Panakkukang', 'Tamalate', 'Biringkanaya', 'Manggala', 'Rappocini', 'Tamalanrea'],
            lat: -5.147,
            lng: 119.432,
          },
          {
            id: 'gowa',
            name: 'Kabupaten Gowa',
            districts: ['Somba Opu', 'Pallangga', 'Bontomarannu'],
            lat: -5.200,
            lng: 119.450,
          },
        ],
      },
      {
        id: 'sulut',
        name: 'Sulawesi Utara',
        cities: [
          {
            id: 'manado',
            name: 'Kota Manado',
            districts: ['Wenang', 'Sario', 'Malalayang', 'Tikala', 'Wanea', 'Singkil', 'Mapanget', 'Bunaken'],
            lat: 1.474,
            lng: 124.842,
          },
        ],
      },
      {
        id: 'sulteng',
        name: 'Sulawesi Tengah',
        cities: [
          {
            id: 'palu',
            name: 'Kota Palu',
            districts: ['Palu Barat', 'Palu Timur', 'Palu Selatan', 'Palu Utara', 'Tatanga', 'Ulujadi', 'Mantikulore'],
            lat: -0.891,
            lng: 119.870,
          },
        ],
      },
    ],
  },
  {
    id: 'bali-nusra',
    name: 'Pulau Bali & Nusa Tenggara',
    provinces: [
      {
        id: 'bali',
        name: 'Bali',
        cities: [
          {
            id: 'denpasar',
            name: 'Kota Denpasar',
            districts: ['Denpasar Selatan', 'Denpasar Barat', 'Denpasar Timur', 'Denpasar Utara'],
            lat: -8.670,
            lng: 115.212,
          },
          {
            id: 'badung',
            name: 'Kabupaten Badung (Kuta/Seminyak)',
            districts: ['Kuta', 'Kuta Selatan', 'Kuta Utara', 'Mengwi', 'Abiansemal', 'Petang'],
            lat: -8.583,
            lng: 115.177,
          },
          {
            id: 'gianyar',
            name: 'Kabupaten Gianyar (Ubud)',
            districts: ['Gianyar', 'Ubud', 'Sukawati', 'Blahbatuh', 'Tampaksiring'],
            lat: -8.543,
            lng: 115.325,
          },
        ],
      },
      {
        id: 'ntb',
        name: 'Nusa Tenggara Barat',
        cities: [
          {
            id: 'mataram',
            name: 'Kota Mataram',
            districts: ['Mataram', 'Ampenan', 'Cakranegara', 'Sandubaya', 'Selaparang', 'Sekarbela'],
            lat: -8.583,
            lng: 116.116,
          },
        ],
      },
      {
        id: 'ntt',
        name: 'Nusa Tenggara Timur',
        cities: [
          {
            id: 'kupang',
            name: 'Kota Kupang',
            districts: ['Oebobo', 'Kelapa Lima', 'Kota Raja', 'Maulafa', 'Alak', 'Kota Lama'],
            lat: -10.177,
            lng: 123.607,
          },
          {
            id: 'labuan-bajo',
            name: 'Kabupaten Manggarai Barat (Labuan Bajo)',
            districts: ['Komodo', 'Boleng', 'Sano Nggoang'],
            lat: -8.496,
            lng: 119.887,
          },
        ],
      },
    ],
  },
  {
    id: 'maluku-papua',
    name: 'Kepulauan Maluku & Papua',
    provinces: [
      {
        id: 'maluku',
        name: 'Maluku',
        cities: [
          {
            id: 'ambon',
            name: 'Kota Ambon',
            districts: ['Sirimau', 'Nusaniwe', 'Baguala', 'Teluk Ambon', 'Leitimur Selatan'],
            lat: -3.695,
            lng: 128.181,
          },
        ],
      },
      {
        id: 'papua',
        name: 'Papua',
        cities: [
          {
            id: 'jayapura',
            name: 'Kota Jayapura',
            districts: ['Jayapura Utara', 'Jayapura Selatan', 'Abepura', 'Muara Tami', 'Heram'],
            lat: -2.533,
            lng: 140.718,
          },
        ],
      },
      {
        id: 'papua-barat-daya',
        name: 'Papua Barat Daya',
        cities: [
          {
            id: 'sorong',
            name: 'Kota Sorong',
            districts: ['Sorong', 'Sorong Barat', 'Sorong Timur', 'Sorong Utara', 'Sorong Manoi'],
            lat: -0.876,
            lng: 131.255,
          },
        ],
      },
    ],
  },
];
