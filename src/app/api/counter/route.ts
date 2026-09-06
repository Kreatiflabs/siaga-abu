import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Baseline awal counter
const BASELINE_VISITORS = 41305;
const BASELINE_VIEWS = 75999;

// In-memory counter untuk performa super cepat dan toleransi serverless Vercel
let inMemoryCounter = {
  visitors: BASELINE_VISITORS,
  views: BASELINE_VIEWS,
  lastUpdated: new Date().toISOString(),
};

// Coba muat baseline dari file jika tersedia
try {
  const filePath = path.join(process.cwd(), 'src/data/counter.json');
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (typeof parsed.visitors === 'number' && typeof parsed.views === 'number') {
      inMemoryCounter.visitors = Math.max(parsed.visitors, BASELINE_VISITORS);
      inMemoryCounter.views = Math.max(parsed.views, BASELINE_VIEWS);
    }
  }
} catch {
  // Abaikan jika di lingkungan serverless read-only
}

// Fungsi bantu untuk menyimpan ke file jika bisa
function saveToDisk() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/counter.json');
    fs.writeFileSync(filePath, JSON.stringify(inMemoryCounter, null, 2), 'utf-8');
  } catch {
    // Read-only filesystem di Vercel, tetap aman dalam in-memory
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    visitors: inMemoryCounter.visitors,
    views: inMemoryCounter.views,
    timestamp: inMemoryCounter.lastUpdated,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const isNewVisitor = Boolean(body.isNewVisitor);

    // Setiap request menambah pageview (+1)
    inMemoryCounter.views += 1;

    // Jika ini pengunjung unik baru, tambah pengunjung (+1)
    if (isNewVisitor) {
      inMemoryCounter.visitors += 1;
    }

    inMemoryCounter.lastUpdated = new Date().toISOString();
    saveToDisk();

    return NextResponse.json({
      success: true,
      visitors: inMemoryCounter.visitors,
      views: inMemoryCounter.views,
      timestamp: inMemoryCounter.lastUpdated,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err?.message || 'Gagal memperbarui counter',
        visitors: inMemoryCounter.visitors,
        views: inMemoryCounter.views,
      },
      { status: 500 }
    );
  }
}

