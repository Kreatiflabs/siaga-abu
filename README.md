# Sistem Pemantauan Abu Vulkanik Indonesia (Live VAAC Darwin)

Aplikasi web modern berbasis **Next.js (App Router) + TypeScript + Tailwind CSS + Leaflet GIS** untuk memantau sebaran abu vulkanik (*Volcanic Ash Advisory*) secara real-time di ruang udara Indonesia dan yurisdiksi **VAAC Darwin** (FIR Jakarta `WIIF` & FIR Ujung Pandang `WAAF`).

Proyek ini telah dikonfigurasi dan dioptimasi secara penuh agar **dapat langsung di-hosting ke Vercel**.

---

## 🌋 Fitur Utama

- **Live Data VAAC Darwin & ICAO SIGMET**: Mengambil data real-time dari API resmi NOAA AWC untuk bahaya abu vulkanik (*Hazard VA*) yang mencakup wilayah Indonesia dan sekitarnya.
- **Visualisasi Poligon Sebaran Abu**:
  - Poligon Merah: Awan abu teramati (*Observed Ash Cloud*).
  - Poligon Amber Putus-putus: Prakiraan pergerakan awan abu +6 jam (*Forecast Ash Cloud*).
  - Informasi Ketinggian Jelajah (*Flight Level*, misal `SFC/FL150` atau `FL500`).
  - Vektor kecepatan dan arah hembusan angin.
- **Katalog Gunung Api Indonesia**:
  - Daftar lengkap gunung api aktif di Sumatera, Jawa, Bali & Nusa Tenggara, Maluku, dan Sulawesi.
  - Penanda otomatis (*pulsing badge*) untuk gunung yang sedang memiliki peringatan abu aktif.
  - Filter berdasarkan wilayah dan pencarian instan nama gunung.
- **Peta Interaktif Multi-Layer**:
  - Mendukung pilihan peta dasar *Dark Matter*, *Satelit Esri*, dan *OpenStreetMap*.
  - Efek *FlyTo* animasi halus saat gunung api atau poligon dipilih.
  - Marker interaktif dengan popup informatif status aktivitas PVMBG (Normal, Waspada, Siaga, Awas).
- **Rincian Buletin ICAO & Ekspor GeoJSON**:
  - Tampilan buletin teks ICAO asli dengan tombol salin instan (*Copy Raw Bulletin*).
  - Ekspor poligon sebaran abu ke format standard `.geojson` untuk digunakan di QGIS atau Google Earth.
- **Mode Simulasi Skenario**:
  - Menguji perkiraan sebaran abu dan arah angin pada gunung api manapun di Indonesia jika terjadi erupsi.

---

## 🚀 Panduan Menjalankan di Lokal

### 1. Prasyarat
- Node.js versi 18.x atau 20.x ke atas.
- npm atau pnpm / yarn.

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses [http://localhost:3000](http://localhost:3000).

### 4. Membangun untuk Produksi (Build Test)
```bash
npm run build
```

---

## ☁️ Panduan Hosting / Deploy ke Vercel

Proyek ini menggunakan Next.js App Router murni dengan serverless route handler (`src/app/api/vaac/route.ts`), sehingga **100% kompatibel dan siap di-deploy ke Vercel tanpa konfigurasi tambahan**.

### Cara 1: Deploy Melalui Vercel Dashboard (Rekomendasi)

1. Unggah (*push*) repository proyek ini ke akun **GitHub** atau **GitLab** Anda:
   ```bash
   git add .
   git commit -m "feat: inisialisasi aplikasi pemantauan abu vulkanik indonesia vaac darwin"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO-NAME.git
   git push -u origin main
   ```
2. Buka [vercel.com](https://vercel.com) dan login ke akun Anda.
3. Klik tombol **"Add New..."** -> **"Project"**.
4. Pilih repository Git yang baru saja Anda unggah.
5. Vercel akan secara otomatis mendeteksi framework **Next.js**.
6. Klik tombol **"Deploy"**.
7. Dalam waktu ~1 menit, aplikasi Anda akan live dengan URL domain Vercel (contoh: `https://cool-heisenberg.vercel.app`).

### Cara 2: Deploy Menggunakan Vercel CLI

Jika Anda memiliki Vercel CLI di komputer Anda:
```bash
# 1. Login ke Vercel (jika belum)
npx vercel login

# 2. Deploy ke lingkungan preview
npx vercel

# 3. Deploy langsung ke produksi
npx vercel --prod
```

---

## 📁 Struktur Direktori

```
cool-heisenberg/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── vaac/
│   │   │       └── route.ts          # Serverless route handler (fetching live data, caching, parsing)
│   │   ├── layout.tsx                # Layout root & metadata SEO
│   │   ├── page.tsx                  # Halaman dashboard utama
│   │   └── globals.css               # Styling global Tailwind & Leaflet
│   ├── components/
│   │   ├── HeaderNavbar.tsx          # Navigasi atas, jam live WIB/UTC, status feed
│   │   ├── StatisticsCards.tsx       # Kartu statistik ringkasan data
│   │   ├── VolcanoSidebar.tsx        # Panel pemilihan gunung & filter wilayah
│   │   ├── VolcanoMap.tsx            # Peta Leaflet GIS dengan poligon sebaran abu
│   │   ├── MapWrapper.tsx            # Dynamic wrapper client-side untuk Leaflet
│   │   ├── AdvisoryDetailModal.tsx   # Modal rincian buletin ICAO & ekspor GeoJSON
│   │   └── ScenarioSimulator.tsx     # Simulator skenario sebaran abu
│   ├── data/
│   │   └── volcanoesIndonesia.ts     # Database terkurasi gunung api aktif Indonesia
│   ├── types/
│   │   └── vaac.ts                   # Definisi tipe TypeScript
│   └── lib/
│       ├── parseSigmet.ts            # Parser koordinat buletin ICAO (OBS & FCST)
│       └── utils.ts                  # Helper format waktu & skenario simulasi
├── next.config.mjs                   # Konfigurasi Next.js untuk Vercel
├── tailwind.config.ts                # Konfigurasi tema Tailwind CSS
├── tsconfig.json                     # Konfigurasi TypeScript
├── package.json
└── README.md
```

---

## 🛡️ Sumber Data & Atribusi

- **Live SIGMET Feed**: [NOAA Aviation Weather Center (AWC)](https://aviationweather.gov/)
- **Pusat Informasi Abu Vulkanik**: [Darwin VAAC (Bureau of Meteorology Australia)](http://www.bom.gov.au/aviation/volcanic-ash/)
- **Data Status Gunung Api Indonesia**: [Pusat Vulkanologi dan Mitigasi Bencana Geologi (PVMBG) / MAGMA Indonesia](https://magma.esdm.go.id/)
- **Peta Dasar**: OpenStreetMap, CARTO Dark Matter, dan Esri World Imagery.

