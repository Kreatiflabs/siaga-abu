'use client';

import React, { useState } from 'react';
import { AdvisoryPolygon } from '@/types/vaac';
import { X, Copy, Check, Download, Flame, Plane, Wind, Clock, MapPin, Shield } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

interface AdvisoryDetailModalProps {
  advisory: AdvisoryPolygon | null;
  onClose: () => void;
}

export const AdvisoryDetailModal: React.FC<AdvisoryDetailModalProps> = ({
  advisory,
  onClose,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  if (!advisory) return null;

  const isObserved = advisory.type === 'OBSERVED';
  const timeFrom = formatDateTime(advisory.validTimeFrom);
  const timeTo = formatDateTime(advisory.validTimeTo);

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(advisory.rawSigmet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadGeoJson = () => {
    const geoJsonFeature = {
      type: 'Feature',
      properties: {
        volcanoName: advisory.volcanoName,
        type: advisory.type,
        firId: advisory.firId,
        firName: advisory.firName,
        baseFL: advisory.baseFL,
        topFL: advisory.topFL,
        direction: advisory.direction,
        speedKnots: advisory.speedKnots,
        validTimeFrom: advisory.validTimeFrom,
        validTimeTo: advisory.validTimeTo,
        rawSigmet: advisory.rawSigmet,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [advisory.coordinates.map(([lat, lon]) => [lon, lat])],
      },
    };

    const blob = new Blob([JSON.stringify(geoJsonFeature, null, 2)], {
      type: 'application/geo+json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaac-darwin-${advisory.volcanoName.toLowerCase().replace(/\s+/g, '-')}-${advisory.type.toLowerCase()}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col">
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                isObserved ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}
            >
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{advisory.volcanoName}</h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                    isObserved
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  }`}
                >
                  {isObserved ? 'OBSERVED CLOUD' : 'FORECAST (+6HR)'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Wilayah Pengawasan: {advisory.firName} ({advisory.firId})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Konten Modal */}
        <div className="p-5 space-y-5 flex-1">
          {/* Grid Parameter Penerbangan */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Plane className="w-3.5 h-3.5 text-red-400" />
                <span>Batas Atas (Top)</span>
              </div>
              <div className="text-base font-bold text-red-300">{advisory.topFL}</div>
              <div className="text-[10px] text-slate-500">
                ~{Math.round(advisory.top * 0.3048).toLocaleString('id-ID')} m dpl
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Batas Bawah</span>
              </div>
              <div className="text-base font-bold text-slate-200">{advisory.baseFL}</div>
              <div className="text-[10px] text-slate-500">Permukaan Tanah (SFC)</div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pergerakan Angin</span>
              </div>
              <div className="text-base font-bold text-cyan-300">
                {advisory.direction || 'STNR'}
              </div>
              <div className="text-[10px] text-slate-500">
                {advisory.speedKnots ? `${advisory.speedKnots} Knots` : 'Kecepatan rendah'}
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tren Intensitas</span>
              </div>
              <div className="text-base font-bold text-emerald-300">
                {advisory.change === 'NC' ? 'Stabil (NC)' : advisory.change || 'Observasi'}
              </div>
              <div className="text-[10px] text-slate-500">No Change</div>
            </div>
          </div>

          {/* Masa Berlaku Buletin */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Masa Berlaku Peringatan (Validity Time)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Mulai Berlaku:</span>
                <span className="font-semibold text-white">{timeFrom.wib}</span>
                <span className="text-slate-500 text-[10px] block">{timeFrom.utc}</span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Hingga:</span>
                <span className="font-semibold text-amber-300">{timeTo.wib}</span>
                <span className="text-slate-500 text-[10px] block">{timeTo.utc}</span>
              </div>
            </div>
          </div>

          {/* Teks Buletin Asli ICAO */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Buletin Resmi ICAO SIGMET / VAAC Text:
              </span>
              <button
                onClick={handleCopyRaw}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Buletin</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-slate-950 border border-slate-800 text-amber-200 p-3.5 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {advisory.rawSigmet}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <button
            onClick={handleDownloadGeoJson}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Poligon (GeoJSON)</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

