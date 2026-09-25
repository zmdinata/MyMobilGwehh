// app/api/upgrades/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const getUpgradeCost = (currentLvl) => Math.round(50 * Math.pow(1.35, currentLvl - 1));
  
  const upgradeTypes = {
    engine: {
      name: 'Mesin Turbo Pantura',
      description: 'Meningkatkan tenaga dorong tanjakan terjal dan akselerasi gas.',
      baseStat: 2200,
      scalePerLevel: 80,
      unit: 'HP'
    },
    grip: {
      name: 'Ban Pacul Kompon Lunak',
      description: 'Meningkatkan cengkeraman di jalan licin pesisir dan kubangan lumpur sawah.',
      baseStat: 1.0,
      scalePerLevel: 0.03,
      unit: 'Grip'
    },
    suspension: {
      name: 'Shockbreaker Dobel Per',
      description: 'Meredam guncangan ekstrem tanjakan berbatu dan melindungi sayur lodeh.',
      baseSpring: 180,
      scaleSpring: 4,
      baseDamper: 18.8,
      scaleDamper: 0.4,
      unit: 'Stiffness'
    }
  };

  const skins = [
    { id: 'standard', name: 'Standard Tosca MMG', unlockLevel: 1, cost: 0, color: '#0d9488' },
    { id: 'speedy', name: 'Speedy Pantura Blue', unlockLevel: 3, cost: 100, color: '#0284c7' },
    { id: 'mountain', name: 'Mountain Hunter Red', unlockLevel: 7, cost: 250, color: '#dc2626' },
    { id: 'retro', name: 'Retro Cirebon Brown', unlockLevel: 12, cost: 450, color: '#78350f' },
    { id: 'sport', name: 'Sport Gizi Lime', unlockLevel: 16, cost: 700, color: '#16a34a' }
  ];

  const rims = [
    { id: 'stock', name: 'Velg Kaleng Bawaan', unlockLevel: 1, cost: 0 },
    { id: 'gold', name: 'Bintang Emas 5-Spoke', unlockLevel: 4, cost: 120 },
    { id: 'beadlock', name: 'Offroad Beadlock Heavy Duty', unlockLevel: 9, cost: 300 },
    { id: 'whitewall', name: 'Klasik Whitewall Pantura', unlockLevel: 14, cost: 500 }
  ];

  return NextResponse.json({
    success: true,
    maxLevel: 20,
    upgradeTypes,
    skins,
    rims,
    costFormula: 'Math.round(50 * Math.pow(1.35, level - 1))'
  });
}
