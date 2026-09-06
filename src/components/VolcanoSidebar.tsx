'use client';

import React, { useState, useMemo } from 'react';
import { Volcano, AdvisoryPolygon } from '@/types/vaac';
import { INDONESIA_REGIONS } from '@/data/volcanoesIndonesia';
import { Search, Flame, Mountain, ChevronRight, AlertCircle, Filter } from 'lucide-react';
import { getAlertBadgeInfo } from '@/lib/utils';

interface VolcanoSidebarProps {
  volcanoes: Volcano[];
  advisories: AdvisoryPolygon[];
  selectedVolcano: Volcano | null;
  onSelectVolcano: (volcano: Volcano) => void;
  onViewAdvisory: (advisory: AdvisoryPolygon) => void;
}

export const VolcanoSidebar: React.FC<VolcanoSidebarProps> = ({
  volcanoes,
  advisories,
  selectedVolcano,
  onSelectVolcano,
  onViewAdvisory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('Semua Wilayah');
  const [onlyActiveAsh, setOnlyActiveAsh] = useState(false);

  // Peta ID gunung ke daftar advisory terkait
  const volcanoAdvisoryMap = useMemo(() => {
    const map: Record<string, AdvisoryPolygon[]> = {};
    for (const adv of advisories) {
      if (adv.matchedVolcanoId) {
        if (!map[adv.matchedVolcanoId]) map[adv.matchedVolcanoId] = [];
        map[adv.matchedVolcanoId].push(adv);
      }
    }
    return map;
  }, [advisories]);

  // Filter daftar gunung
  const filteredVolcanoes = useMemo(() => {
    return volcanoes.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.region.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion =
        selectedRegion === 'Semua Wilayah' || v.region === selectedRegion;

      const hasAsh = Boolean(volcanoAdvisoryMap[v.id]?.length);
      const matchesActiveAsh = onlyActiveAsh ? hasAsh : true;

      return matchesSearch && matchesRegion && matchesActiveAsh;
    });
  }, [volcanoes, searchQuery, selectedRegion, onlyActiveAsh, volcanoAdvisoryMap]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[600px] lg:h-[720px] shadow-xl overflow-hidden">
      {/* Header Panel */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-sm text-white">Daftar Gunung Api</h2>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {filteredVolcanoes.length} / {volcanoes.length}
          </span>
        </div>

        {/* Input Pencarian */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari gunung (Semeru, Merapi, Krakatau...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Wilayah */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {INDONESIA_REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition font-medium ${
                selectedRegion === region
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Toggle Hanya Abu Aktif */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
            <input
              type="checkbox"
              checked={onlyActiveAsh}
              onChange={(e) => setOnlyActiveAsh(e.target.checked)}
              className="rounded border-slate-700 bg-slate-950 text-red-600 focus:ring-red-500 focus:ring-offset-slate-900 w-3.5 h-3.5"
            />
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-400" />
              Hanya dengan peringatan abu aktif
            </span>
          </label>
        </div>
      </div>

      {/* List Gunung Api */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-800/40">
        {filteredVolcanoes.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Tidak ada gunung yang sesuai kriteria pencarian.</p>
          </div>
        ) : (
          filteredVolcanoes.map((volcano) => {
            const isSelected = selectedVolcano?.id === volcano.id;
            const relatedAdvisories = volcanoAdvisoryMap[volcano.id] || [];
            const hasActiveAsh = relatedAdvisories.length > 0;
            const alertBadge = getAlertBadgeInfo(volcano.alertLevel);

            return (
              <div
                key={volcano.id}
                onClick={() => onSelectVolcano(volcano)}
                className={`pt-2 first:pt-0 group rounded-xl p-2.5 transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border border-amber-500/60 shadow-md'
                    : 'hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-white truncate group-hover:text-amber-300 transition">
                        {volcano.name}
                      </h3>
                      {hasActiveAsh && (
                        <span className="relative flex h-2 w-2 flex-shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {volcano.province} · {volcano.elevation.toLocaleString('id-ID')} mdpl
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border ${alertBadge.bgClass} ${alertBadge.textClass} ${alertBadge.borderClass}`}
                    >
                      {alertBadge.label.split(' ')[0]} {alertBadge.label.split(' ')[1]}
                    </span>
                  </div>
                </div>

                {/* Badge Khusus Jika Sedang Ada Abu Vulkanik Aktif */}
                {hasActiveAsh && (
                  <div className="mt-2 flex items-center justify-between bg-red-950/70 border border-red-800/80 rounded-lg px-2.5 py-1 text-[11px] text-red-300">
                    <div className="flex items-center gap-1 font-semibold">
                      <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                      <span>{relatedAdvisories[0].topFL}</span>
                      <span className="text-red-400 font-normal">
                        ({relatedAdvisories[0].direction ? `Arah ${relatedAdvisories[0].direction}` : 'Observasi'})
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewAdvisory(relatedAdvisories[0]);
                      }}
                      className="text-[10px] text-amber-300 hover:text-white underline font-semibold"
                    >
                      Rincian Buletin →
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Ringkasan */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Wilayah VAAC Darwin</span>
        <span className="text-amber-400 font-mono">127+ Gunung Aktif</span>
      </div>
    </div>
  );
};

