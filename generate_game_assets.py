"""Generate deterministic, lightweight SVG assets for MBG: Road To School.

This local asset pipeline complements future Higgsfield illustrations. Text is
kept in SVG/UI so it remains crisp, editable, and easy to localize.
"""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "assets" / "refresh" / "v3"
SPRITES = OUT / "sprites"
BACKGROUNDS = OUT / "backgrounds"
UI = OUT / "ui"


def svg(width: int, height: int, body: str, *, title: str = "") -> str:
    title_tag = f"<title>{title}</title>" if title else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" '
        f'height="{height}" viewBox="0 0 {width} {height}" '
        'fill="none" shape-rendering="geometricPrecision">'
        f'{title_tag}{body}</svg>\n'
    )


def write(relpath: str, data: str) -> None:
    target = OUT / relpath
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(data, encoding="utf-8")


def make_truck() -> str:
    return svg(400, 208, '''
      <defs>
        <linearGradient id="box" x2="0" y2="1"><stop stop-color="#58b7f2"/><stop offset="1" stop-color="#1769c2"/></linearGradient>
        <linearGradient id="cab" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#dbe5ee"/></linearGradient>
      </defs>
      <!-- cargo body -->
      <path d="M20 36Q20 27 30 27H252V163H20Z" fill="url(#box)" stroke="#0d2b52" stroke-width="7"/>
      <path d="M26 139H248V158H26Z" fill="#0d2b52" opacity=".48"/>
      <path d="M37 31V159M244 31V159" stroke="#d8f0ff" stroke-width="7"/>
      <path d="M29 45H247M29 151H247" stroke="#eff9ff" stroke-width="5"/>
      <path d="M52 58H224" stroke="#a9ddff" stroke-width="3" opacity=".8"/>
      <!-- simple original nutrition mark, no external emblem -->
      <circle cx="137" cy="93" r="39" fill="#fff8db" stroke="#f4b942" stroke-width="5"/>
      <path d="M116 104Q138 71 158 103Q140 117 116 104Z" fill="#d88a22"/>
      <path d="M134 77L140 66L146 78M156 98L170 94L160 106" stroke="#bf5a32" stroke-width="5" stroke-linecap="round"/>
      <path d="M118 111Q137 99 156 111" stroke="#1769c2" stroke-width="5" stroke-linecap="round"/>
      <circle cx="128" cy="91" r="2.8" fill="#20343a"/>
      <path d="M103 129H170" stroke="#0d2b52" stroke-width="4" stroke-linecap="round"/>
      <!-- cab -->
      <path d="M254 35H305L359 94L372 158H253Z" fill="url(#cab)" stroke="#334155" stroke-width="7" stroke-linejoin="round"/>
      <path d="M267 46H301L339 91H267Z" fill="#17324b" stroke="#0f172a" stroke-width="4"/>
      <path d="M308 50L342 91H309Z" fill="#28526c" opacity=".8"/>
      <!-- driver silhouette -->
      <circle cx="295" cy="77" r="10" fill="#b96c42"/>
      <path d="M285 76Q287 62 300 66L305 73Z" fill="#f4c542"/>
      <path d="M290 81H301" stroke="#33251c" stroke-width="2"/>
      <path d="M354 108H369V130H354Z" fill="#ffe889" stroke="#bc8c27" stroke-width="3"/>
      <path d="M351 156H389V170H350Z" fill="#e74d4d" stroke="#a92e35" stroke-width="4"/>
      <path d="M21 163H370" stroke="#172435" stroke-width="13" stroke-linecap="round"/>
      <path d="M26 174H360" stroke="#536477" stroke-width="7"/>
      <!-- black wheel arches leave room for independently animated wheels -->
      <path d="M22 177A54 54 0 0 1 130 177M252 177A54 54 0 0 1 360 177" fill="#111d2c" stroke="#334155" stroke-width="5"/>
      <rect x="174" y="164" width="82" height="19" rx="7" fill="#475569" stroke="#1e293b" stroke-width="4"/>
      <path d="M181 169H248" stroke="#94a3b8" stroke-width="4"/>
      <rect x="174" y="12" width="44" height="15" rx="5" fill="#f6a924" stroke="#a76219" stroke-width="3"/>
    ''', title="Cartoon cobalt-blue MBG nutrition delivery truck, side view")


