'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Volcano, AdvisoryPolygon } from '@/types/vaac';
import { Layers, Maximize2, RotateCcw, Flame, Wind, Eye } from 'lucide-react';
import { formatDateTime, getAlertBadgeInfo } from '@/lib/utils';

interface VolcanoMapProps {
  volcanoes: Volcano[];
  advisories: AdvisoryPolygon[];
  selectedVolcano: Volcano | null;
  onSelectVolcano: (volcano: Volcano) => void;
  onSelectAdvisory: (advisory: AdvisoryPolygon) => void;
}

type TileLayerType = 'dark' | 'streets' | 'satellite';

const TILE_SERVERS: Record<TileLayerType, { url: string; attribution: string }> = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
  },
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye',
  },
};

export const VolcanoMap: React.FC<VolcanoMapProps> = ({
  volcanoes,
  advisories,
  selectedVolcano,
  onSelectVolcano,
  onSelectAdvisory,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const polygonsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [currentTile, setCurrentTile] = useState<TileLayerType>('dark');
  const [showLegend, setShowLegend] = useState(true);

  // Inisialisasi Peta Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center di Indonesia: [-2.5, 118.0], zoom 5
    const map = L.map(mapContainerRef.current, {
      center: [-2.5, 118.0],
      zoom: 5,
      zoomControl: false,
      minZoom: 4,
      maxZoom: 18,
    });

    // Zoom control di kanan atas
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Tile layer awal
    const tile = L.tileLayer(TILE_SERVERS.dark.url, {
      attribution: TILE_SERVERS.dark.attribution,
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tile;

    // Layer groups untuk poligon dan marker
    const polygonsGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    polygonsLayerGroupRef.current = polygonsGroup;
    markersLayerGroupRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer saat dipilih
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newTile = L.tileLayer(TILE_SERVERS[currentTile].url, {
      attribution: TILE_SERVERS[currentTile].attribution,
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTile;
  }, [currentTile]);

  // Render Poligon Abu Vulkanik (OBS & FCST)
  useEffect(() => {
    if (!mapInstanceRef.current || !polygonsLayerGroupRef.current) return;
    const group = polygonsLayerGroupRef.current;
    group.clearLayers();

    advisories.forEach((adv) => {
      const isObserved = adv.type === 'OBSERVED';
      const color = isObserved ? '#ef4444' : '#f59e0b'; // Merah untuk OBS, Amber untuk FCST
      const fillColor = isObserved ? '#dc2626' : '#d97706';

      const polygon = L.polygon(adv.coordinates, {
        color: color,
        fillColor: fillColor,
        fillOpacity: isObserved ? 0.35 : 0.2,
        weight: isObserved ? 2.5 : 2,
        dashArray: isObserved ? undefined : '6, 6',
        className: isObserved ? 'leaflet-ash-observed' : 'leaflet-ash-forecast',
      });

      // Tooltip hover
      polygon.bindTooltip(
        `<strong>${adv.volcanoName}</strong><br/>${isObserved ? '🔴 Area Teramati (OBS)' : '🟡 Prediksi +6 Jam (FCST)'}<br/>Top: ${adv.topFL}`,
        { sticky: true, className: 'leaflet-custom-tooltip' }
      );

      // Popup klik
      const { wib } = formatDateTime(adv.validTimeTo);
      const popupContent = `
        <div style="font-family: inherit; min-width: 200px; color: #0f172a;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: ${color};">
            ${isObserved ? '🔴 OBSERVED ASH CLOUD' : '🟡 FORECAST ASH CLOUD (+6HR)'}
          </div>
          <div style="font-size: 13px; font-weight: 600; margin-bottom: 6px;">
            ${adv.volcanoName}
          </div>
          <div style="font-size: 11px; line-height: 1.5; color: #334155;">
            <div><strong>Flight Level:</strong> ${adv.baseFL} / ${adv.topFL}</div>
            <div><strong>Arah & Kecepatan:</strong> ${adv.direction || '-'} ${adv.speedKnots ? `${adv.speedKnots} KT` : ''}</div>
            <div><strong>FIR:</strong> ${adv.firName} (${adv.firId})</div>
            <div><strong>Berlaku s/d:</strong> ${wib}</div>
          </div>
        </div>
      `;

      polygon.bindPopup(popupContent);
      polygon.on('click', () => {
        onSelectAdvisory(adv);
      });

      group.addLayer(polygon);
    });
  }, [advisories, onSelectAdvisory]);

  // Render Marker Gunung Api Indonesia
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerGroupRef.current) return;
    const group = markersLayerGroupRef.current;
    group.clearLayers();

    // Buat set gunung yang punya advisory aktif
    const activeVolcanoIds = new Set(
      advisories.map((a) => a.matchedVolcanoId).filter(Boolean)
    );

    volcanoes.forEach((volcano) => {
      const hasActiveAsh = activeVolcanoIds.has(volcano.id);
      const isSelected = selectedVolcano?.id === volcano.id;
      const alertBadge = getAlertBadgeInfo(volcano.alertLevel);

      let iconHtml = '';

      if (hasActiveAsh) {
        // Marker Erupsi Aktif dengan animasi api & pulse
        iconHtml = `
          <div class="relative flex items-center justify-center">
            <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-500 opacity-60"></span>
            <div class="relative w-7 h-7 rounded-full bg-red-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold transform ${
              isSelected ? 'scale-125 ring-4 ring-amber-400' : ''
            }">
              🌋
            </div>
          </div>
        `;
      } else if (volcano.alertLevel >= 3) {
        // Siaga (Level 3) / Awas (Level 4)
        iconHtml = `
          <div class="relative w-5 h-5 rounded-full bg-orange-600 border-2 border-white shadow-md flex items-center justify-center text-[10px] text-white font-bold transform ${
            isSelected ? 'scale-125 ring-4 ring-amber-400' : ''
          }">
            ▲
          </div>
        `;
      } else if (volcano.alertLevel === 2) {
        // Waspada (Level 2)
        iconHtml = `
          <div class="relative w-4 h-4 rounded-full bg-amber-500 border border-white shadow-sm flex items-center justify-center text-[8px] text-slate-900 font-bold transform ${
            isSelected ? 'scale-125 ring-4 ring-amber-400' : ''
          }">
            ●
          </div>
        `;
      } else {
        // Normal (Level 1)
        iconHtml = `
          <div class="relative w-3 h-3 rounded-full bg-emerald-500/80 border border-slate-700 shadow-sm transform ${
            isSelected ? 'scale-150 ring-2 ring-white' : ''
          }">
          </div>
        `;
      }

      const customIcon = L.divIcon({
        className: 'custom-volcano-marker',
        html: iconHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([volcano.lat, volcano.lon], { icon: customIcon });

      // Popup interaktif
      const popupHtml = `
        <div style="font-family: inherit; min-width: 180px; color: #0f172a;">
          <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">
            ${volcano.name}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            ${volcano.province} · ${volcano.elevation.toLocaleString('id-ID')} mdpl
          </div>
          <div style="margin-bottom: 6px;">
            <span style="font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 600; background: ${
              hasActiveAsh ? '#fee2e2; color: #991b1b;' : '#fef3c7; color: #92400e;'
            }">
              ${hasActiveAsh ? '⚠️ PERINGATAN ABU AKTIF' : alertBadge.label}
            </span>
          </div>
          <p style="font-size: 11px; color: #334155; margin-bottom: 8px;">
            ${volcano.description || 'Gunung api aktif Indonesia'}
          </p>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        onSelectVolcano(volcano);
      });

      group.addLayer(marker);
    });
  }, [volcanoes, advisories, selectedVolcano, onSelectVolcano]);

  // Efek FlyTo saat gunung dipilih
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedVolcano) return;
    mapInstanceRef.current.flyTo([selectedVolcano.lat, selectedVolcano.lon], 8, {
      duration: 1.2,
    });
  }, [selectedVolcano]);

  // Reset view peta ke Indonesia
  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([-2.5, 118.0], 5, { duration: 1 });
  };

  return (
    <div className="relative w-full h-[600px] lg:h-[720px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Kontainer Peta Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Kontrol Kanan Atas: Switcher Layer & Reset View */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        {/* Layer Switcher */}
        <div className="bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-xl p-1 flex items-center gap-1 shadow-lg">
          <button
            onClick={() => setCurrentTile('dark')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              currentTile === 'dark'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Dark Matter
          </button>
          <button
            onClick={() => setCurrentTile('satellite')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              currentTile === 'satellite'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Satelit Esri
          </button>
          <button
            onClick={() => setCurrentTile('streets')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
              currentTile === 'streets'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            OpenStreetMap
          </button>
        </div>

        {/* Tombol Reset Zoom */}
        <button
          onClick={handleResetView}
          className="bg-slate-900/90 hover:bg-slate-800 backdrop-blur border border-slate-700/80 text-slate-300 hover:text-white p-2 rounded-xl shadow-lg transition"
          title="Reset Tampilan ke Seluruh Indonesia"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Legenda Peta (Bawah Kiri) */}
      <div className="absolute bottom-4 left-4 z-10">
        {showLegend ? (
          <div className="bg-slate-900/95 backdrop-blur border border-slate-800 rounded-xl p-3 shadow-xl text-xs text-slate-200 max-w-xs">
            <div className="flex items-center justify-between font-bold text-slate-100 mb-2 pb-1 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-red-400" />
                Legenda Simbol & Poligon
              </span>
              <button
                onClick={() => setShowLegend(false)}
                className="text-slate-500 hover:text-slate-300 text-xs px-1"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-4 h-3 bg-red-500/40 border border-red-500 rounded-sm"></span>
                <span>Poligon Abu Teramati (Observed)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-3 bg-amber-500/30 border border-amber-500 border-dashed rounded-sm"></span>
                <span>Poligon Prakiraan +6 Jam (Forecast)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600 border border-white"></span>
                <span>Gunung dengan Peringatan Abu Aktif</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                <span>Level III (Siaga) / IV (Awas)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Level I (Normal) / II (Waspada)</span>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLegend(true)}
            className="bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl shadow-lg text-xs flex items-center gap-1.5 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            Tampilkan Legenda
          </button>
        )}
      </div>

      {/* Info FIR Watermark (Bawah Kanan) */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
        <div className="bg-slate-950/80 backdrop-blur border border-slate-800/80 px-2.5 py-1 rounded-lg text-[10px] text-slate-400">
          VAAC Darwin Area of Responsibility · MWO Jakarta & Makassar
        </div>
      </div>
    </div>
  );
};

