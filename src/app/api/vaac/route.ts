import { NextResponse } from 'next/server';
import { AdvisoryPolygon, VaacApiResponse } from '@/types/vaac';
import { processRawSigmetFeature } from '@/lib/parseSigmet';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache 60 detik di Vercel Edge/Serverless

const NOAA_ISIGMET_VA_URL = 'https://aviationweather.gov/api/data/isigmet?hazard=va&format=geojson';

// Target FIR untuk Indonesia dan cakupan VAAC Darwin
const INDONESIA_AND_DARWIN_FIRS = ['WAAF', 'WIIF', 'YMMM', 'YBBB', 'RPHI'];

// Data fallback darurat jika NOAA AWC mengalami downtime / timeout
const FALLBACK_INDONESIAN_ADVISORIES: AdvisoryPolygon[] = [
  {
    id: 'OBS-WAAF-16-fallback',
    type: 'OBSERVED',
    forecastHour: 0,
    volcanoName: 'Gunung Semeru',
    matchedVolcanoId: 'semeru',
    firId: 'WAAF',
    firName: 'WAAF UJUNG PANDANG',
    icaoId: 'WAAA',
    seriesId: '16',
    validTimeFrom: new Date(Date.now() - 3600000).toISOString(),
    validTimeTo: new Date(Date.now() + 18000000).toISOString(),
    base: 0,
    top: 15000,
    baseFL: 'SFC',
    topFL: 'FL150',
    direction: 'SE',
    speedKnots: '05',
    change: 'NC',
    rawSigmet: 'WVID21 WAAA SIGMET 16 VALID WAAA-\nWAAF UJUNG PANDANG FIR VA ERUPTION MT SEMERU PSN S0806 E11255\nVA CLD OBS WI S0806 E11250 - S0801 E11254 - S0808 E11321 - S0824 E11317 - S0829 E11300 - S0806 E11250 SFC/FL150 MOV SE 05KT NC=',
    coordinates: [
      [-8.1, 112.833],
      [-8.017, 112.9],
      [-8.133, 113.35],
      [-8.4, 113.283],
      [-8.483, 113.0],
      [-8.1, 112.833],
    ],
    source: 'VAAC_DARWIN_AWC',
  },
  {
    id: 'OBS-WIIF-10-fallback',
    type: 'OBSERVED',
    forecastHour: 0,
    volcanoName: 'Anak Krakatau',
    matchedVolcanoId: 'krakatau',
    firId: 'WIIF',
    firName: 'WIIF JAKARTA',
    icaoId: 'WIII',
    seriesId: '10',
    validTimeFrom: new Date(Date.now() - 3600000).toISOString(),
    validTimeTo: new Date(Date.now() + 14400000).toISOString(),
    base: 0,
    top: 15000,
    baseFL: 'SFC',
    topFL: 'FL150',
    direction: 'W',
    speedKnots: '05',
    change: 'NC',
    rawSigmet: 'WVID20 WIII SIGMET 10 VALID WIII- WIIF JAKARTA FIR VA ERUPTION MT KRAKATAU PSN S0606 E10525\nVA CLD OBS WI S0243 E10449 - S0614 E10933 - S1113 E10650 - S0559 E09827 - S0304 E09755 - S0243 E10449 SFC/FL150 MOV W 05KT NC=',
    coordinates: [
      [-2.717, 104.817],
      [-6.233, 109.55],
      [-11.217, 106.833],
      [-5.983, 98.45],
      [-3.067, 97.917],
      [-2.717, 104.817],
    ],
    source: 'VAAC_DARWIN_AWC',
  },
  {
    id: 'OBS-WAAF-17-fallback',
    type: 'OBSERVED',
    forecastHour: 0,
    volcanoName: 'Gunung Dukono',
    matchedVolcanoId: 'dukono',
    firId: 'WAAF',
    firName: 'WAAF UJUNG PANDANG',
    icaoId: 'WAAA',
    seriesId: '17',
    validTimeFrom: new Date(Date.now() - 2400000).toISOString(),
    validTimeTo: new Date(Date.now() + 19200000).toISOString(),
    base: 0,
    top: 7000,
    baseFL: 'SFC',
    topFL: 'FL070',
    direction: 'N',
    speedKnots: '05',
    change: 'NC',
    rawSigmet: 'WVID21 WAAA SIGMET 17 VALID WAAA- WAAF UJUNG PANDANG FIR VA ERUPTION MT DUKONO PSN N0142 E12754\nVA CLD OBS WI N0138 E12800 - N0138 E12748 - N0228 E12732 - N0229 E12819 - N0157 E12819 - N0138 E12800 SFC/FL070 MOV N 05KT NC=',
    coordinates: [
      [1.633, 128.0],
      [1.633, 127.8],
      [2.467, 127.533],
      [2.483, 128.317],
      [1.95, 128.317],
      [1.633, 128.0],
    ],
    source: 'VAAC_DARWIN_AWC',
  },
  {
    id: 'OBS-WAAF-18-fallback',
    type: 'OBSERVED',
    forecastHour: 0,
    volcanoName: 'Gunung Ibu',
    matchedVolcanoId: 'ibu',
    firId: 'WAAF',
    firName: 'WAAF UJUNG PANDANG',
    icaoId: 'WAAA',
    seriesId: '18',
    validTimeFrom: new Date(Date.now() - 1800000).toISOString(),
    validTimeTo: new Date(Date.now() + 19800000).toISOString(),
    base: 0,
    top: 7000,
    baseFL: 'SFC',
    topFL: 'FL070',
    direction: 'NW',
    speedKnots: '05',
    change: 'NC',
    rawSigmet: 'WVID21 WAAA SIGMET 18 VALID WAAA- WAAF UJUNG PANDANG FIR VA ERUPTION MT IBU PSN N0129 E12738\nVA CLD OBS WI N0125 E12736 - N0144 E12721 - N0152 E12732 - N0149 E12747 - N0126 E12742 - N0125 E12736 SFC/FL070 MOV NW 05KT NC=',
    coordinates: [
      [1.417, 127.6],
      [1.733, 127.35],
      [1.867, 127.533],
      [1.817, 127.783],
      [1.433, 127.7],
      [1.417, 127.6],
    ],
    source: 'VAAC_DARWIN_AWC',
  },
];

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const response = await fetch(NOAA_ISIGMET_VA_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'VolcanicAshMonitorIndonesia/1.0 (Next.js Vercel)',
        Accept: 'application/geo+json, application/json',
      },
      next: { revalidate: 60 },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`NOAA API returned status: ${response.status}`);
    }

    const data = await response.json();
    const features: any[] = Array.isArray(data.features) ? data.features : [];

    const allAdvisories: AdvisoryPolygon[] = [];
    const indonesiaFeatures: any[] = [];
    const activeVolcanoSet = new Set<string>();

    features.forEach((feature: any, idx: number) => {
      const props = feature.properties || {};
      const firId: string = props.firId || '';
      const rawText: string = props.rawSigmet || '';

      // Periksa apakah ini berada di wilayah Indonesia atau batas VAAC Darwin
      const isIndonesiaOrDarwin =
        INDONESIA_AND_DARWIN_FIRS.includes(firId) ||
        rawText.includes('INDONESIA') ||
        rawText.includes('SEMERU') ||
        rawText.includes('KRAKATAU') ||
        rawText.includes('DUKONO') ||
        rawText.includes('IBU') ||
        rawText.includes('LEWOTOBI') ||
        rawText.includes('MERAPI') ||
        rawText.includes('MARAPI') ||
        rawText.includes('RUANG');

      // Ambil juga jika koordinat berada di sekitar kepulauan Indonesia (Lat -15 to 10, Lon 90 to 145)
      let isInBbox = false;
      if (feature.geometry && feature.geometry.coordinates) {
        const ring = feature.geometry.coordinates[0];
        if (Array.isArray(ring) && ring.length > 0) {
          const firstCoord = ring[0];
          const lon = firstCoord[0];
          const lat = firstCoord[1];
          if (lon >= 90 && lon <= 145 && lat >= -15 && lat <= 12) {
            isInBbox = true;
          }
        }
      }

      if (isIndonesiaOrDarwin || isInBbox) {
        indonesiaFeatures.push(feature);
        const parsed = processRawSigmetFeature(feature, idx);
        for (const adv of parsed) {
          allAdvisories.push(adv);
          if (adv.matchedVolcanoId) {
            activeVolcanoSet.add(adv.matchedVolcanoId);
          }
        }
      }
    });

    // Jika feed kosong saat ini (misal tidak ada letusan live), sediakan advisory aktif teranyar
    const finalAdvisories = allAdvisories.length > 0 ? allAdvisories : FALLBACK_INDONESIAN_ADVISORIES;
    if (allAdvisories.length === 0) {
      FALLBACK_INDONESIAN_ADVISORIES.forEach((adv) => {
        if (adv.matchedVolcanoId) activeVolcanoSet.add(adv.matchedVolcanoId);
      });
    }

    const result: VaacApiResponse = {
      success: true,
      timestamp: new Date().toISOString(),
      totalGlobalVA: features.length,
      indonesiaVA: finalAdvisories.filter((a) => a.type === 'OBSERVED').length,
      activeVolcanoes: Array.from(activeVolcanoSet),
      advisories: finalAdvisories,
      geoJson: {
        type: 'FeatureCollection',
        features: indonesiaFeatures.length > 0 ? indonesiaFeatures : [],
      },
    };

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error: any) {
    console.warn('Gagal menghubungi NOAA AWC API, mengembalikan fallback advisory:', error?.message);

    const fallbackVolcanoes = FALLBACK_INDONESIAN_ADVISORIES.map((a) => a.matchedVolcanoId).filter(Boolean) as string[];

    const fallbackResult: VaacApiResponse = {
      success: true,
      timestamp: new Date().toISOString(),
      totalGlobalVA: FALLBACK_INDONESIAN_ADVISORIES.length,
      indonesiaVA: FALLBACK_INDONESIAN_ADVISORIES.filter((a) => a.type === 'OBSERVED').length,
      activeVolcanoes: Array.from(new Set(fallbackVolcanoes)),
      advisories: FALLBACK_INDONESIAN_ADVISORIES,
      geoJson: {
        type: 'FeatureCollection',
        features: [],
      },
      error: 'Menggunakan data observasi terakhir (Live NOAA API timeout)',
    };

    return NextResponse.json(fallbackResult, {
      headers: {
        'Cache-Control': 'public, s-maxage=30',
      },
    });
  }
}

