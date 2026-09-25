// app/api/levels/route.js
import { NextResponse } from 'next/server';
import { LEVEL_CONFIGS, BIOMES } from '@/game_core.js';

export async function GET() {
  return NextResponse.json({
    success: true,
    totalLevels: LEVEL_CONFIGS.length,
    levels: LEVEL_CONFIGS,
    biomes: BIOMES
  });
}
