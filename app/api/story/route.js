// app/api/story/route.js
import { NextResponse } from 'next/server';
import { STORY_DIALOGUES } from '@/game_core.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const levelParam = searchParams.get('level');
  
  if (levelParam) {
    const lvl = parseInt(levelParam, 10);
    const story = STORY_DIALOGUES[lvl];
    if (story) {
      return NextResponse.json({ success: true, level: lvl, story });
    }
    return NextResponse.json({ success: false, error: 'Level dialogue not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    totalLevels: Object.keys(STORY_DIALOGUES).length,
    stories: STORY_DIALOGUES
  });
}