def make_wheel() -> str:
    tread = []
    for i in range(16):
        angle = i * 22.5
        tread.append(f'<rect x="67" y="5" width="18" height="13" rx="3" transform="rotate({angle} 76 76)" fill="#172333"/>')
    bolts = []
    for x, y in [(76, 47), (103.6, 67), (93, 99), (59, 99), (48.4, 67)]:
        bolts.append(f'<circle cx="{x}" cy="{y}" r="4.5" fill="#f1f5f9" stroke="#64748b" stroke-width="2"/>')
    return svg(152, 152, f'''
      <circle cx="76" cy="76" r="66" fill="#111827" stroke="#020617" stroke-width="7"/>
      {''.join(tread)}
      <circle cx="76" cy="76" r="45" fill="#1769c2" stroke="#0d2b52" stroke-width="6"/>
      <circle cx="76" cy="76" r="34" fill="#dce5ee" stroke="#9aaabc" stroke-width="4"/>
      <circle cx="76" cy="76" r="15" fill="#354459" stroke="#1d2a3c" stroke-width="4"/>
      {''.join(bolts)}
    ''', title="Off-road truck wheel with steel rim")


def make_fuel() -> str:
    return svg(72, 84, '''
      <path d="M23 16H51L58 27V69Q58 76 51 76H19Q13 76 13 69V28Q13 21 19 21H23Z" fill="#dc4045" stroke="#8f2430" stroke-width="5"/>
      <path d="M26 16V9H48V16M45 10H57V19H48" fill="#26364a" stroke="#152236" stroke-width="4"/>
      <path d="M21 34H50V53H21Z" fill="#be2b38" stroke="#9b2631" stroke-width="3"/>
      <path d="M25 38L46 49M46 38L25 49" stroke="#eb6262" stroke-width="2"/>
      <path d="M20 61H51" stroke="#ffd95f" stroke-width="4" stroke-linecap="round"/>
      <path d="M54 29Q66 34 62 52" stroke="#f4b942" stroke-width="4" stroke-linecap="round"/>
    ''', title="Red fuel can collectible")


def make_coin() -> str:
    return svg(64, 64, '''
      <circle cx="32" cy="32" r="27" fill="#edaa28" stroke="#9a5d13" stroke-width="5"/>
      <circle cx="32" cy="32" r="21" fill="#ffd85d" stroke="#fff0a3" stroke-width="3"/>
      <path d="M40 20Q35 16 28 19Q18 23 23 31Q26 35 35 36Q43 38 40 44Q36 50 25 46" stroke="#885019" stroke-width="5" stroke-linecap="round"/>
      <path d="M31 14V50" stroke="#885019" stroke-width="3" opacity=".7"/>
      <path d="M15 20L18 13L21 20L28 23L21 26L18 33L15 26L8 23Z" fill="#fff7c2"/>
    ''', title="Golden nutrition coin")


def make_log() -> str:
    rings = ''.join(f'<ellipse cx="48" cy="48" rx="{r}" ry="{r*.72:.1f}" fill="none" stroke="{c}" stroke-width="3"/>' for r, c in [(29, '#a66b31'), (21, '#bd8448'), (12, '#8e5223')])
    return svg(96, 96, f'''
      <ellipse cx="48" cy="48" rx="40" ry="32" fill="#80502e" stroke="#3f2c25" stroke-width="6"/>
      <ellipse cx="48" cy="48" rx="32" ry="25" fill="#c08a4e" stroke="#633e28" stroke-width="3"/>
      {rings}<ellipse cx="48" cy="48" rx="5" ry="4" fill="#754823"/>
      <path d="M14 27Q29 17 39 21M59 72Q71 76 80 65" stroke="#55a65c" stroke-width="8" stroke-linecap="round"/>
      <path d="M26 14L34 21M67 77L74 72" stroke="#263b2d" stroke-width="3"/>
    ''', title="Fallen log obstacle")


