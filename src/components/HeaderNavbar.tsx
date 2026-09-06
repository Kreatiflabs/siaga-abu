'use client';

import React, { useEffect, useState } from 'react';
import { Flame, RefreshCw, Radio, Wind, PlayCircle, ShieldAlert } from 'lucide-react';

interface HeaderNavbarProps {
  lastUpdated: string | null;
  isLoading: boolean;
  onRefresh: () => void;
  activeAshCount: number;
  onOpenSimulation: () => void;
  isSimulating: boolean;
  onResetSimulation: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  lastUpdated,
  isLoading,
  onRefresh,
  activeAshCount,
  onOpenSimulation,
  isSimulating,
  onResetSimulation,
}) => {
  const [currentUtcTime, setCurrentUtcTime] = useState<string>('');
  const [currentWibTime, setCurrentWibTime] = useState<string>('');

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setCurrentUtcTime(
        now.toUTCString().replace('GMT', 'UTC').split(' ').slice(4, 6).join(' ') + ' UTC'
      );
      setCurrentWibTime(
        new Intl.DateTimeFormat('id-ID', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(now) + ' WIB'
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & Judul */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-900/30">
                <Flame className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                    Live VAAC Darwin
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800/80 font-medium">
                      Indonesia
                    </span>
                  </h1>
                </div>
                <p className="text-xs text-slate-400">
                  Pemantauan Sebaran Abu Vulkanik & Buletin ICAO SIGMET
                </p>
              </div>
            </div>

            {/* Mobile quick badge */}
            <div className="md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-700 text-red-400 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{activeAshCount} Aktif</span>
            </div>
          </div>

          {/* Jam Live & Status API */}
          <div className="flex items-center flex-wrap gap-2.5 text-xs text-slate-300 justify-center md:justify-end">
            <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <div className="flex items-center gap-1 text-slate-400">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span>Waktu:</span>
              </div>
              <span className="font-mono text-cyan-300 font-semibold">{currentWibTime || '--:-- WIB'}</span>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-slate-300">{currentUtcTime || '--:-- UTC'}</span>
            </div>

            {/* Status Live */}
            <div className="flex items-center gap-1.5 bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 px-2.5 py-1.5 rounded-lg font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Radio className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Feed ICAO/AWC:</span> Live
            </div>

            {/* Tombol Simulasi */}
            {isSimulating ? (
              <button
                onClick={onResetSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition shadow-sm"
                title="Kembali ke data live sesungguhnya"
              >
                <span>Reset Simulasi</span>
              </button>
            ) : (
              <button
                onClick={onOpenSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 hover:border-amber-400 transition"
              >
                <PlayCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulasi Skenario</span>
              </button>
            )}

            {/* Tombol Refresh */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition shadow-sm"
              title="Perbarui data dari NOAA AWC / VAAC Darwin"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLoading ? 'Memuat...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

