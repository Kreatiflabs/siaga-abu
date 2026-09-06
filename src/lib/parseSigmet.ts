import { AdvisoryPolygon, Volcano } from '@/types/vaac';
import { VOLCANOES_INDONESIA } from '@/data/volcanoesIndonesia';

/**
 * Konversi koordinat ICAO SIGMET format (e.g. "S0806", "E11250", "N0129", "W07739") ke desimal derajat.
 */
export function parseIcaoCoord(latStr: string, lonStr: string): [number, number] | null {
  try {
    const cleanLat = latStr.trim().toUpperCase();
    const cleanLon = lonStr.trim().toUpperCase();

    // Parse Latitude: N/S dilanjutkan 2 digit derajat dan 2 digit menit (e.g. S0806, N0142)
    const latMatch = cleanLat.match(/^([NS])(\d{2})(\d{2})?$/);
    if (!latMatch) return null;
    const latHemi = latMatch[1];
    const latDeg = parseInt(latMatch[2], 10);
    const latMin = latMatch[3] ? parseInt(latMatch[3], 10) : 0;
    let lat = latDeg + latMin / 60;
    if (latHemi === 'S') lat = -lat;

    // Parse Longitude: E/W dilanjutkan 3 digit derajat dan 2 digit menit (e.g. E11250, E09602, W07739)
    const lonMatch = cleanLon.match(/^([EW])(\d{2,3})(\d{2})?$/);
    if (!lonMatch) return null;
    const lonHemi = lonMatch[1];
    const lonDeg = parseInt(lonMatch[2], 10);
    const lonMin = lonMatch[3] ? parseInt(lonMatch[3], 10) : 0;
    let lon = lonDeg + lonMin / 60;
    if (lonHemi === 'W') lon = -lon;

    return [lat, lon];
  } catch {
    return null;
  }
}

/**
 * Ekstraksi poligon dari rangkaian teks koordinat seperti:
 * "S0806 E11250 - S0801 E11254 - S0808 E11321 - S0824 E11317 - S0829 E11300 - S0806 E11250"
 */
export function parseCoordinateString(coordStr: string): [number, number][] {
  const points: [number, number][] = [];
  const segments = coordStr.split(/[-–—]/).map((s) => s.trim());

  for (const seg of segments) {
    const parts = seg.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const coord = parseIcaoCoord(parts[0], parts[1]);
      if (coord) {
        points.push(coord);
      }
    }
  }

  // Jika belum tertutup (titik akhir != titik awal), tutup poligon
  if (points.length > 2) {
    const first = points[0];
    const last = points[points.length - 1];
    if (Math.abs(first[0] - last[0]) > 0.001 || Math.abs(first[1] - last[1]) > 0.001) {
      points.push([first[0], first[1]]);
    }
  }

  return points;
}

/**
 * Cari objek Gunung Api terdekat atau cocok nama
 */
export function matchVolcano(
  nameQualifier: string,
  rawText: string,
  coords?: [number, number][]
): Volcano | undefined {
  const cleanQualifier = nameQualifier.trim().toUpperCase();

  // 1. Cocokkan dengan nama atau alias
  for (const v of VOLCANOES_INDONESIA) {
    if (cleanQualifier && (v.name.toUpperCase().includes(cleanQualifier) || v.aliases.some(a => a.includes(cleanQualifier)))) {
      return v;
    }
    for (const alias of v.aliases) {
      if (cleanQualifier === alias || (cleanQualifier.length > 3 && alias.includes(cleanQualifier))) {
        return v;
      }
      if (rawText.toUpperCase().includes(alias)) {
        return v;
      }
    }
  }

  // 2. Cocokkan berdasarkan koordinat pusat poligon jika tersedia
  if (coords && coords.length > 0) {
    const centerLat = coords.reduce((sum, p) => sum + p[0], 0) / coords.length;
    const centerLon = coords.reduce((sum, p) => sum + p[1], 0) / coords.length;

    let closestVolcano: Volcano | undefined;
    let minDistance = 1.8; // Radius toleransi ~200 km

    for (const v of VOLCANOES_INDONESIA) {
      const dist = Math.hypot(v.lat - centerLat, v.lon - centerLon);
      if (dist < minDistance) {
        minDistance = dist;
        closestVolcano = v;
      }
    }
    if (closestVolcano) return closestVolcano;
  }

  return undefined;
}

/**
 * Format ketinggian Flight Level
 */
