'use client';

import React from 'react';
import { AdvisoryPolygon } from '@/types/vaac';
import { AlertTriangle, Layers, Navigation, Plane } from 'lucide-react';

interface StatisticsCardsProps {
  advisories: AdvisoryPolygon[];
  activeVolcanoNames: string[];
  onSelectVolcanoByName: (name: string) => void;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  advisories,
  activeVolcanoNames,
  onSelectVolcanoByName,
}) => {
  const observedPolygons = advisories.filter((a) => a.type === 'OBSERVED');
  const forecastPolygons = advisories.filter((a) => a.type === 'FORECAST');

  // Cari flight level tertinggi
  let maxTopFL = 'FL150';
  let maxTopFeet = 0;
  advisories.forEach((a) => {
    if (a.top > maxTopFeet) {
      maxTopFeet = a.top;
      maxTopFL = a.topFL;
    }
  });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {/* Kartu 1: Poligon Sebaran Abu */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Poligon Abu Aktif</span>
          <div className="p-1.5 rounded-lg bg-red-950/60 border border-red-800/60 text-red-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{observedPolygons.length}</span>
          <span className="text-xs text-slate-400">Teramati</span>
          {forecastPolygons.length > 0 && (
            <span className="text-xs text-amber-400 font-medium">
              (+{forecastPolygons.length} Prediksi)
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Area sebaran awan abu vulkanik di peta</p>
      </div>

      {/* Kartu 2: Ketinggian Jelajah Terdampak (Top Flight Level) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Puncak Sebaran Abu</span>
          <div className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-400">
            <Plane className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-amber-300">{maxTopFL}</span>
          <span className="text-xs text-slate-400">
            {maxTopFeet > 0 ? `(~${(maxTopFeet * 0.3048).toLocaleString('id-ID', { maximumFractionDigits: 0 })} m)` : ''}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Batas aman ketinggian rute penerbangan</p>
      </div>

      {/* Kartu 3: Gunung Berperingatan Aktif */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Gunung Erupsi Terpantau</span>
          <div className="p-1.5 rounded-lg bg-orange-950/60 border border-orange-800/60 text-orange-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
          {activeVolcanoNames.length > 0 ? (
            activeVolcanoNames.map((name, i) => (
              <button
                key={i}
                onClick={() => onSelectVolcanoByName(name)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-red-900/40 hover:bg-red-800/60 border border-red-700/60 text-red-200 font-medium transition cursor-pointer"
                title={`Klik untuk zoom ke ${name}`}
              >
                {name.replace('Gunung ', '')}
              </button>
            ))
          ) : (
            <span className="text-sm font-semibold text-emerald-400">Tidak ada erupsi besar</span>
          )}
        </div>
      </div>

      {/* Kartu 4: Cakupan Ruang Udara */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Cakupan Ruang Udara</span>
          <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
            <Navigation className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
            WIIF Jakarta
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
            WAAF Makassar
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Yurisdiksi VAAC Darwin & MWO Indonesia</p>
      </div>
    </div>
  );
};

