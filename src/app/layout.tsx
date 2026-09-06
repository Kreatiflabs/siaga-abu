import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pemantauan Abu Vulkanik Indonesia · Live VAAC Darwin & ICAO SIGMET',
  description:
    'Sistem pemantauan sebaran abu vulkanik interaktif di ruang udara Indonesia berbasis data live VAAC Darwin & buletin ICAO SIGMET, dilengkapi visualisasi poligon sebaran dan katalog gunung api aktif.',
  keywords: [
    'VAAC Darwin',
    'Abu Vulkanik',
    'Volcanic Ash Advisory',
    'SIGMET',
    'Gunung Api Indonesia',
    'ICAO',
    'Penerbangan',
    'Semeru',
    'Krakatau',
    'Merapi',
  ],
  authors: [{ name: 'Sistem Pemantauan Vulkanik Indonesia' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}