export function formatFlightLevel(base: number, top: number): { baseFL: string; topFL: string } {
  const baseFL = base <= 0 ? 'SFC' : `FL${Math.round(base / 100).toString().padStart(3, '0')}`;
  const topFL = top > 0 ? `FL${Math.round(top / 100).toString().padStart(3, '0')}` : 'FL---';
  return { baseFL, topFL };
}

/**
 * Parse data GeoJSON dari NOAA/AWC iSIGMET feature menjadi list AdvisoryPolygon
 * Mengembalikan array poligon (Observed + Forecast jika ada di raw text).
 */
export function processRawSigmetFeature(feature: any, index: number): AdvisoryPolygon[] {
  const props = feature.properties || {};
  const rawText: string = props.rawSigmet || '';
  const qualifier: string = props.qualifier || '';
  const firId: string = props.firId || '';
  const firName: string = props.firName || '';
  const icaoId: string = props.icaoId || '';
  const seriesId: string = props.seriesId || `${index + 1}`;
  const validTimeFrom: string = props.validTimeFrom || new Date().toISOString();
  const validTimeTo: string = props.validTimeTo || new Date().toISOString();
  const base = typeof props.base === 'number' ? props.base : 0;
  const top = typeof props.top === 'number' ? props.top : 15000;
  const direction: string | null = props.dir || null;
  const speedKnots: string | null = props.spd || null;
  const change: string | null = props.chng || 'NC';

  const { baseFL, topFL } = formatFlightLevel(base, top);

  // Koordinat poligon Observed dari geometry GeoJSON (GeoJSON: [lon, lat])
  let observedCoords: [number, number][] = [];
  if (feature.geometry && feature.geometry.type === 'Polygon' && Array.isArray(feature.geometry.coordinates)) {
    const rawRing = feature.geometry.coordinates[0] || [];
    observedCoords = rawRing.map((pt: [number, number]) => [pt[1], pt[0]]); // Leaflet: [lat, lon]
  }

  // Identifikasi nama gunung
  let volcanoName = qualifier;
  if (!volcanoName) {
    const match = rawText.match(/(?:ERUPTION MT|MT|VOLCANO|MOUNT)\s+([A-Z0-9\s-]+?)(?=\s+PSN|\s+VA|\s+LOC|\s+WI|\s+AT)/i);
    if (match) {
      volcanoName = match[1].trim();
    } else {
      volcanoName = 'GUNUNG API (VA)';
    }
  }

  const matchedVolcano = matchVolcano(volcanoName, rawText, observedCoords);

  const results: AdvisoryPolygon[] = [];

  // 1. Poligon OBSERVED
  if (observedCoords.length > 2) {
    results.push({
      id: `OBS-${firId}-${seriesId}-${index}`,
      type: 'OBSERVED',
      forecastHour: 0,
      volcanoName: matchedVolcano?.name || volcanoName,
      matchedVolcanoId: matchedVolcano?.id,
      firId,
      firName,
      icaoId,
      seriesId,
      validTimeFrom,
      validTimeTo,
      base,
      top,
      baseFL,
      topFL,
      direction,
      speedKnots,
      change,
      rawSigmet: rawText,
      coordinates: observedCoords,
      source: 'VAAC_DARWIN_AWC',
    });
  }

  // 2. Cek apakah ada Poligon FORECAST (FCST) di dalam rawSigmet
  // Contoh: "FCST AT 0230Z WI S1447 E09602 - S2109 E09843 - ..."
  const fcstMatch = rawText.match(/FCST(?:\s+AT\s+[0-9]{4}Z)?\s+WI\s+([NSEW0-9\s\-–—]+?)(?==|$)/i);
  if (fcstMatch && fcstMatch[1]) {
    const fcstCoords = parseCoordinateString(fcstMatch[1]);
    if (fcstCoords.length > 2) {
      results.push({
        id: `FCST-${firId}-${seriesId}-${index}`,
        type: 'FORECAST',
        forecastHour: 6,
        volcanoName: matchedVolcano?.name || volcanoName,
        matchedVolcanoId: matchedVolcano?.id,
        firId,
        firName,
        icaoId,
        seriesId,
        validTimeFrom,
        validTimeTo,
        base,
        top,
        baseFL,
        topFL,
        direction,
        speedKnots,
        change,
        rawSigmet: rawText,
        coordinates: fcstCoords,
        source: 'VAAC_DARWIN_AWC',
      });
    }
  }

  return results;
}