def make_gate() -> str:
    return svg(420, 300, '''
      <!-- fictional school grounds for SD, SMP and SMA in Cirebon -->
      <path d="M24 173V82L75 49L126 82V173Z" fill="#f8f1dd" stroke="#344b60" stroke-width="5"/>
      <path d="M19 83L75 44L131 83" stroke="#1769c2" stroke-width="9" stroke-linejoin="round"/>
      <path d="M147 173V58L208 22L269 58V173Z" fill="#fff5dd" stroke="#344b60" stroke-width="5"/>
      <path d="M140 60L208 17L276 60" stroke="#1769c2" stroke-width="10" stroke-linejoin="round"/>
      <path d="M287 173V83L339 49L391 83V173Z" fill="#f8f1dd" stroke="#344b60" stroke-width="5"/>
      <path d="M281 83L339 44L397 83" stroke="#d7a53c" stroke-width="9" stroke-linejoin="round"/>
      <g fill="#94d8e4" stroke="#526b7a" stroke-width="3">
        <rect x="41" y="103" width="25" height="30" rx="3"/><rect x="83" y="103" width="25" height="30" rx="3"/>
        <rect x="165" y="79" width="29" height="33" rx="3"/><rect x="222" y="79" width="29" height="33" rx="3"/>
        <rect x="305" y="103" width="25" height="30" rx="3"/><rect x="347" y="103" width="25" height="30" rx="3"/>
      </g>
      <g font-family="Arial,sans-serif" font-weight="bold" text-anchor="middle" font-size="13" fill="#183b49">
        <rect x="39" y="85" width="69" height="17" rx="5" fill="#fff8df" stroke="#536875"/><text x="73.5" y="98">SD</text>
        <rect x="164" y="62" width="88" height="17" rx="5" fill="#fff8df" stroke="#536875"/><text x="208" y="75">SMP</text>
        <rect x="304" y="85" width="70" height="17" rx="5" fill="#fff8df" stroke="#536875"/><text x="339" y="98">SMA</text>
      </g>
      <path d="M63 180V111H77V180M341 180V111H355V180M52 111H367V130H52Z" fill="#1769c2" stroke="#0d2b52" stroke-width="4"/>
      <path d="M56 114H363" stroke="#d8f0ff" stroke-width="4"/>
      <!-- flag finish pole -->
      <path d="M371 180V31" stroke="#384657" stroke-width="5"/>
      <path d="M376 32H410V66H376Z" fill="#fff"/>
      <path d="M376 32H410V49H376Z" fill="#df4b50"/>
      <!-- four welcoming students -->
      <g stroke="#554a44" stroke-width="2">
        <g transform="translate(99 193)"><circle cy="-32" r="9" fill="#b87550"/><path d="M-12 -38Q0 -52 12 -38Z" fill="#333d55"/><path d="M-10 -21H10L14 0H-14Z" fill="#f1f4ee"/><path d="M-14 0H14L11 14H-11Z" fill="#1769c2"/></g>
        <g transform="translate(145 193)"><circle cy="-32" r="9" fill="#cf9265"/><path d="M-12 -39Q0 -49 12 -37L9 -32H-10Z" fill="#75523c"/><path d="M-10 -21H10L14 0H-14Z" fill="#f1f4ee"/><path d="M-14 0H14L11 14H-11Z" fill="#58b7f2"/></g>
        <g transform="translate(191 193)"><circle cy="-32" r="9" fill="#a96a4e"/><path d="M-12 -38Q0 -51 12 -38Z" fill="#303d5a"/><path d="M-10 -21H10L14 0H-14Z" fill="#f1f4ee"/><path d="M-14 0H14L11 14H-11Z" fill="#1769c2"/></g>
        <g transform="translate(237 193)"><circle cy="-32" r="9" fill="#d59a6c"/><path d="M-12 -39Q0 -48 12 -37L9 -31H-10Z" fill="#80543b"/><path d="M-10 -21H10L14 0H-14Z" fill="#f1f4ee"/><path d="M-14 0H14L11 14H-11Z" fill="#58b7f2"/></g>
      </g>
      <g fill="#ffd25d" stroke="#9a7023" stroke-width="2"><ellipse cx="273" cy="170" rx="13" ry="5"/><ellipse cx="312" cy="176" rx="13" ry="5"/></g>
      <path d="M0 212H420" stroke="#71806f" stroke-width="4"/>
      <path d="M20 226H55V243H20ZM364 224H399V242H364Z" fill="#bd4b54"/>
      <path d="M25 230H50M369 228H394" stroke="#fff" stroke-width="5"/>
    ''', title="Fictional Cirebon SD SMP SMA school finish gate")


