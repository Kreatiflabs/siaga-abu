export type IndonesianRegion =
  | 'Sumatera'
  | 'Jawa'
  | 'Bali & Nusa Tenggara'
  | 'Maluku'
  | 'Sulawesi';

export type AlertLevel = 1 | 2 | 3 | 4; // 1: Normal, 2: Waspada, 3: Siaga, 4: Awas

export interface Volcano {
  id: string;
  name: string;
  aliases: string[];
  lat: number;
  lon: number;
  elevation: number; // mdpl
  type: string;
  region: IndonesianRegion;
  province: string;
  alertLevel: AlertLevel;
  lastEruption?: string;
  hasActiveAsh?: boolean;
  advisoryIds?: string[];
  description?: string;
}

export type PolygonType = 'OBSERVED' | 'FORECAST';

export interface AdvisoryPolygon {
  id: string;
  type: PolygonType;
  forecastHour?: number; // 0 for OBS, 6, 12, 18 for FCST
  volcanoName: string;
  matchedVolcanoId?: string;
  firId: string;
  firName: string;
  icaoId: string;
  seriesId: string;
  validTimeFrom: string;
  validTimeTo: string;
  base: number; // in feet (0 = SFC)
  top: number; // in feet (e.g. 15000 = FL150)
  baseFL: string; // e.g. "SFC" or "FL050"
  topFL: string; // e.g. "FL150"
  direction: string | null; // e.g. "SE", "W"
  speedKnots: string | null; // e.g. "05", "15"
  change: string | null; // "NC" (No change), "INTSF" (Intensifying), "WKN" (Weakening)
  rawSigmet: string;
  coordinates: [number, number][]; // [lat, lng] for Leaflet polygon
  source: 'VAAC_DARWIN_AWC' | 'SIMULATION';
}

export interface VaacApiResponse {
  success: boolean;
  timestamp: string;
  totalGlobalVA: number;
  indonesiaVA: number;
  activeVolcanoes: string[];
  advisories: AdvisoryPolygon[];
  geoJson: {
    type: 'FeatureCollection';
    features: any[];
  };
  error?: string;
}

export interface MapViewport {
  center: [number, number];
  zoom: number;
}

