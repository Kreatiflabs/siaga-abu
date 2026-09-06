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
      const h = now.getUTCHours().toString().padStart(2, '0');
      const m = now.getUTCMinutes().toString().padStart(2, '0');
      const s = now.getUTCSeconds().toString().padStart(2, '0');
      setCurrentUtcTime(`${h}:${m}:${s} UTC`);
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
            <div className="flex items-center gap-3">
              {/* Logo SVG Modern Gunung Api & Awan Abu Vulkanik */}
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-1 border border-orange-500/50 shadow-xl shadow-orange-950/40 flex items-center justify-center flex-shrink-0 group hover:border-orange-400 transition">
                <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Ash Cloud Plume */}
                  <path d="M32 8C27 8 24 11 24 14C20 14 18 17 19 20C15 21 15 26 18 28C21 30 27 31 32 31C37 31 43 30 46 28C49 26 49 21 45 20C46 17 44 14 40 14C40 11 37 8 32 8Z" fill="url(#navAshGrad)" />
                  <circle cx="32" cy="13" r="5" fill="#fef08a" opacity="0.6" className="animate-pulse" />
                  
                  {/* Ejecta Sparks */}
                  <circle cx="16" cy="13" r="1.5" fill="#f59e0b" />
                  <circle cx="48" cy="12" r="1.5" fill="#f97316" />
                  <circle cx="34" cy="6" r="1.2" fill="#fbbf24" />

                  {/* Mountain Slope */}
                  <path d="M26 32L10 56C9.5 56.8 10 58 11 58H53C54 58 54.5 56.8 54 56L38 32H26Z" fill="#334155" />
                  
                  {/* Crater Caldera Glow */}
                  <ellipse cx="32" cy="32" rx="6" ry="2" fill="#fbbf24" />

                  {/* Magma Fissure Lines */}
                  <path d="M32 32L31 39L33 45L30 53" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M28 34L25 41L23 49" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
                  <path d="M36 34L39 42L41 50" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />

                  <defs>
                    <linearGradient id="navAshGrad" x1="32" y1="8" x2="32" y2="31" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ff7849" />
                      <stop offset="60%" stopColor="#ea580c" />
                      <stop offset="100%" stopColor="#b91c1c" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                    <span className="bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent font-extrabold">
                      Siaga Abu
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-950 to-amber-950 text-amber-300 border border-amber-700/80 font-semibold flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      Live VAAC Darwin
                    </span>
                  </h1>
                </div>
                <p className="text-xs text-slate-400">
                  Pemantauan Sebaran Abu Vulkanik &amp; Buletin ICAO SIGMET Indonesia
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