def make_logo() -> str:
    return svg(720, 200, '''
      <path d="M92 50Q360 -10 628 50L601 164Q360 205 119 164Z" fill="#0d2b52" stroke="#58b7f2" stroke-width="8"/>
      <path d="M130 61Q360 17 590 61" stroke="#f5bd3f" stroke-width="7" stroke-linecap="round"/>
      <circle cx="108" cy="98" r="48" fill="#f5bd3f" stroke="#fff0b2" stroke-width="6"/>
      <path d="M80 108Q105 70 133 107Q108 128 80 108Z" fill="#da8132"/>
      <path d="M103 80L111 65L119 81M133 99L147 94L137 108" stroke="#b74a40" stroke-width="6" stroke-linecap="round"/>
      <path d="M86 117Q107 103 129 117" stroke="#1769c2" stroke-width="6" stroke-linecap="round"/>
      <text x="390" y="104" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-weight="900" font-size="56" letter-spacing="2" fill="#e7fffa">MBG</text>
      <text x="390" y="141" text-anchor="middle" font-family="Trebuchet MS, sans-serif" font-weight="700" font-size="23" letter-spacing="2" fill="#ffd46f">ROAD TO SCHOOL</text>
    ''', title="MBG Road To School game logo")


def distant_scene(biome: int) -> str:
    if biome == 1:
        body = '''
          <path d="M0 262Q130 245 260 260T520 258T780 262T1024 253V420H0Z" fill="#51b7dc"/>
          <path d="M0 284Q120 275 260 284T520 282T780 286T1024 278" stroke="#d4f3f4" stroke-width="7" opacity=".65"/>
          <g fill="#fff5dc" stroke="#805333" stroke-width="4">
            <path d="M147 276H228L215 299H165Z"/><path d="M453 300H534L521 323H471Z"/><path d="M779 271H860L847 294H797Z"/>
          </g>
          <g fill="#f2aa47"><path d="M177 272V229L212 272Z"/><path d="M488 296V252L524 296Z"/><path d="M815 267V223L851 267Z"/></g>
          <path d="M0 333Q200 305 410 331T820 327T1024 318V420H0Z" fill="#7fc5ad" opacity=".68"/>
        '''
    elif biome == 2:
        body = '''
          <path d="M0 317L170 165L267 252L430 105L590 254L750 143L915 277L1024 200V420H0Z" fill="#91bcc2"/>
          <path d="M290 240L430 105L568 237L526 219L495 229L462 202L429 220L395 198L363 231Z" fill="#e9f1e4" opacity=".8"/>
          <path d="M0 329Q200 295 420 329T830 317T1024 325V420H0Z" fill="#58a76b" opacity=".7"/>
        '''
    elif biome == 3:
        body = '''
          <path d="M0 303Q150 175 310 273T620 230T1024 269V420H0Z" fill="#7f9fa4"/>
          <path d="M0 327Q190 247 388 319T760 294T1024 304V420H0Z" fill="#628f79" opacity=".83"/>
          <path d="M0 358Q250 305 510 351T1024 340V420H0Z" fill="#87ae86" opacity=".75"/>
        '''
    else:
        body = '''
          <path d="M0 291Q110 268 224 293T450 286T681 293T900 280T1024 288V420H0Z" fill="#9fb6b1"/>
          <g fill="#f5ead4" stroke="#687a7a" stroke-width="4">
            <path d="M88 282V213L144 177L199 213V282Z"/><path d="M404 286V221L462 184L520 221V286Z"/><path d="M735 282V212L793 175L852 212V282Z"/>
          </g>
          <g fill="#64aab2"><rect x="105" y="225" width="18" height="24"/><rect x="151" y="225" width="18" height="24"/><rect x="421" y="233" width="18" height="23"/><rect x="470" y="233" width="18" height="23"/><rect x="753" y="224" width="18" height="24"/><rect x="805" y="224" width="18" height="24"/></g>
        '''
    return svg(1024, 420, body, title=f"Biome {biome} distant landscape")


