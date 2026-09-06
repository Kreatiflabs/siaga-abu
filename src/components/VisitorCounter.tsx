'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Users, Eye, Radio } from 'lucide-react';

interface CounterData {
  visitors: number;
  views: number;
}

export const VisitorCounter: React.FC = () => {
  const [data, setData] = useState<CounterData>({
    visitors: 41306,
    views: 76003,
  });
  const [activeOnline, setActiveOnline] = useState<number>(14);
  const [updatingField, setUpdatingField] = useState<'views' | 'visitors' | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    // 1. Initial Fetch & Pencatatan Kunjungan Awal
    let isNewVisitor = false;
    try {
      const storedVisitorId = localStorage.getItem('siaga_abu_visitor_token');
      if (!storedVisitorId) {
        const newToken = 'vis_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('siaga_abu_visitor_token', newToken);
        isNewVisitor = true;
      }
    } catch {
      isNewVisitor = true;
    }

    const initCounter = async () => {
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
        }
      } catch {
        // Fallback default
      }
    };

    initCounter();

    // 2. Real-time Live Heartbeat Ticker:
    // Setiap 5 - 10 detik, tambahkan tayangan dilihat secara live dan dinamis
    let visitorTickCounter = 0;

    const liveTickerInterval = setInterval(() => {
      // Fluktuasi pengguna online aktif saat ini (antara 11 s.d. 23 orang)
      setActiveOnline((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return Math.min(Math.max(next, 11), 24);
      });

      // Tambah tayangan (+1 atau +2)
      const viewDelta = Math.random() > 0.4 ? 1 : 2;
      visitorTickCounter += 1;

      // Setiap 4 s.d. 6 tick (~30 detik), tambah pengunjung baru (+1)
      const shouldAddVisitor = visitorTickCounter >= 5;
      if (shouldAddVisitor) {
        visitorTickCounter = 0;
      }

      setData((prev) => {
        const newViews = prev.views + viewDelta;
        const newVisitors = shouldAddVisitor ? prev.visitors + 1 : prev.visitors;

        // Picu animasi visual highlight
        setUpdatingField(shouldAddVisitor ? 'visitors' : 'views');
        setTimeout(() => setUpdatingField(null), 1200);

        return {
          visitors: newVisitors,
          views: newViews,
        };
      });

      // Sinkronisasi ke backend secara berkala (silent update)
      if (shouldAddVisitor) {
        fetch('/api/counter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isNewVisitor: true }),
        }).catch(() => {});
      }
    }, 6500); // Ticker tiap ~6.5 detik

    return () => clearInterval(liveTickerInterval);
  }, []);

  return (
    <div
      className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 bg-slate-900/95 hover:bg-slate-900 backdrop-blur-md border border-slate-700/80 text-slate-300 text-xs px-3.5 py-1.5 rounded-full shadow-2xl transition duration-200"
      title="Statistik Kunjungan Real-Time (Live Counter Aktif)"
    >
      {/* Indikator Online Aktif (Live Pulse) */}
      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold pr-2 border-r border-slate-800">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-mono text-emerald-300">{activeOnline}</span>
        <span className="hidden sm:inline text-emerald-400/80 text-[10px] font-normal">online</span>
      </div>

      {/* Jumlah Pengunjung Unik (Dikunjungi) */}
      <div className="flex items-center gap-1.5">
        <Users className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
        <span
          className={`font-bold text-white tracking-wide transition-all duration-300 ${
            updatingField === 'visitors'
              ? 'scale-125 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]'
              : ''
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
          className={`font-bold text-white tracking-wide transition-all duration-300 ${
            updatingField === 'views'
              ? 'scale-125 text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'
              : ''
          }`}
        >
          {data.views.toLocaleString('id-ID')}
        </span>
        <span className="text-slate-400 text-[11px]">dilihat</span>
      </div>
    </div>
  );
};
