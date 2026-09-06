'use client';

import React, { useState } from 'react';
import { Volcano } from '@/types/vaac';
import { Play, X, Wind, Plane, Flame } from 'lucide-react';

interface ScenarioSimulatorProps {
  volcanoes: Volcano[];
  isOpen: boolean;
  onClose: () => void;
  onRunSimulation: (
    volcano: Volcano,
    windDirection: 'W' | 'E' | 'NW' | 'SE',
    topFL: number
  ) => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  volcanoes,
  isOpen,
  onClose,
  onRunSimulation,
}) => {
  const [selectedVolcanoId, setSelectedVolcanoId] = useState<string>(
    volcanoes[0]?.id || 'merapi'
  );
  const [windDirection, setWindDirection] = useState<'W' | 'E' | 'NW' | 'SE'>('W');
  const [flightLevel, setFlightLevel] = useState<number>(250);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const volcano = volcanoes.find((v) => v.id === selectedVolcanoId);
    if (volcano) {
      onRunSimulation(volcano, windDirection, flightLevel);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full shadow-2xl p-5 text-slate-100">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Simulasi Sebaran Erupsi</h3>
              <p className="text-[11px] text-slate-400">Model Skenario Poligon VAAC Darwin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Pilih Gunung */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Pilih Gunung Api:
            </label>
            <select
              value={selectedVolcanoId}
              onChange={(e) => setSelectedVolcanoId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500"
            >
              {volcanoes.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.province} - {v.region})
                </option>
              ))}
            </select>
          </div>

          {/* Pilih Ketinggian Abu (Flight Level) */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-red-400" />
              Ketinggian Kolom Abu (Top FL):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { fl: 100, label: 'FL100 (~3.000m)', desc: 'Rendah' },
                { fl: 250, label: 'FL250 (~7.500m)', desc: 'Menengah' },
                { fl: 500, label: 'FL500 (~15.000m)', desc: 'Tinggi/Besar' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.fl}
                  onClick={() => setFlightLevel(item.fl)}
                  className={`p-2 rounded-xl border text-center transition ${
                    flightLevel === item.fl
                      ? 'bg-red-500/20 border-red-500 text-red-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold text-xs">{item.label.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-400">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pilih Arah Pergerakan Angin */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              Arah Hembusan Angin Dominan:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { dir: 'W' as const, label: 'Barat (W)' },
                { dir: 'NW' as const, label: 'B. Laut (NW)' },
                { dir: 'E' as const, label: 'Timur (E)' },
                { dir: 'SE' as const, label: 'Tenggara (SE)' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.dir}
                  onClick={() => setWindDirection(item.dir)}
                  className={`p-2 rounded-xl border text-center transition ${
                    windDirection === item.dir
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tombol Eksekusi */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-lg shadow-amber-950/40"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Tampilkan Simulasi di Peta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