def midground_scene(biome: int) -> str:
    if biome == 1:
        body = '''
          <path d="M0 311Q130 296 270 308T540 300T810 311T1024 299V420H0Z" fill="#90bd69"/>
          <g stroke="#71482e" stroke-width="13" stroke-linecap="round"><path d="M190 315Q205 245 190 164"/><path d="M715 315Q733 238 720 151"/></g>
          <g fill="#32845b"><path d="M190 167Q90 139 112 109Q155 119 190 156Q155 96 184 80Q213 111 195 157Q244 111 271 131Q256 164 199 177Z"/><path d="M720 154Q621 125 641 96Q680 107 718 143Q684 82 713 65Q742 94 726 143Q777 98 801 118Q786 151 731 164Z"/></g>
          <g transform="translate(389 277)"><path d="M0 36V-23H105V36Z" fill="#f4cb74" stroke="#71482e" stroke-width="5"/><path d="M-10 -23H115L53 -54Z" fill="#397fa1" stroke="#71482e" stroke-width="5"/><path d="M12 0H93" stroke="#c37a38" stroke-width="6"/></g>
        '''
    elif biome == 2:
        body = '''
          <path d="M0 237H1024V420H0Z" fill="#5ba94f"/>
          <path d="M0 285Q150 264 310 285T630 280T1024 286V420H0Z" fill="#87c75a"/>
          <path d="M0 340Q190 318 380 339T760 334T1024 339V420H0Z" fill="#3e9149"/>
          <path d="M0 296Q150 275 310 296M0 350Q190 328 380 350" stroke="#d6dc82" stroke-width="7" opacity=".8"/>
          <g stroke="#775738" stroke-width="7"><path d="M773 333V228M845 333V245"/></g>
          <g fill="#2f8850"><path d="M773 237Q718 201 739 184Q767 194 775 223Q791 182 814 192Q811 218 780 239Z"/><path d="M845 252Q808 218 829 205Q848 212 847 239Q866 202 887 216Q880 239 852 254Z"/></g>
        '''
    elif biome == 3:
        body = '''
          <path d="M0 298Q170 258 330 299T660 288T1024 296V420H0Z" fill="#558765"/>
          <path d="M0 346Q180 305 370 345T750 335T1024 343V420H0Z" fill="#7fac72"/>
          <g fill="#286553"><path d="M170 300L201 205L232 300Z"/><path d="M196 270L201 183L221 270Z"/><path d="M820 310L858 188L896 310Z"/><path d="M844 263L858 163L877 263Z"/></g>
          <g stroke="#34725d" stroke-width="5" opacity=".7"><path d="M0 330Q210 292 410 332T820 321T1024 326"/><path d="M0 369Q220 339 430 370T820 360T1024 365"/></g>
        '''
    else:
        body = '''
          <path d="M0 326H1024V420H0Z" fill="#a1b39d"/>
          <path d="M86 326V255H156V326M298 326V245H369V326M610 326V252H683V326M843 326V242H921V326" fill="#e8deca" stroke="#637778" stroke-width="5"/>
          <path d="M72 258L121 218L171 258M284 248L333 208L383 248M596 255L646 216L697 255M829 246L881 203L935 246" fill="#1769c2" stroke="#0d2b52" stroke-width="5"/>
          <g fill="#58b7f2"><rect x="101" y="273" width="18" height="26"/><rect x="131" y="273" width="18" height="26"/><rect x="315" y="264" width="18" height="27"/><rect x="345" y="264" width="18" height="27"/><rect x="630" y="270" width="18" height="26"/><rect x="660" y="270" width="18" height="26"/></g>
          <path d="M0 220H1024" stroke="#596871" stroke-width="4"/><path d="M95 220V328M373 220V328M705 220V328M936 220V328" stroke="#596871" stroke-width="4"/>
          <path d="M96 222V257M374 222V257M706 222V257M937 222V257" stroke="#d84c52" stroke-width="11"/><path d="M96 259V294M374 259V294M706 259V294M937 259V294" stroke="#fff6e8" stroke-width="11"/>
        '''
    return svg(1024, 420, body, title=f"Biome {biome} roadside scenery")


