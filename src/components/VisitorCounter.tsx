'use client';

import React, { useEffect, useState } from 'react';
import { Users, Eye, Activity } from 'lucide-react';

interface CounterData {
  visitors: number;
  views: number;
}

export const VisitorCounter: React.FC = () => {
  const [data, setData] = useState<CounterData>({
    visitors: 41305,
    views: 75999,
  });
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // 1. Cek apakah ini pengunjung unik via localStorage
    let isNewVisitor = false;
    try {
      const storedVisitorId = localStorage.getItem('siaga_abu_visitor_token');
      if (!storedVisitorId) {
        const newToken = 'vis_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('siaga_abu_visitor_token', newToken);
        isNewVisitor = true;
      }
    } catch {
      // Jika localStorage tidak dapat diakses (misal private mode ketat)
      isNewVisitor = true;
    }

    // 2. Kirim POST untuk mencatat kunjungan & pageview ke backend
    const recordVisit = async () => {
      try {
        const res = await fetch('/api/counter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isNewVisitor }),
        });
        if (res.ok) {
          const result = await res.json();
          setData({
            visitors: result.visitors,
            views: result.views,
          });
          setHasRecorded(true);
        }
      } catch (e) {
        console.warn('Gagal mencatat statistik kunjungan:', e);
      }
    };

    recordVisit();

    // 3. Polling berkala tiap 25 detik untuk menyinkronkan data live jika ada pengunjung lain
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/counter');
        if (res.ok) {
          const result = await res.json();
          setData((prev) => {
            if (prev.views !== result.views || prev.visitors !== result.visitors) {
              setIsUpdating(true);
              setTimeout(() => setIsUpdating(false), 1000);
            }
            return {
              visitors: result.visitors,
              views: result.views,
            };
          });
        }
      } catch {
        // Abaikan jika network sementara offline
      }
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="pointer-events-auto flex items-center gap-2.5 bg-slate-900/95 hover:bg-slate-900 backdrop-blur-md border border-slate-700/80 text-slate-300 text-xs px-3.5 py-1.5 rounded-full shadow-2xl transition duration-200"
      title="Statistik Kunjungan Real-Time (Live Counter)"
    >
      {/* Indikator Titik Hijau Berkedip (Live Tracker) */}
      <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold pr-1 border-r border-slate-800">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="hidden xs:inline">LIVE</span>
      </div>

      {/* Jumlah Pengunjung Unik (Dikunjungi) */}
      <div className="flex items-center gap-1.5">
        <Users className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
        <span
          className={`font-bold text-white tracking-wide transition-transform duration-300 ${
            isUpdating ? 'scale-110 text-cyan-300' : ''
          }`}
        >
          {data.visitors.toLocaleString('id-ID')}
        </span>
        <span className="text-slate-400 text-[11px]">dikunjungi</span>
      </div>

      <span className="text-slate-600 font-light">|</span>

      {/* Jumlah Tayangan Halaman (Dilihat) */}
      <div className="flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span
          className={`font-bold text-white tracking-wide transition-transform duration-300 ${
            isUpdating ? 'scale-110 text-amber-300' : ''
          }`}
        >
          {data.views.toLocaleString('id-ID')}
        </span>
        <span className="text-slate-400 text-[11px]">dilihat</span>
      </div>
    </div>
  );
};

