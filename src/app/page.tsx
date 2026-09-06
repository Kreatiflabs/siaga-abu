'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Volcano, AdvisoryPolygon, VaacApiResponse } from '@/types/vaac';
import { VOLCANOES_INDONESIA } from '@/data/volcanoesIndonesia';
import { HeaderNavbar } from '@/components/HeaderNavbar';
import { StatisticsCards } from '@/components/StatisticsCards';
import { MapWrapper } from '@/components/MapWrapper';
import { VolcanoSidebar } from '@/components/VolcanoSidebar';
import { AdvisoryDetailModal } from '@/components/AdvisoryDetailModal';
import { ScenarioSimulator } from '@/components/ScenarioSimulator';
import { generateSimulationAdvisory } from '@/lib/utils';
import { VisitorCounter } from '@/components/VisitorCounter';
import { AlertTriangle, Info, Flame, ShieldAlert, Sparkles, MapPin, ExternalLink } from 'lucide-react';

export default function HomePage() {
  const [volcanoes, setVolcanoes] = useState<Volcano[]>(VOLCANOES_INDONESIA);
  const [advisories, setAdvisories] = useState<AdvisoryPolygon[]>([]);
  const [liveAdvisories, setLiveAdvisories] = useState<AdvisoryPolygon[]>([]);
  const [selectedVolcano, setSelectedVolcano] = useState<Volcano | null>(null);
  const [selectedAdvisory, setSelectedAdvisory] = useState<AdvisoryPolygon | null>(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ambil data live dari serverless API route /api/vaac
  const fetchLiveVaacData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/vaac');
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data: VaacApiResponse = await res.json();
      const advs = data.advisories || [];

      setAdvisories(advs);
      setLiveAdvisories(advs);
      setIsSimulating(false);
      setLastUpdated(data.timestamp || new Date().toISOString());

      // Update status hasActiveAsh di daftar gunung
      const activeIds = new Set(data.activeVolcanoes || []);
      setVolcanoes((prev) =>
        prev.map((v) => ({
          ...v,
          hasActiveAsh: activeIds.has(v.id),
        }))
      );
    } catch (err: any) {
      console.error('Gagal mengambil data VAAC:', err);
      setErrorMessage(
        'Gagal memuat feed real-time NOAA AWC. Menggunakan data observasi tersimpan.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Ambil data saat pertama kali dimuat & auto-refresh tiap 2 menit
  useEffect(() => {
    fetchLiveVaacData();
    const interval = setInterval(() => {
      fetchLiveVaacData();
    }, 120000); // 2 menit

    return () => clearInterval(interval);
  }, [fetchLiveVaacData]);

  // Handler saat user memilih gunung dari sidebar / card / quick pill
  const handleSelectVolcano = (volcano: Volcano) => {
    setSelectedVolcano(volcano);

    // Cek apakah gunung ini memiliki advisory poligon aktif
    const match = advisories.find((a) => a.matchedVolcanoId === volcano.id);
    if (match) {
      // Jika ada, siapkan advisory terkait
      setSelectedAdvisory(match);
    }
  };

  const handleSelectVolcanoByName = (name: string) => {
    const found = volcanoes.find(
      (v) =>
        v.name.toLowerCase().includes(name.toLowerCase()) ||
        v.aliases.some((a) => a.toLowerCase().includes(name.toLowerCase()))
    );
    if (found) {
      handleSelectVolcano(found);
    }
  };

  // Jalankan simulasi skenario sebaran abu
  const handleRunSimulation = (
    volcano: Volcano,
    windDirection: 'W' | 'E' | 'NW' | 'SE',
    topFL: number
  ) => {
    const simAdvisories = generateSimulationAdvisory(volcano, windDirection, topFL);
    setAdvisories(simAdvisories);
    setIsSimulating(true);
    setSelectedVolcano(volcano);

    // Tandai gunung yang disimulasikan sebagai aktif
    setVolcanoes((prev) =>
      prev.map((v) => ({
        ...v,
        hasActiveAsh: v.id === volcano.id,
      }))
    );
  };

  // Reset simulasi ke data live sesungguhnya
  const handleResetSimulation = () => {
    setAdvisories(liveAdvisories);
    setIsSimulating(false);
    const activeIds = new Set(
      liveAdvisories.map((a) => a.matchedVolcanoId).filter(Boolean)
    );
    setVolcanoes((prev) =>
      prev.map((v) => ({
        ...v,
        hasActiveAsh: activeIds.has(v.id),
      }))
    );
  };

  // Ekstrak nama-nama unik gunung yang sedang memiliki abu aktif
  const activeVolcanoNames = Array.from(
    new Set(advisories.map((a) => a.volcanoName))
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Navbar Atas */}
      <HeaderNavbar
        lastUpdated={lastUpdated}
        isLoading={isLoading}
        onRefresh={fetchLiveVaacData}
        activeAshCount={advisories.filter((a) => a.type === 'OBSERVED').length}
        onOpenSimulation={() => setIsSimulatorOpen(true)}
        isSimulating={isSimulating}
        onResetSimulation={handleResetSimulation}
      />

      {/* Konten Utama */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Banner Mode Simulasi Aktif */}
        {isSimulating && (
          <div className="bg-amber-950/80 border border-amber-600/80 rounded-xl p-3 flex items-center justify-between shadow-lg text-amber-200 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <strong>Mode Simulasi Skenario Aktif:</strong> Menampilkan perkiraan poligon sebaran abu untuk{' '}
                <span className="underline font-bold">{selectedVolcano?.name}</span>.
              </span>
            </div>
            <button
              onClick={handleResetSimulation}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition ml-2"
            >
              Kembali ke Live Feed
            </button>
          </div>
        )}

        {/* Notifikasi Peringatan Jika Error */}
        {errorMessage && (
          <div className="bg-red-950/70 border border-red-800/80 rounded-xl p-3 flex items-center gap-2.5 text-xs text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Ringkasan Statistik */}
        <StatisticsCards
          advisories={advisories}
          activeVolcanoNames={activeVolcanoNames}
          onSelectVolcanoByName={handleSelectVolcanoByName}
        />

        {/* Quick Volcano Selector Bar (Tombol Cepat Pilih Gunung Berbahaya) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-slate-400 font-semibold flex items-center gap-1 whitespace-nowrap pl-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            Pintasan Gunung:
          </span>
          {volcanoes.slice(0, 10).map((v) => {
            const hasAsh = advisories.some((a) => a.matchedVolcanoId === v.id);
            const isSelected = selectedVolcano?.id === v.id;
            return (
              <button
                key={v.id}
                onClick={() => handleSelectVolcano(v)}
                className={`px-3 py-1 rounded-lg whitespace-nowrap font-medium transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : hasAsh
                    ? 'bg-red-950/80 border border-red-700/80 text-red-300 hover:bg-red-900/80'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {hasAsh && <Flame className="w-3 h-3 text-red-400 animate-pulse" />}
                <span>{v.name.replace('Gunung ', '')}</span>
              </button>
            );
          })}
        </div>

        {/* Grid Peta GIS dan Sidebar Daftar Gunung */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Peta Interaktif Leaflet (Lebar 8 Kolom di Layar Besar) */}
          <div className="lg:col-span-8 flex flex-col space-y-3">
            <MapWrapper
              volcanoes={volcanoes}
              advisories={advisories}
              selectedVolcano={selectedVolcano}
              onSelectVolcano={handleSelectVolcano}
              onSelectAdvisory={(adv) => setSelectedAdvisory(adv)}
            />

            {/* Kartu Informasi Gunung yang Sedang Dipilih */}
            {selectedVolcano && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{selectedVolcano.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {selectedVolcano.region} · {selectedVolcano.province}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Koordinat: {selectedVolcano.lat.toFixed(3)}°, {selectedVolcano.lon.toFixed(3)}° ·
                    Ketinggian: {selectedVolcano.elevation.toLocaleString('id-ID')} mdpl · Tipe:{' '}
                    {selectedVolcano.type}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      setIsSimulatorOpen(true);
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition"
                  >
                    Simulasikan Sebaran
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Daftar Gunung Api (Lebar 4 Kolom di Layar Besar) */}
          <div className="lg:col-span-4">
            <VolcanoSidebar
              volcanoes={volcanoes}
              advisories={advisories}
              selectedVolcano={selectedVolcano}
              onSelectVolcano={handleSelectVolcano}
              onViewAdvisory={(adv) => setSelectedAdvisory(adv)}
            />
          </div>
        </div>

        {/* Aviation Safety & ICAO Information Banner */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Pedoman Keselamatan Penerbangan & ICAO Volcanic Ash Advisory (VAA)</span>
          </div>
          <p className="leading-relaxed">
            Data pemantauan abu vulkanik pada aplikasi ini mengintegrasikan buletin resmi{' '}
            <strong>ICAO SIGMET</strong> dan <strong>VAAC Darwin (Bureau of Meteorology Australia)</strong>{' '}
            yang berkoordinasi dengan Badan Meteorologi, Klimatologi, dan Geofisika (BMKG MWO Jakarta & Makassar)
            serta Pusat Vulkanologi dan Mitigasi Bencana Geologi (PVMBG). Partikel abu vulkanik mengandung silika
            tajam yang dapat menyebabkan erosi pada bilah turbin dan berpotensi mematikan mesin jet (*engine flameout*).
            Maskapai penerbangan wajib menghindari poligon abu teramati (OBS) dan memperhitungkan jalur prognosa (FCST).
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 pb-20 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1.5">
          <p>
            Sistem Pemantauan Abu Vulkanik Wilayah Indonesia &bull; Integrasi Live VAAC Darwin &amp; ICAO AWC SIGMET
          </p>
          <p className="text-[11px] text-slate-400">
            Edukasi &amp; Mitigasi Bencana Vulkanik &bull; Dibuat oleh{' '}
            <a
              href="https://www.kreatiflabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-semibold underline decoration-amber-500/40 transition"
            >
              www.kreatiflabs.com
            </a>
          </p>
          <p className="text-[10px] text-slate-600 pt-1">
            Siap di-deploy ke Vercel Serverless Platform
          </p>
        </div>
      </footer>

      {/* Floating Info: Pojok Kiri Bawah (Pengunjung Real-Time) & Pojok Kanan Bawah (Kreatif Labs) */}
      <div className="fixed bottom-3 inset-x-3 z-30 flex flex-col sm:flex-row items-center justify-between gap-2.5 pointer-events-none">
        {/* Pojok Kiri Bawah: Real-Time Live Visitor Counter */}
        <VisitorCounter />

        {/* Pojok Kanan Bawah: Edukasi / Mitigasi Bencana - Dibuat oleh www.kreatiflabs.com */}
        <div className="pointer-events-auto flex items-center">
          <a
            href="https://www.kreatiflabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 bg-slate-900/95 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 hover:border-amber-500/80 text-slate-300 hover:text-white text-xs px-3.5 py-1.5 rounded-full shadow-2xl transition duration-200"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-slate-400 text-[11px] group-hover:text-slate-300">
              Edukasi &amp; Mitigasi Bencana &bull; Dibuat oleh
            </span>
            <span className="font-bold text-amber-400 group-hover:text-amber-300 underline decoration-amber-500/50 flex items-center gap-1">
              www.kreatiflabs.com
              <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition" />
            </span>
          </a>
        </div>
      </div>

      {/* Modal Rincian Buletin / Poligon */}
      <AdvisoryDetailModal
        advisory={selectedAdvisory}
        onClose={() => setSelectedAdvisory(null)}
      />

      {/* Modal Simulasi Skenario */}
      <ScenarioSimulator
        volcanoes={volcanoes}
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onRunSimulation={handleRunSimulation}
      />
    </div>
  );
}