def main() -> None:
    for directory in (SPRITES, BACKGROUNDS, UI):
        directory.mkdir(parents=True, exist_ok=True)

    # Each entry includes source dimensions and its drawing anchor in source pixels.
    specs = {
        "truckBody": ("sprites/truck_body.svg", 400, 208, {"x": 200, "y": 104}),
        "truckWheel": ("sprites/truck_wheel.svg", 152, 152, {"x": 76, "y": 76}),
        "fuelCan": ("sprites/fuel_can.svg", 72, 84, {"x": 36, "y": 42}),
        "coinGizi": ("sprites/coin_gizi.svg", 64, 64, {"x": 32, "y": 32}),
        "obstacleLog": ("sprites/obstacle_log.svg", 96, 96, {"x": 48, "y": 48}),
        "finishGate": ("sprites/finish_gate.svg", 420, 300, {"x": 0, "y": 300}),
        "gameLogo": ("ui/logo.svg", 720, 200, {"x": 360, "y": 100}),
    }

    write("sprites/truck_body.svg", make_truck())
    write("sprites/truck_wheel.svg", make_wheel())
    write("sprites/fuel_can.svg", make_fuel())
    write("sprites/coin_gizi.svg", make_coin())
    write("sprites/obstacle_log.svg", make_log())
    write("sprites/finish_gate.svg", make_gate())
    write("ui/logo.svg", make_logo())
    for biome in range(1, 5):
        write(f"backgrounds/biome_{biome}_distant.svg", distant_scene(biome))
        write(f"backgrounds/biome_{biome}_midground.svg", midground_scene(biome))
        for layer in ("distant", "midground"):
            relpath = f"backgrounds/biome_{biome}_{layer}.svg"
            specs[f"biome{biome}{layer.title()}"] = (relpath, 1024, 420, {"x": 0, "y": 0})

    manifest = {
        "version": 3,
        "format": "svg",
        "assets": {
            key: {
                "src": f"assets/refresh/v3/{relpath}",
                "fallback": {
                    "truckWheel": "assets/sprites/truck_wheel.webp",
                    "fuelCan": "assets/sprites/fuel_can.webp",
                    "coinGizi": "assets/sprites/coin_gizi.webp",
                    "obstacleLog": "assets/sprites/obstacle_log.webp",
                }.get(key),
                "width": width,
                "height": height,
                "pivot": pivot,
            }
            for key, (relpath, width, height, pivot) in specs.items()
        },
    }
    manifest_path = ROOT / "assets" / "manifest.json"
    if manifest_path.exists():
        current = json.loads(manifest_path.read_text(encoding="utf-8"))
    else:
        current = {"version": 0}
    if current.get("version", 0) > manifest["version"]:
        print(
            f"Generated {len(specs)} baseline assets in {OUT.relative_to(ROOT)}; "
            f"preserved newer runtime manifest v{current['version']}"
        )
    else:
        manifest_path.write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(f"Generated {len(specs)} manifest entries in {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
