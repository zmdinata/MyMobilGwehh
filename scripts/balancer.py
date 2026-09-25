#!/usr/bin/env python3
"""
scripts/balancer.py - Physics and Level Balancing Suite for MBG: Road To School
Simulates vehicle climb capability, fuel margins, and checkpoint distribution across all 20 campaign levels (3,000m - 25,000m).
"""

import math
import sys
import json

METER_SCALE = 20  # 20 px = 1 meter
MASS = 1400       # kg
GRAVITY = 9.8     # m/s^2

# 20 Level Definitions matching game_core.js
LEVELS = [
    {"level": 1, "name": "Tugas Pagi Pertama", "dist": 3000, "time": 260, "cps": [1500]},
    {"level": 2, "name": "Angin Pesisir & Senyum Pertama", "dist": 3800, "time": 310, "cps": [1900]},
    {"level": 3, "name": "Cieee Mas Tion!", "dist": 4600, "time": 360, "cps": [2300]},
    {"level": 4, "name": "Setelan Bengkel Zacky", "dist": 5500, "time": 420, "cps": [2700]},
    {"level": 5, "name": "Hujan Gerimis Pantura", "dist": 6500, "time": 480, "cps": [2200, 4400]},
    {"level": 6, "name": "Kubangan Lumpur Terasering", "dist": 7500, "time": 540, "cps": [2500, 5000]},
    {"level": 7, "name": "Botol Air Minum Bu Yulie", "dist": 8600, "time": 600, "cps": [2800, 5700]},
    {"level": 8, "name": "Misi Mak Comblang Husna", "dist": 9800, "time": 670, "cps": [3200, 6500]},
    {"level": 9, "name": "Uji Shockbreaker Anyar", "dist": 11000, "time": 740, "cps": [3600, 7300]},
    {"level": 10, "name": "Petuah Sang Legenda Mang Ucup", "dist": 12500, "time": 820, "cps": [4000, 8300]},
    {"level": 11, "name": "Tanjakan Kabut Perbukitan", "dist": 13800, "time": 890, "cps": [4500, 9200]},
    {"level": 12, "name": "Melayang Demi Bu Guru", "dist": 15000, "time": 960, "cps": [5000, 10000]},
    {"level": 13, "name": "Surat Rantang Rahasia", "dist": 16500, "time": 1040, "cps": [4200, 8500, 12600]},
    {"level": 14, "name": "Pipi Merah di Ruang Guru", "dist": 17800, "time": 1110, "cps": [4500, 9000, 13500]},
    {"level": 15, "name": "Batu Curam & Mesin Stage 15", "dist": 19000, "time": 1180, "cps": [4800, 9600, 14400]},
    {"level": 16, "name": "Payung Teduh di Depan Gerbang", "dist": 20200, "time": 1250, "cps": [5000, 10100, 15200]},
    {"level": 17, "name": "Dukungan Penuh Zacky & Husna", "dist": 21500, "time": 1320, "cps": [5300, 10700, 16100]},
    {"level": 18, "name": "Tanjakan Penentu Nyali", "dist": 22800, "time": 1390, "cps": [5600, 11300, 17100]},
    {"level": 19, "name": "Persiapan Pesta Gizi Akbar", "dist": 24000, "time": 1460, "cps": [5800, 11800, 17900]},
    {"level": 20, "name": "Rute Pamungkas: Demi Bu Guru Tercinta", "dist": 25000, "time": 1520, "cps": [5000, 10000, 15000, 20000]},
]

def get_engine_power(level):
    return 2200 + (level - 1) * 80

def get_tire_grip(level):
    return 1.0 + (level - 1) * 0.03

def get_slope_scale(level):
    return 1.0 + (level - 1) * 0.028

def simulate_level(lvl_data):
    lvl = lvl_data["level"]
    dist = lvl_data["dist"]
    cps = lvl_data["cps"]
    slope_scale = get_slope_scale(lvl)

    # Base steepness in radians at peak mountain climb
    max_slope_rad = math.atan(0.10 * slope_scale * 2.8)
    max_slope_deg = math.degrees(max_slope_rad)

    # Required engine level to overcome peak grade with grip
    # Gravity component + rolling resistance
    f_gravity = MASS * GRAVITY * math.sin(max_slope_rad)
    f_rolling = MASS * GRAVITY * math.cos(max_slope_rad) * 0.04
    f_total_required = f_gravity + f_rolling

    # Find minimum upgrade level where power > f_total_required * scaling
    req_engine_lvl = 1
    for el in range(1, 21):
        p = get_engine_power(el) * 4.8  # Newton thrust equivalent
        if p >= f_total_required:
            req_engine_lvl = el
            break

    # Fuel canister spacing ~380m
    fuel_can_count = max(1, int((dist - 320) / 380))
    checkpoint_count = len(cps)

    # Average driving time at 65 km/h (18 m/s)
    avg_speed = 18.0  # m/s
    drive_time_sec = dist / avg_speed
    time_margin = lvl_data["time"] - drive_time_sec

    is_feasible = (
        req_engine_lvl <= lvl
        and time_margin > 40
        and fuel_can_count >= int(dist / 450)
    )

    return {
        "level": lvl,
        "name": lvl_data["name"],
        "dist_km": dist / 1000.0,
        "max_slope_deg": round(max_slope_deg, 1),
        "req_engine_lvl": req_engine_lvl,
        "checkpoints": checkpoint_count,
        "fuel_cans": fuel_can_count,
        "time_limit_sec": lvl_data["time"],
        "est_time_sec": round(drive_time_sec),
        "status": "PASS" if is_feasible else "FAIL"
    }

def main():
    print("=" * 86)
    print("  MBG: ROAD TO SCHOOL - 20 LEVEL CAMPAIGN BALANCING SIMULATION")
    print("=" * 86)
    print(f"{'LV':<3} | {'NAMA TRAYEK':<32} | {'JARAK':<7} | {'KEMIRINGAN':<10} | {'ENG REQ':<7} | {'CP':<3} | {'BENSIN':<6} | {'STATUS'}")
    print("-" * 86)

    all_passed = True
    results = []
    for ldata in LEVELS:
        res = simulate_level(ldata)
        results.append(res)
        if res["status"] != "PASS":
            all_passed = False
        print(f"{res['level']:<3} | {res['name']:<32} | {res['dist_km']:>4.1f} km | {res['max_slope_deg']:>4.1f} deg   | LV {res['req_engine_lvl']:<4} | {res['checkpoints']:<3} | {res['fuel_cans']:<6} | {res['status']}")

    print("=" * 86)
    if all_passed:
        print("[SUCCESS] All 20 campaign levels are 100% mathematically balanced and climbable!")
    else:
        print("[WARNING] Some levels need parameter adjustments!")

    if "--export-json" in sys.argv:
        with open("public/campaign_balance.json", "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2)
        print("[EXPORT] Exported balancing report to public/campaign_balance.json")

if __name__ == "__main__":
    main()
