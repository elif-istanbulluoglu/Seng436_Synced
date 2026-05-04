// Scene illustrations — pure CSS/SVG. One renderer per case style.

const Scene = ({ caseData, hotspots, foundIds, activeId, onPick, animationsOn }) => {
  const style = caseData.sceneStyle;
  return (
    <div className={`scene scene--${style}`}>
      {style === "isometric-office" && <IsometricOffice />}
      {style === "topdown-hospital" && <TopdownHospital />}
      {style === "noir-poster" && <NoirPoster />}
      <div className="scene__hotspots">
        {hotspots.map(h => {
          const found = foundIds.includes(h.id);
          const active = activeId === h.id;
          return (
            <button
              key={h.id}
              className={`hotspot ${found ? "is-found" : ""} ${active ? "is-active" : ""} ${animationsOn ? "" : "no-anim"}`}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              onClick={() => onPick(h)}
              aria-label={h.label}
              title={h.label}
            >
              <span className="hotspot__ring" />
              <span className="hotspot__ring hotspot__ring--2" />
              <span className="hotspot__dot" />
              <span className="hotspot__num">{h.id.split("-")[1]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============ CASE 1 — Isometric office ============
const IsometricOffice = () => (
  <svg className="scene__svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="lampPool" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.32" />
        <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0d1117" />
        <stop offset="100%" stopColor="#050709" />
      </linearGradient>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#161B22" />
        <stop offset="100%" stopColor="#0a0d12" />
      </linearGradient>
      <pattern id="floorgrid" width="60" height="34" patternUnits="userSpaceOnUse" patternTransform="skewX(-30)">
        <rect width="60" height="34" fill="url(#floor)" />
        <path d="M0 0H60M0 34H60" stroke="#1c232b" strokeWidth="0.6" />
      </pattern>
    </defs>
    {/* walls */}
    <rect x="0" y="0" width="1000" height="600" fill="#06080c" />
    <polygon points="0,0 1000,0 1000,260 0,260" fill="url(#wall)" />
    <polygon points="0,260 1000,260 1000,600 0,600" fill="url(#floorgrid)" opacity="0.6" />
    {/* window frame with rain */}
    <g transform="translate(580 38)">
      <rect width="340" height="180" fill="#0a0f17" stroke="#1f2a36" strokeWidth="2" />
      <line x1="170" y1="0" x2="170" y2="180" stroke="#1f2a36" strokeWidth="2" />
      <line x1="0" y1="90" x2="340" y2="90" stroke="#1f2a36" strokeWidth="2" />
      <g opacity="0.7">
        {Array.from({length: 30}).map((_, i) => (
          <line key={i} x1={Math.random()*340} y1={Math.random()*180} x2={Math.random()*340-10} y2={Math.random()*180+30}
            stroke="#3b82f6" strokeOpacity="0.18" strokeWidth="0.6" />
        ))}
      </g>
      <text x="170" y="208" textAnchor="middle" fontFamily="'Special Elite', monospace" fontSize="11" fill="#4B5563">— TECHBANK HQ —</text>
    </g>
    {/* ceiling lamp pool */}
    <ellipse cx="280" cy="330" rx="320" ry="160" fill="url(#lampPool)" />
    {/* desk */}
    <g transform="translate(80 320)">
      <polygon points="0,40 480,0 540,30 60,80" fill="#2a1d12" stroke="#3a2818" />
      <polygon points="60,80 540,30 540,200 60,250" fill="#1d130b" stroke="#3a2818" />
      <polygon points="0,40 60,80 60,250 0,210" fill="#15100a" stroke="#3a2818" />
      {/* test plan binder (HS-1 anchor area) */}
      <g transform="translate(80 60)">
        <polygon points="0,0 90,-8 95,30 5,40" fill="#7a1f1f" stroke="#b32d2d"/>
        <polygon points="5,40 95,30 95,40 5,50" fill="#5a1414"/>
        <text x="50" y="22" fontFamily="'Courier Prime'" fontSize="8" fill="#fff" textAnchor="middle">TEST PLAN</text>
      </g>
      {/* spreadsheet laptop */}
      <g transform="translate(280 30)">
        <polygon points="0,0 160,-12 170,8 10,22" fill="#0a0f17" stroke="#243042"/>
        <polygon points="10,22 170,8 175,90 15,108" fill="#070a10" stroke="#243042"/>
        {Array.from({length:6}).map((_,i)=>(
          <line key={i} x1={20} y1={32+i*11} x2={170} y2={26+i*11} stroke="#1c2532" strokeWidth="0.5"/>
        ))}
      </g>
      {/* coverage report folder */}
      <g transform="translate(20 -30)">
        <rect width="60" height="40" fill="#3a2c14" stroke="#5b4520" transform="skewY(-6)"/>
        <text x="30" y="22" fontFamily="'Courier Prime'" fontSize="6" fill="#F0EDE8" textAnchor="middle" transform="skewY(-6)">COV.34%</text>
      </g>
    </g>
    {/* whiteboard on wall */}
    <g transform="translate(150 80)">
      <rect width="220" height="150" fill="#f4ead6" stroke="#3a3024"/>
      <text x="20" y="35" fontFamily="'Special Elite'" fontSize="14" fill="#0a0d12">TRANSFER CAP</text>
      <text x="20" y="62" fontFamily="'Special Elite'" fontSize="22" fill="#b32d2d">10,000 TL</text>
      <text x="20" y="92" fontFamily="'Courier Prime'" fontSize="10" fill="#1f2a36">tested: 5k, 8k</text>
      <text x="20" y="110" fontFamily="'Courier Prime'" fontSize="10" fill="#1f2a36">edges: ?</text>
    </g>
    {/* slack message printout */}
    <g transform="translate(580 380)">
      <rect width="180" height="100" fill="#f0ede8" transform="rotate(-4)" stroke="#9ca3af"/>
      <text x="14" y="22" fontFamily="'Courier Prime'" fontSize="9" fill="#0a0d12" transform="rotate(-4)">#qa-team 14:02</text>
      <text x="14" y="40" fontFamily="'Courier Prime'" fontSize="8" fill="#1f2a36" transform="rotate(-4)">suspended accts</text>
      <text x="14" y="54" fontFamily="'Courier Prime'" fontSize="8" fill="#1f2a36" transform="rotate(-4)">edge case — skip</text>
    </g>
    {/* requirements doc */}
    <g transform="translate(220 220)">
      <rect width="100" height="62" fill="#fdfaf3" transform="rotate(8)" stroke="#9ca3af"/>
      <text x="10" y="20" fontFamily="'Courier Prime'" fontSize="8" fill="#0a0d12" transform="rotate(8)">REQ-417</text>
      <text x="10" y="36" fontFamily="'Courier Prime'" fontSize="8" fill="#b32d2d" transform="rotate(8)">currency: TBD</text>
    </g>
    {/* wall calendar */}
    <g transform="translate(490 60)">
      <rect width="80" height="100" fill="#fdfaf3" stroke="#3a3024"/>
      <rect width="80" height="22" fill="#7a1f1f"/>
      <text x="40" y="16" fontFamily="'Special Elite'" fontSize="11" fill="#fff" textAnchor="middle">SPRINT 14</text>
      {Array.from({length:5}).map((_,r)=> Array.from({length:5}).map((_,c)=>(
        <rect key={`${r}-${c}`} x={4+c*15} y={28+r*14} width="12" height="11" fill="none" stroke="#1f2a36" strokeWidth="0.4"/>
      )))}
    </g>
    {/* yellow post-it */}
    <g transform="translate(780 230)">
      <rect width="70" height="70" fill="#f5d76e" transform="rotate(6)"/>
      <text x="10" y="22" fontFamily="'Special Elite'" fontSize="9" fill="#1f2a36" transform="rotate(6)">concurrent</text>
      <text x="10" y="36" fontFamily="'Special Elite'" fontSize="9" fill="#1f2a36" transform="rotate(6)">transfers =</text>
      <text x="10" y="50" fontFamily="'Special Elite'" fontSize="9" fill="#b32d2d" transform="rotate(6)">SKIP</text>
    </g>
    {/* coverage monitor on far left */}
    <g transform="translate(40 200)">
      <rect width="78" height="50" fill="#0a0f17" stroke="#3b82f6"/>
      <text x="6" y="14" fontFamily="'Courier Prime'" fontSize="8" fill="#3b82f6">coverage</text>
      <rect x="6" y="22" width="66" height="6" fill="#1f2a36"/>
      <rect x="6" y="22" width="22" height="6" fill="#EF4444"/>
      <text x="6" y="42" fontFamily="'Courier Prime'" fontSize="8" fill="#EF4444">34%</text>
    </g>
  </svg>
);

// ============ CASE 2 — Top-down hospital IT room ============
const TopdownHospital = () => (
  <svg className="scene__svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="tilegrid" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill="#0c1118"/>
        <rect width="40" height="40" fill="none" stroke="#161e28" strokeWidth="0.5"/>
      </pattern>
      <radialGradient id="ceilingLight" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.18"/>
        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <rect width="1000" height="600" fill="url(#tilegrid)"/>
    {/* light pools */}
    <ellipse cx="200" cy="180" rx="240" ry="160" fill="url(#ceilingLight)"/>
    <ellipse cx="780" cy="420" rx="260" ry="180" fill="url(#ceilingLight)"/>
    {/* central conference table top-down */}
    <g transform="translate(220 180)">
      <rect width="560" height="240" rx="12" fill="#1d130b" stroke="#3a2818" strokeWidth="2"/>
      {/* dosage form printout */}
      <g transform="translate(36 30)">
        <rect width="120" height="160" fill="#fdfaf3" stroke="#9ca3af" transform="rotate(-3)"/>
        <text x="14" y="22" fontFamily="'Special Elite'" fontSize="11" fill="#0a0d12" transform="rotate(-3)">DOSAGE</text>
        <rect x="14" y="32" width="92" height="14" fill="none" stroke="#1f2a36" transform="rotate(-3)"/>
        <text x="60" y="44" fontFamily="'Courier Prime'" fontSize="9" fill="#0a0d12" textAnchor="middle" transform="rotate(-3)">__ mg</text>
        <text x="14" y="68" fontFamily="'Courier Prime'" fontSize="7" fill="#b32d2d" transform="rotate(-3)">range tested:</text>
        <text x="14" y="80" fontFamily="'Courier Prime'" fontSize="7" fill="#b32d2d" transform="rotate(-3)">0.5 — 5 mg only</text>
      </g>
      {/* test matrix on wall */}
      <g transform="translate(180 16)">
        <rect width="200" height="120" fill="#f4ead6" stroke="#3a3024"/>
        <text x="100" y="18" fontFamily="'Special Elite'" fontSize="11" fill="#0a0d12" textAnchor="middle">DRUG × ROUTE × WEIGHT</text>
        {Array.from({length:5}).map((_,r)=>Array.from({length:8}).map((_,c)=>(
          <rect key={`${r}-${c}`} x={10+c*23} y={28+r*16} width="20" height="13" fill={r*8+c<15 ? "#10B981":"#1f2a36"} opacity={r*8+c<15?0.7:0.3}/>
        )))}
        <text x="100" y="112" fontFamily="'Courier Prime'" fontSize="8" fill="#b32d2d" textAnchor="middle">15 / 200+ tested</text>
      </g>
      {/* classification tree */}
      <g transform="translate(410 28)">
        <circle cx="60" cy="14" r="8" fill="#3b82f6"/>
        <line x1="60" y1="22" x2="20" y2="50" stroke="#9ca3af"/>
        <line x1="60" y1="22" x2="60" y2="50" stroke="#9ca3af"/>
        <line x1="60" y1="22" x2="100" y2="50" stroke="#9ca3af"/>
        <circle cx="20" cy="56" r="6" fill="#10B981"/>
        <circle cx="60" cy="56" r="6" fill="#10B981"/>
        <circle cx="100" cy="56" r="6" fill="#EF4444" stroke="#fff" strokeWidth="1"/>
        <text x="60" y="92" fontFamily="'Courier Prime'" fontSize="7" fill="#F0EDE8" textAnchor="middle">CLASSIFICATION TREE</text>
        <text x="60" y="104" fontFamily="'Courier Prime'" fontSize="7" fill="#EF4444" textAnchor="middle">3 leaves untested</text>
      </g>
      {/* sign-off email printed */}
      <g transform="translate(40 200)">
        <rect width="160" height="32" fill="#fdfaf3" stroke="#9ca3af" transform="rotate(2)"/>
        <text x="10" y="14" fontFamily="'Courier Prime'" fontSize="7" fill="#0a0d12" transform="rotate(2)">RE: v4.1 sign-off</text>
        <text x="10" y="26" fontFamily="'Courier Prime'" fontSize="9" fill="#10B981" transform="rotate(2)">"Looks good — ship it"</text>
      </g>
      {/* nurse complaint */}
      <g transform="translate(380 188)">
        <rect width="140" height="44" fill="#fdfaf3" stroke="#9ca3af" transform="rotate(-2)"/>
        <text x="10" y="14" fontFamily="'Courier Prime'" fontSize="7" fill="#0a0d12" transform="rotate(-2)">INCIDENT IF-2284</text>
        <text x="10" y="28" fontFamily="'Courier Prime'" fontSize="8" fill="#b32d2d" transform="rotate(-2)">accepted -5mg</text>
      </g>
    </g>
    {/* patient weight clipboard left */}
    <g transform="translate(60 380)">
      <rect width="120" height="160" fill="#1f2a36" rx="4"/>
      <rect x="42" y="-6" width="36" height="14" fill="#9ca3af" rx="2"/>
      <rect x="6" y="14" width="108" height="140" fill="#fdfaf3"/>
      <text x="14" y="32" fontFamily="'Special Elite'" fontSize="10" fill="#0a0d12">WEIGHT (kg)</text>
      <line x1="14" y1="38" x2="106" y2="38" stroke="#1f2a36"/>
      {["12 kg","60 kg","80 kg","250 kg ?","0.5 kg ?"].map((t,i)=>(
        <text key={i} x="14" y={56+i*16} fontFamily="'Courier Prime'" fontSize="9" fill={i>2?"#b32d2d":"#0a0d12"}>{t}</text>
      ))}
    </g>
    {/* cause-effect notes pad bottom */}
    <g transform="translate(220 460)">
      <rect width="180" height="120" fill="#fdfaf3" stroke="#9ca3af" transform="rotate(-3)"/>
      <text x="14" y="22" fontFamily="'Special Elite'" fontSize="11" fill="#0a0d12" transform="rotate(-3)">CAUSES → EFFECTS</text>
      <text x="14" y="42" fontFamily="'Courier Prime'" fontSize="8" fill="#1f2a36" transform="rotate(-3)">• allergy_flag</text>
      <text x="14" y="56" fontFamily="'Courier Prime'" fontSize="8" fill="#1f2a36" transform="rotate(-3)">• dosage_high</text>
      <text x="14" y="80" fontFamily="'Courier Prime'" fontSize="8" fill="#b32d2d" transform="rotate(-3)">graph: NOT DRAWN</text>
    </g>
    {/* defect log far right */}
    <g transform="translate(820 200)">
      <rect width="140" height="170" fill="#0a0f17" stroke="#243042"/>
      <text x="70" y="16" fontFamily="'Courier Prime'" fontSize="8" fill="#3b82f6" textAnchor="middle">defect_log.txt</text>
      {Array.from({length:10}).map((_,i)=>(
        <text key={i} x="8" y={32+i*12} fontFamily="'Courier Prime'" fontSize="7" fill="#9ca3af">DUP-{1100+i*4} closed</text>
      ))}
    </g>
    {/* architecture diagram bottom-right */}
    <g transform="translate(820 400)">
      <rect width="140" height="120" fill="#0a0f17" stroke="#243042"/>
      <rect x="14" y="20" width="40" height="22" fill="#1f2a36" stroke="#3b82f6"/>
      <rect x="86" y="20" width="40" height="22" fill="#1f2a36" stroke="#EF4444"/>
      <line x1="54" y1="31" x2="86" y2="31" stroke="#EF4444" strokeDasharray="3 2"/>
      <text x="34" y="34" fontFamily="'Courier Prime'" fontSize="6" fill="#fff" textAnchor="middle">DOSAGE</text>
      <text x="106" y="34" fontFamily="'Courier Prime'" fontSize="6" fill="#fff" textAnchor="middle">ALLERGY</text>
      <text x="70" y="62" fontFamily="'Courier Prime'" fontSize="7" fill="#EF4444" textAnchor="middle">bypass=true</text>
      <text x="70" y="78" fontFamily="'Courier Prime'" fontSize="7" fill="#9ca3af" textAnchor="middle">in test env</text>
    </g>
    {/* post-mortem upper right */}
    <g transform="translate(420 36)">
      <rect width="180" height="96" fill="#fdfaf3" stroke="#9ca3af" transform="rotate(2)"/>
      <text x="14" y="22" fontFamily="'Special Elite'" fontSize="10" fill="#b32d2d" transform="rotate(2)">POST-MORTEM</text>
      <text x="14" y="42" fontFamily="'Courier Prime'" fontSize="8" fill="#1f2a36" transform="rotate(2)">no charters filed</text>
      <text x="14" y="56" fontFamily="'Courier Prime'" fontSize="8" fill="#1f2a36" transform="rotate(2)">no ET window</text>
      <text x="14" y="74" fontFamily="'Courier Prime'" fontSize="8" fill="#1f2a36" transform="rotate(2)">risk: accepted</text>
    </g>
  </svg>
);

// ============ CASE 3 — Noir poster (silhouette + amber pools) ============
const NoirPoster = () => (
  <svg className="scene__svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="amberPool" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5"/>
        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="venetian" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0"/>
        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.18"/>
      </linearGradient>
    </defs>
    <rect width="1000" height="600" fill="#06080c"/>
    {/* venetian blind shadows */}
    {Array.from({length:14}).map((_,i)=>(
      <rect key={i} x="0" y={i*44} width="1000" height="22" fill="url(#venetian)" opacity="0.6"/>
    ))}
    {/* large amber pool */}
    <ellipse cx="380" cy="320" rx="360" ry="220" fill="url(#amberPool)"/>
    {/* desk silhouette */}
    <rect x="0" y="460" width="1000" height="140" fill="#03050a"/>
    <rect x="0" y="455" width="1000" height="6" fill="#F59E0B" opacity="0.25"/>
    {/* code printout (long sheet) */}
    <g transform="translate(80 100)">
      <rect width="220" height="280" fill="#0a0f17" stroke="#243042"/>
      <text x="14" y="22" fontFamily="'Courier Prime'" fontSize="9" fill="#3b82f6">nav_resolver.c</text>
      {[
        "if (gps_mode == PRIMARY) {",
        "  resolve_primary();",
        "} else if (gps_mode ==",
        "    BACKUP_INERTIAL) {",
        "  // 36 lines",
        "  // never executed",
        "  inertial_path();",
        "  apply_drift_corr();",
        "}",
        "",
        "// coverage: 0%",
      ].map((l,i)=>(
        <text key={i} x="14" y={42+i*16} fontFamily="'Courier Prime'" fontSize="9"
          fill={i>=4 && i<=8 ? "#EF4444":"#9ca3af"}>{l}</text>
      ))}
    </g>
    {/* flowchart */}
    <g transform="translate(360 200)">
      <rect x="40" y="0" width="80" height="32" fill="#1f2a36" stroke="#9ca3af"/>
      <text x="80" y="20" fontFamily="'Courier Prime'" fontSize="9" fill="#F0EDE8" textAnchor="middle">geofence?</text>
      <line x1="60" y1="32" x2="20" y2="60" stroke="#10B981"/>
      <line x1="100" y1="32" x2="140" y2="60" stroke="#EF4444"/>
      <text x="20" y="56" fontFamily="'Courier Prime'" fontSize="8" fill="#10B981" textAnchor="middle">T (11 tests)</text>
      <text x="140" y="56" fontFamily="'Courier Prime'" fontSize="8" fill="#EF4444" textAnchor="middle">F (0 tests)</text>
    </g>
    {/* whiteboard boolean */}
    <g transform="translate(580 80)">
      <rect width="280" height="120" fill="#f4ead6" stroke="#3a3024"/>
      <text x="14" y="28" fontFamily="'Special Elite'" fontSize="13" fill="#0a0d12">BOOLEAN UNDER TEST</text>
      <text x="14" y="58" fontFamily="'Courier Prime'" fontSize="13" fill="#1f2a36">(altitude &gt; 1000</text>
      <text x="14" y="76" fontFamily="'Courier Prime'" fontSize="13" fill="#1f2a36">  &amp;&amp; !warning_active)</text>
      <text x="14" y="102" fontFamily="'Courier Prime'" fontSize="9" fill="#b32d2d">never split independently</text>
    </g>
    {/* DO-178C avionics binder */}
    <g transform="translate(620 230)">
      <rect width="180" height="200" fill="#3a2818" stroke="#5b4520" strokeWidth="2"/>
      <rect x="0" y="0" width="180" height="32" fill="#7a1f1f"/>
      <text x="90" y="22" fontFamily="'Special Elite'" fontSize="12" fill="#fff" textAnchor="middle">DO-178C</text>
      <rect x="14" y="48" width="152" height="138" fill="#fdfaf3"/>
      <text x="90" y="64" fontFamily="'Special Elite'" fontSize="10" fill="#0a0d12" textAnchor="middle">MC/DC MATRIX</text>
      {Array.from({length:5}).map((_,r)=>Array.from({length:5}).map((_,c)=>(
        <rect key={`${r}-${c}`} x={20+c*28} y={74+r*20} width="22" height="14" fill="none" stroke="#9ca3af"/>
      )))}
      <text x="90" y="178" fontFamily="'Courier Prime'" fontSize="8" fill="#b32d2d" textAnchor="middle">empty.</text>
    </g>
    {/* git blame screen */}
    <g transform="translate(160 400)">
      <rect width="220" height="40" fill="#0a0f17" stroke="#243042"/>
      <text x="10" y="14" fontFamily="'Courier Prime'" fontSize="7" fill="#3b82f6">git blame nav_path.c</text>
      <text x="10" y="28" fontFamily="'Courier Prime'" fontSize="8" fill="#9ca3af">// only sunny-weather sim</text>
    </g>
    {/* unit test file */}
    <g transform="translate(420 380)">
      <rect width="160" height="58" fill="#0a0f17" stroke="#243042"/>
      <text x="80" y="14" fontFamily="'Courier Prime'" fontSize="7" fill="#3b82f6" textAnchor="middle">test_geofence.spec.js</text>
      {Array.from({length:6}).map((_,i)=>(
        <text key={i} x="10" y={28+i*8} fontFamily="'Courier Prime'" fontSize="6" fill="#9ca3af">it('test {i+1}', () =&gt; ...)</text>
      ))}
    </g>
    {/* DO-178C cert sticker note */}
    <g transform="translate(820 440)">
      <rect width="140" height="80" fill="#fdfaf3" stroke="#9ca3af" transform="rotate(4)"/>
      <text x="10" y="20" fontFamily="'Special Elite'" fontSize="9" fill="#b32d2d" transform="rotate(4)">DO-178C §6.4.4.2</text>
      <text x="10" y="36" fontFamily="'Courier Prime'" fontSize="8" fill="#0a0d12" transform="rotate(4)">"MC/DC shall be</text>
      <text x="10" y="48" fontFamily="'Courier Prime'" fontSize="8" fill="#0a0d12" transform="rotate(4)">achieved for Lvl A"</text>
      <text x="10" y="66" fontFamily="'Courier Prime'" fontSize="8" fill="#b32d2d" transform="rotate(4)">— signed, ignored</text>
    </g>
    {/* incident report */}
    <g transform="translate(820 100)">
      <rect width="160" height="100" fill="#0a0f17" stroke="#EF4444"/>
      <rect width="160" height="20" fill="#EF4444"/>
      <text x="80" y="14" fontFamily="'Special Elite'" fontSize="10" fill="#fff" textAnchor="middle">INCIDENT</text>
      <text x="10" y="38" fontFamily="'Courier Prime'" fontSize="8" fill="#F0EDE8">long: 179.99999°</text>
      <text x="10" y="54" fontFamily="'Courier Prime'" fontSize="8" fill="#F0EDE8">geofence misfire</text>
      <text x="10" y="74" fontFamily="'Courier Prime'" fontSize="8" fill="#F59E0B">±180° wraparound</text>
      <text x="10" y="88" fontFamily="'Courier Prime'" fontSize="8" fill="#F59E0B">never tested</text>
    </g>
    {/* silhouette of detective looking out window */}
    <g transform="translate(450 280)" opacity="0.95">
      <ellipse cx="40" cy="180" rx="56" ry="8" fill="#000" opacity="0.6"/>
      <path d="M40 0 L20 40 L18 90 L8 180 L72 180 L62 90 L60 40 Z" fill="#03050a"/>
      <ellipse cx="40" cy="-6" rx="22" ry="14" fill="#03050a"/>
      <ellipse cx="40" cy="-12" rx="32" ry="6" fill="#03050a"/>
    </g>
  </svg>
);

window.SceneComponents = { Scene };
