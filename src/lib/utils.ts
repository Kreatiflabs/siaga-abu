import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AdvisoryPolygon, AlertLevel, Volcano } from '@/types/vaac';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(isoString?: string): { utc: string; wib: string } {
  if (!isoString) return { utc: '-', wib: '-' };
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return { utc: isoString, wib: isoString };

    const utcStr = d.toUTCString().replace('GMT', 'UTC');
    const wibStr = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d) + ' WIB';

    return { utc: utcStr, wib: wibStr };
  } catch {
    return { utc: isoString, wib: isoString };
  }
}

export function getAlertBadgeInfo(level: AlertLevel): {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  desc: string;
} {
  switch (level) {
    case 4:
      return {
        label: 'Level IV (Awas)',
        bgClass: 'bg-red-500/20',
        textClass: 'text-red-400 font-bold',
        borderClass: 'border-red-500/50',
        desc: 'Erupsi eksplosif atau ancaman letusan utama segera/sedang terjadi.',
      };
    case 3:
      return {
        label: 'Level III (Siaga)',
        bgClass: 'bg-orange-500/20',
        textClass: 'text-orange-400 font-semibold',
        borderClass: 'border-orange-500/50',
        desc: 'Peningkatan aktivitas seismik dan erupsi abu/awan panas signifikan.',
      };
    case 2:
      return {
        label: 'Level II (Waspada)',
        bgClass: 'bg-amber-500/20',
        textClass: 'text-amber-400 font-medium',
        borderClass: 'border-amber-500/50',
        desc: 'Aktivitas di atas normal, potensi erupsi freatik atau hembusan asap.',
      };
    default:
      return {
        label: 'Level I (Normal)',
        bgClass: 'bg-emerald-500/20',
        textClass: 'text-emerald-400',
        borderClass: 'border-emerald-500/40',
        desc: 'Aktivitas vulkanik dalam batas normal tanpa tanda peningkatan erupsi.',
      };
  }
}

/**
 * Membuat poligon skenario simulasi sebaran abu vulkanik untuk gunung yang sedang dipilih
 * Berguna saat pengguna ingin menguji analisis jalur penerbangan dan sebaran abu hipotetis.
 */
export function generateSimulationAdvisory(
  volcano: Volcano,
  windDirection: 'W' | 'E' | 'NW' | 'SE' = 'W',
  topFLNumber: number = 250
): AdvisoryPolygon[] {
  const baseLat = volcano.lat;
  const baseLon = volcano.lon;

  // Hitung offset berdasarkan arah angin
  let dLat = 0;
  let dLon = 0;
  if (windDirection === 'W') {
    dLon = -1.2;
    dLat = 0.1;
  } else if (windDirection === 'NW') {
    dLon = -0.9;
    dLat = 0.8;
  } else if (windDirection === 'SE') {
    dLon = 1.0;
    dLat = -0.7;
  } else {
    dLon = 1.2;
    dLat = -0.1;
  }

  // 1. Poligon Observed (SFC hingga topFL)
  const obsPoints: [number, number][] = [
    [baseLat - 0.15, baseLon - 0.15],
    [baseLat + 0.15, baseLon - 0.12],
    [baseLat + dLat * 0.7 + 0.35, baseLon + dLon * 0.7 + 0.25],
    [baseLat + dLat + 0.1, baseLon + dLon + 0.1],
    [baseLat + dLat - 0.25, baseLon + dLon - 0.15],
    [baseLat + dLat * 0.6 - 0.3, baseLon + dLon * 0.6 - 0.2],
    [baseLat - 0.15, baseLon - 0.15],
  ];

  // 2. Poligon Forecast (+6HR)
  const fcstPoints: [number, number][] = [
    [baseLat + dLat * 0.5 - 0.2, baseLon + dLon * 0.5 - 0.2],
    [baseLat + dLat * 0.5 + 0.3, baseLon + dLon * 0.5 + 0.2],
    [baseLat + dLat * 1.8 + 0.45, baseLon + dLon * 1.8 + 0.35],
    [baseLat + dLat * 2.2 + 0.1, baseLon + dLon * 2.2 + 0.1],
    [baseLat + dLat * 2.1 - 0.35, baseLon + dLon * 2.1 - 0.25],
    [baseLat + dLat * 1.2 - 0.4, baseLon + dLon * 1.2 - 0.3],
    [baseLat + dLat * 0.5 - 0.2, baseLon + dLon * 0.5 - 0.2],
  ];

  const now = new Date();
  const validUntil = new Date(now.getTime() + 6 * 3600 * 1000);
  const nowIso = now.toISOString();
  const validUntilIso = validUntil.toISOString();

  const fir = volcano.region === 'Sumatera' || volcano.region === 'Jawa' ? 'WIIF' : 'WAAF';
  const firName = fir === 'WIIF' ? 'WIIF JAKARTA' : 'WAAF UJUNG PANDANG';

  const obsAdvisory: AdvisoryPolygon = {
    id: `SIM-OBS-${volcano.id}`,
    type: 'OBSERVED',
    forecastHour: 0,
    volcanoName: volcano.name,
    matchedVolcanoId: volcano.id,
    firId: fir,
    firName: firName,
    icaoId: fir === 'WIIF' ? 'WIII' : 'WAAA',
    seriesId: 'SIM-01',
    validTimeFrom: nowIso,
    validTimeTo: validUntilIso,
    base: 0,
    top: topFLNumber * 100,
    baseFL: 'SFC',
    topFL: `FL${topFLNumber.toString().padStart(3, '0')}`,
    direction: windDirection,
    speedKnots: '15',
    change: 'NC',
    rawSigmet: `SIMULASI SKENARIO VAAC DARWIN:\n${fir} SIGMET SIM-01 VALID ${nowIso}/${validUntilIso} -\n${firName} FIR VA ERUPTION ${volcano.name.toUpperCase()} PSN ${volcano.lat.toFixed(2)} ${volcano.lon.toFixed(2)}\nVA CLD OBS SFC/FL${topFLNumber} MOV ${windDirection} 15KT NC=`,
    coordinates: obsPoints,
    source: 'SIMULATION',
  };

  const fcstAdvisory: AdvisoryPolygon = {
    id: `SIM-FCST-${volcano.id}`,
    type: 'FORECAST',
    forecastHour: 6,
    volcanoName: volcano.name,
    matchedVolcanoId: volcano.id,
    firId: fir,
    firName: firName,
    icaoId: fir === 'WIIF' ? 'WIII' : 'WAAA',
    seriesId: 'SIM-01',
    validTimeFrom: nowIso,
    validTimeTo: validUntilIso,
    base: 0,
    top: topFLNumber * 100,
    baseFL: 'SFC',
    topFL: `FL${topFLNumber.toString().padStart(3, '0')}`,
    direction: windDirection,
    speedKnots: '15',
    change: 'NC',
    rawSigmet: `SIMULASI SKENARIO PROGNOSA +6HR VAAC DARWIN:\nFCST AT +6HR AREA SEBARAN ABU VULKANIK FL${topFLNumber}=`,
    coordinates: fcstPoints,
    source: 'SIMULATION',
  };

  return [obsAdvisory, fcstAdvisory];
}

