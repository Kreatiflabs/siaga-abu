import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Siaga Abu — Pemantauan Abu Vulkanik Indonesia · Live VAAC Darwin',
  description:
    'Siaga Abu (siaga-abu.kreatiflabs.com): Sistem pemantauan sebaran abu vulkanik interaktif di ruang udara Indonesia berbasis data live VAAC Darwin & buletin ICAO SIGMET oleh KreatifLabs.',
  keywords: [
    'Siaga Abu',
    'siaga-abu.kreatiflabs.com',
    'KreatifLabs',
    'VAAC Darwin',
    'Abu Vulkanik Indonesia',
    'Volcanic Ash Advisory',
    'SIGMET',
    'Gunung Api Indonesia',
    'Penerbangan Indonesia',
    'Semeru',
    'Krakatau',
  ],
  authors: [{ name: 'KreatifLabs', url: 'https://www.kreatiflabs.com' }],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
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
        <SpeedInsights />
      </body>
    </html>
  );
}

