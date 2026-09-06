'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Volcano, AdvisoryPolygon } from '@/types/vaac';

interface MapWrapperProps {
  volcanoes: Volcano[];
  advisories: AdvisoryPolygon[];
  selectedVolcano: Volcano | null;
  onSelectVolcano: (volcano: Volcano) => void;
  onSelectAdvisory: (advisory: AdvisoryPolygon) => void;
}

// Dynamic import untuk komponen peta Leaflet tanpa Server-Side Rendering
const DynamicVolcanoMap = dynamic(
  () => import('./VolcanoMap').then((mod) => mod.VolcanoMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] lg:h-[720px] rounded-2xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-300">Memuat Sistem GIS Peta Wilayah Indonesia...</p>
        <span className="text-xs text-slate-500">Menghubungkan ke Feed VAAC Darwin & NOAA</span>
      </div>
    ),
  }
);

export const MapWrapper: React.FC<MapWrapperProps> = (props) => {
  return <DynamicVolcanoMap {...props} />;
};

