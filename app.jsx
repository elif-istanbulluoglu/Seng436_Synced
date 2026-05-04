// ISO Detective — main app
const { useState, useEffect, useRef, useMemo, useCallback } = React;
const { TECHNIQUES, CASES, RANKS } = window.GAME_DATA;
const { Scene } = window.SceneComponents;

// ---------- AUDIO ----------
const AudioCtx = (() => {
  let ctx = null;
  const get = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };
  return { get };
})();

const playTone = (muted, freq, dur = 0.08, type = "sine", gain = 0.05) => {
  if (muted) return;
  try {
    const ctx = AudioCtx.get();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g); g.connect(ctx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.stop(ctx.currentTime + dur);
  } catch(e) {}
};
const playClick = (m) => playTone(m, 1200 + Math.random()*200, 0.04, "square", 0.03);
const playStamp = (m) => { playTone(m, 80, 0.18, "sawtooth", 0.12); setTimeout(()=>playTone(m, 60, 0.12, "triangle", 0.08), 40); };
const playCorrect = (m) => { playTone(m, 660, 0.1, "sine", 0.06); setTimeout(()=>playTone(m, 880, 0.14, "sine", 0.06), 80); };
const playWrong = (m) => { playTone(m, 180, 0.18, "sawtooth", 0.08); setTimeout(()=>playTone(m, 130, 0.22, "sawtooth", 0.07), 60); };
const playReveal = (m) => { for (let i=0;i<5;i++) setTimeout(()=>playTone(m, 220+i*110, 0.12, "triangle", 0.05), i*80); };
const playSiren = (m) => {
  if (m) return;
  try {
    const ctx = AudioCtx.get();
    for (let i=0;i<3;i++) setTimeout(()=>{
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(440+i*80, ctx.currentTime);
      o.frequency.linearRampToValueAtTime(880+i*80, ctx.currentTime+0.3);
      g.gain.value = 0.04;
      o.connect(g); g.connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime+0.35);
    }, i*400);
  } catch(e) {}
};

// rain looped via filtered noise (created on demand)
const useRain = (muted) => {
  const ref = useRef({ ctx: null, src: null, gain: null });
  useEffect(() => {
    if (muted) {
      if (ref.current.gain) ref.current.gain.gain.value = 0;
      return;
    }
    try {
      const ctx = AudioCtx.get();
      if (!ref.current.src) {
        const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i=0;i<d.length;i++) d[i] = (Math.random()*2-1) * 0.5;
        const src = ctx.createBufferSource();
        src.buffer = buf; src.loop = true;
        const filt = ctx.createBiquadFilter();
        filt.type = "bandpass"; filt.frequency.value = 1800; filt.Q.value = 0.6;
        const g = ctx.createGain(); g.gain.value = 0.04;
        src.connect(filt); filt.connect(g); g.connect(ctx.destination);
        src.start();
        ref.current = { ctx, src, gain: g };
      } else {
        ref.current.gain.gain.value = 0.04;
      }
    } catch(e) {}
    return () => { if (ref.current.gain) ref.current.gain.gain.value = 0; };
  }, [muted]);
};

// ---------- VFX OVERLAY ----------
const FilmGrain = () => <div className="vfx-grain" />;
const Vignette = () => <div className="vfx-vignette" />;
const Rain = ({ count = 80 } = {}) => (
  <div className="vfx-rain">
    {Array.from({length: count}).map((_, i) => (
      <span key={i} style={{
        left: `${Math.random()*100}%`,
        animationDelay: `${Math.random()*-3}s`,
        animationDuration: `${0.6 + Math.random()*0.8}s`,
        opacity: 0.1 + Math.random()*0.3,
      }}/>
    ))}
  </div>
);
const Particles = ({ count = 24 } = {}) => (
  <div className="vfx-particles">
    {Array.from({length: count}).map((_, i) => (
      <span key={i} style={{
        left: `${Math.random()*100}%`,
        top: `${Math.random()*100}%`,
        animationDelay: `${Math.random()*-20}s`,
        animationDuration: `${30 + Math.random()*40}s`,
      }}/>
    ))}
  </div>
);

// ---------- TWEAKS ----------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "animationsOn": true,
  "rain": true,
  "grain": true,
  "particles": true,
  "timerSeconds": 240,
  "showHints": true
}/*EDITMODE-END*/;

// ---------- HELPERS ----------
const fmtTime = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
const rankFor = (pct) => RANKS.find(r => pct >= r.min && pct <= r.max) || RANKS[0];

// ---------- SCREENS ----------

const Landing = ({ onStart, muted, setMuted, onTeacher }) => {
  const [code, setCode] = useState("TB-2024");
  const [name, setName] = useState("");
  return (
    <div className="screen screen--landing">
      <Rain />
      <div className="cityline">
        <svg viewBox="0 0 1600 400" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="cityFog" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#080810" stopOpacity="0"/>
              <stop offset="100%" stopColor="#080810" stopOpacity="1"/>
            </linearGradient>
          </defs>
          {/* far skyline */}
          <g opacity="0.5">
            {Array.from({length: 24}).map((_,i)=>{
              const h = 80 + (i*53)%160;
              return <rect key={i} x={i*70} y={400-h} width={50+(i*7)%30} height={h} fill="#0d1320"/>;
            })}
          </g>
          {/* near skyline */}
          {Array.from({length: 14}).map((_,i)=>{
            const h = 140 + (i*89)%180;
            const x = i*120 - 30;
            return (
              <g key={i}>
                <rect x={x} y={400-h} width={100} height={h} fill="#070a12"/>
                {Array.from({length: Math.floor(h/22)}).map((_,r)=>Array.from({length:4}).map((_,c)=>{
                  const lit = (i*31 + r*7 + c) % 5 < 2;
                  return <rect key={`${r}-${c}`} x={x+10+c*22} y={400-h+18+r*22} width="10" height="12"
                    fill={lit ? "#F59E0B" : "#1a1f2a"} opacity={lit?0.6:1}/>;
                }))}
              </g>
            );
          })}
          <rect width="1600" height="400" fill="url(#cityFog)"/>
        </svg>
      </div>
      <div className="landing__inner">
        <div className="landing__brand">
          <div className="landing__eyebrow">ISO/IEC 29119-4 · TEST TECHNIQUES</div>
          <h1 className="landing__title">ISO <span>Detective</span></h1>
          <p className="landing__tag">A noir investigation into the test techniques that weren't run.</p>
        </div>
        <div className="landing__form">
          <label>
            <span>Case code</span>
            <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())}
              maxLength={8} placeholder="TB-2024"/>
          </label>
          <label>
            <span>Detective name</span>
            <input value={name} onChange={e=>setName(e.target.value)}
              placeholder="Det. Yılmaz" maxLength={28}/>
          </label>
          <div className="landing__actions">
            <button className="btn btn--primary" onClick={()=>onStart(name || "Detective")}>
              Open the file →
            </button>
            <button className={`btn btn--ghost ${muted?"":"is-on"}`} onClick={()=>setMuted(!muted)}>
              {muted ? "♪ Sound off" : "♪ Sound on"}
            </button>
          </div>
        </div>
        <div className="landing__cases">
          {CASES.map(c => (
            <div key={c.id} className="case-thumb">
              <div className="case-thumb__code">{c.code}</div>
              <div className="case-thumb__title">{c.title}</div>
              <div className="case-thumb__meta">{c.severity} · {c.affectedUsers} affected</div>
            </div>
          ))}
        </div>
        <div className="landing__foot">
          <span>ITOISQS · Software Quality Standards</span>
          <button className="link" onClick={onTeacher}>Teacher access →</button>
        </div>
      </div>
    </div>
  );
};

const CaseFileOpen = ({ caseData, onBegin, animationsOn, muted }) => {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (!animationsOn) { setStage(3); return; }
    const t1 = setTimeout(()=>{ setStage(1); playStamp(muted); }, 600);
    const t2 = setTimeout(()=>setStage(2), 1100);
    const t3 = setTimeout(()=>setStage(3), 1900);
    return () => [t1,t2,t3].forEach(clearTimeout);
  }, []);
  return (
    <div className="screen screen--case">
      <div className="desk-bg"/>
      <div className={`folder ${stage>=1?"is-down":""} ${animationsOn?"":"no-anim"}`}>
        <div className="folder__tab">{caseData.code}</div>
        <div className="folder__cover">
          <div className={`stamp ${stage>=1?"is-on":""}`}>CLASSIFIED</div>
          <div className="folder__title">CASE FILE</div>
          <div className="folder__company">{caseData.company}</div>
        </div>
        <div className={`folder__inside ${stage>=2?"is-open":""}`}>
          <div className="case-meta">
            <div><span>Severity</span><b className={`sev sev--${caseData.severity.toLowerCase()}`}>{caseData.severity}</b></div>
            <div><span>Affected</span><b>{caseData.affectedUsers.toLocaleString()}</b></div>
            <div><span>Date</span><b>{caseData.incidentDate}</b></div>
          </div>
          <h2 className="case-title">{caseData.title}</h2>
          <p className="case-summary"><Typewriter text={caseData.summary} run={stage>=2} speed={animationsOn?14:0}/></p>
          <div className="case-hook">{caseData.hook}</div>
          <div className="case-teach"><b>Teaching focus:</b> {caseData.teaching}</div>
          <button className="btn btn--primary case-begin" disabled={stage<3} onClick={onBegin}>
            Begin investigation →
          </button>
        </div>
      </div>
    </div>
  );
};

const Typewriter = ({ text, run, speed = 16 }) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) { setN(0); return; }
    if (speed === 0) { setN(text.length); return; }
    let i = 0; const id = setInterval(() => {
      i++; setN(i);
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, run, speed]);
  return <span>{text.slice(0, n)}<span className="caret">{n<text.length?"▍":""}</span></span>;
};

// ---------- INVESTIGATION (Scene + Evidence + Suspect Board) ----------

const Investigation = ({ caseData, animationsOn, muted, timerSeconds, showHints,
                        state, dispatch, onComplete }) => {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [linking, setLinking] = useState(null); // evidence id being linked
  const [feedback, setFeedback] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [time, setTime] = useState(timerSeconds);

  useEffect(() => {
    if (state.complete) return;
    const id = setInterval(()=>setTime(t => Math.max(0, t-1)), 1000);
    return () => clearInterval(id);
  }, [state.complete]);

  useEffect(() => {
    if (time === 0 && !state.complete) {
      onComplete({ timeBonus: 0 });
    }
  }, [time]);

  const collected = state.collected; // [{hotspotId}]
  const links = state.links; // {hotspotId: {techId, attempts}}
  const allFound = collected.length === caseData.hotspots.length;
  const allLinked = caseData.hotspots.every(h => links[h.id]?.solved);

  useEffect(() => {
    if (allFound && allLinked && !state.complete) {
      const timeBonus = Math.round((time / timerSeconds) * 10);
      onComplete({ timeBonus });
    }
  }, [allFound, allLinked]);

  const handlePick = (h) => {
    if (collected.find(c=>c.hotspotId===h.id)) {
      setActiveHotspot(h); return;
    }
    playClick(muted);
    dispatch({type:"collect", hotspotId: h.id});
    setActiveHotspot(h);
  };

  const handleLink = (hotspotId, techId) => {
    const h = caseData.hotspots.find(x=>x.id===hotspotId);
    const correct = techId === h.correct;
    const prev = links[hotspotId]?.attempts || 0;
    if (correct) {
      playCorrect(muted);
      const points = prev === 0 ? 15 : 8;
      dispatch({ type:"link", hotspotId, techId, solved:true, points });
      setFeedback({ kind:"correct", h, techId, points });
    } else {
      playWrong(muted);
      dispatch({ type:"link", hotspotId, techId, solved:false });
      const trapMsg = h.traps[techId] ||
        `That technique doesn't fit the evidence. Re-read the description and look for the formal definition that matches what was missed.`;
      setFeedback({ kind:"wrong", h, techId, correctId: h.correct, trapMsg });
    }
  };

  const evidenceCount = collected.length;
  const linkedCount = caseData.hotspots.filter(h => links[h.id]?.solved).length;
  const totalHs = caseData.hotspots.length;

  return (
    <div className="screen screen--investigation">
      <div className="topbar">
        <div className="topbar__case">
          <span className="topbar__code">{caseData.code}</span>
          <span className="topbar__title">{caseData.title}</span>
        </div>
        <div className="topbar__progress">
          <Pill label="Evidence" v={evidenceCount} max={totalHs} tone="amber"/>
          <Pill label="Linked" v={linkedCount} max={totalHs} tone="green"/>
          <div className={`timer ${time<60?"is-low":""}`}>{fmtTime(time)}</div>
        </div>
      </div>
      <div className="invest-grid">
        <div className="invest-scene">
          <Scene caseData={caseData} hotspots={caseData.hotspots}
                 foundIds={collected.map(c=>c.hotspotId)}
                 activeId={activeHotspot?.id}
                 onPick={handlePick}
                 animationsOn={animationsOn}/>
          <div className="scene-caption">{caseData.company} · {caseData.incidentDate}</div>
        </div>
        <div className="invest-board">
          <SuspectBoard caseData={caseData} collected={collected} links={links}
            linking={linking} setLinking={setLinking}
            onLink={handleLink} animationsOn={animationsOn}
            activeHotspot={activeHotspot} setActiveHotspot={setActiveHotspot}/>
        </div>
      </div>
      <FieldGuide open={showGuide} onClose={()=>setShowGuide(false)}/>
      <button className="guide-toggle" onClick={()=>setShowGuide(true)}>📖 ISO Field Guide</button>
      {feedback && <FeedbackModal {...feedback} onClose={()=>setFeedback(null)}/>}
    </div>
  );
};

const Pill = ({ label, v, max, tone }) => (
  <div className={`pill pill--${tone}`}>
    <span className="pill__label">{label}</span>
    <span className="pill__v">{v}<small>/{max}</small></span>
  </div>
);

const SuspectBoard = ({ caseData, collected, links, linking, setLinking,
                       onLink, animationsOn, activeHotspot, setActiveHotspot }) => {
  const techs = caseData.techniques.map(id => TECHNIQUES[id]);
  return (
    <div className={`board ${animationsOn?"":"no-anim"}`}>
      <div className="board__head">
        <h3>Suspect Board</h3>
        <div className="board__hint">{linking
          ? "Now click the technique that caused this failure."
          : "Click a card, then select the missing technique."}</div>
      </div>
      <div className="board__layout">
        <div className="board__evidence">
          <div className="board__sect">EVIDENCE</div>
          {collected.length === 0 && <div className="board__empty">— investigate the scene —</div>}
          {collected.map(c => {
            const h = caseData.hotspots.find(x=>x.id===c.hotspotId);
            const link = links[h.id];
            const isLinking = linking === h.id;
            const rot = ((parseInt(h.id.split("-")[1])%5)-2);
            return (
              <button key={h.id}
                className={`polaroid ${link?.solved?"is-solved":""} ${isLinking?"is-linking":""}`}
                style={{ transform: `rotate(${rot}deg)` }}
                onClick={()=>{ setLinking(isLinking?null:h.id); }}>
                <div className="polaroid__corner">{h.evidence.category}</div>
                <div className="polaroid__title">{h.evidence.title}</div>
                <div className="polaroid__body">{h.evidence.body}</div>
                <div className="polaroid__iso">{h.evidence.isoRef}</div>
                {link?.solved && <div className="polaroid__solved">✓ {TECHNIQUES[link.techId].short}</div>}
                <div className="polaroid__scan"/>
              </button>
            );
          })}
        </div>
        <div className="board__techs">
          <div className="board__sect">TECHNIQUES</div>
          {techs.map(t => {
            const used = Object.values(links).some(l => l.techId === t.id && l.solved);
            return (
              <button key={t.id}
                className={`tech ${used?"is-used":""} ${linking?"is-pickable":""}`}
                disabled={!linking}
                onClick={() => linking && onLink(linking, t.id)}>
                <div className="tech__cat">{t.category}</div>
                <div className="tech__name">{t.name}</div>
                <div className="tech__short">{t.short} · {t.iso.split("§")[1]}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const FeedbackModal = ({ kind, h, techId, correctId, trapMsg, points, onClose }) => {
  const tech = TECHNIQUES[techId];
  const correct = correctId ? TECHNIQUES[correctId] : null;
  return (
    <div className="modal-shade" onClick={onClose}>
      <div className={`modal modal--${kind}`} onClick={e=>e.stopPropagation()}>
        {kind === "correct" ? (
          <>
            <div className="modal__stamp modal__stamp--green">SOLVED</div>
            <h3>Correct lead, Detective.</h3>
            <p className="modal__lead">
              <b>{h.evidence.title}</b> ↔ <b>{tech.name}</b>
            </p>
            <p>{tech.definition}</p>
            <div className="modal__points">+{points} pts</div>
            <div className="modal__iso">{tech.iso}</div>
            <button className="btn btn--primary" onClick={onClose}>Continue</button>
          </>
        ) : (
          <>
            <div className="modal__stamp modal__stamp--red">WRONG LEAD</div>
            <h3>Not the right technique, Detective.</h3>
            <p className="modal__lead">
              You picked <b>{tech.name}</b>.
            </p>
            <div className="modal__why">
              <div className="modal__hint-label">DETECTIVE'S HINT:</div>
              {trapMsg}
            </div>
            <div className="modal__not">
              <div>
                <div className="modal__pair-h">Why not {tech.short}?</div>
                <p>{tech.definition}</p>
                <small>{tech.iso}</small>
              </div>
            </div>
            <button className="btn btn--ghost" onClick={onClose}>Try again</button>
          </>
        )}
      </div>
    </div>
  );
};

const FieldGuide = ({ open, onClose }) => {
  const [filter, setFilter] = useState("All");
  if (!open) return null;
  const cats = ["All", "Black-Box", "White-Box", "Experience-Based"];
  const list = Object.values(TECHNIQUES).filter(t => filter==="All" || t.category===filter);
  return (
    <div className="modal-shade" onClick={onClose}>
      <div className="guide" onClick={e=>e.stopPropagation()}>
        <div className="guide__head">
          <div>
            <div className="guide__eyebrow">ISO/IEC 29119-4 · 2021</div>
            <h2>Field Guide</h2>
          </div>
          <button className="x" onClick={onClose}>×</button>
        </div>
        <div className="guide__tabs">
          {cats.map(c => <button key={c} className={filter===c?"is-on":""} onClick={()=>setFilter(c)}>{c}</button>)}
        </div>
        <div className="guide__body">
          {list.map(t => (
            <div key={t.id} className={`guide__item guide__item--${t.category.toLowerCase().split("-")[0]}`}>
              <div className="guide__row">
                <h4>{t.name} <small>{t.short}</small></h4>
                <span className="guide__iso">{t.iso}</span>
              </div>
              <p>{t.definition}</p>
              <div className="guide__meta">
                <span><b>When:</b> {t.when}</span>
                <span><b>Classic miss:</b> {t.mistake}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ---------- VERDICT ----------
const Verdict = ({ caseData, state, score, onNextStep, animationsOn, muted }) => {
  const [showCount, setShowCount] = useState(0);
  const max = caseData.hotspots.length * 15 + 20 + 10;
  const pct = Math.round((score / max) * 100);
  const rank = rankFor(pct);

  useEffect(() => {
    if (!animationsOn) { setShowCount(score); playReveal(muted); return; }
    playReveal(muted);
    const dur = 1500; const steps = 40;
    let i = 0;
    const id = setInterval(()=>{
      i++; setShowCount(Math.round((score * i) / steps));
      if (i >= steps) clearInterval(id);
    }, dur/steps);
    return () => clearInterval(id);
  }, []);

  const wrong = caseData.hotspots.filter(h => !state.links[h.id]?.solved || (state.links[h.id]?.attempts||0)>0);
  const solvedFirst = caseData.hotspots.filter(h => state.links[h.id]?.solved && (state.links[h.id]?.attempts||0)===0);

  return (
    <div className="screen screen--verdict">
      <div className="verdict__head">
        <div className="verdict__case">{caseData.code} · {caseData.title}</div>
        <h1>VERDICT</h1>
      </div>
      <div className={`rank-badge ${animationsOn?"in":""}`}>
        <div className="rank-badge__glyph">{rank.glyph}</div>
        <div className="rank-badge__label">{rank.label}</div>
        <div className="rank-badge__pct">{pct}%</div>
        <div className="rank-badge__score"><span>{showCount}</span> / {max} pts</div>
        <div className="rank-badge__quote">"{rank.quote}"</div>
      </div>
      <div className="verdict__cols">
        <div>
          <h3 className="solved-h">SOLVED</h3>
          {solvedFirst.length === 0 && <div className="empty">No first-attempt solves.</div>}
          {solvedFirst.map(h => (
            <div key={h.id} className="solved-card">
              <div className="solved-card__stamp">SOLVED</div>
              <div className="solved-card__title">{h.evidence.title}</div>
              <div className="solved-card__tech">→ {TECHNIQUES[h.correct].name}</div>
            </div>
          ))}
        </div>
        <div>
          <h3 className="cold-h">COLD CASES</h3>
          {wrong.length === 0 && <div className="empty">No cold cases. Clean sweep, Detective.</div>}
          {wrong.map(h => (
            <div key={h.id} className="cold-card">
              <div className="cold-card__title">{h.evidence.title}</div>
              <div className="cold-card__lesson">
                <b>Should have been:</b> {TECHNIQUES[h.correct].name}<br/>
                <span>{TECHNIQUES[h.correct].definition}</span>
              </div>
              <div className="cold-card__iso">{TECHNIQUES[h.correct].iso}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="verdict__actions">
        <button className="btn btn--primary" onClick={onNextStep}>Identify the culprit →</button>
      </div>
    </div>
  );
};

const AvatarBadge = ({ suspect, mood = "neutral" }) => {
  const initials = suspect.name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
  return <div className={`avatar avatar--${suspect.gender || "neutral"} avatar--${mood}`}><span>{initials}</span></div>;
};

const SuspectIdentification = ({ caseData, score, onArrest }) => {
  const [selected, setSelected] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [showDefense, setShowDefense] = useState(null);
  const suspects = caseData.suspects || [];
  const guiltySuspects = suspects.filter(s => s.guilty);
  const max = caseData.hotspots.length * 15 + 20 + 10;
  const pct = Math.round((score / max) * 100);

  const toggleSelect = (id) => {
    if (revealed) return;
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleProceed = () => {
    const guiltyIds = guiltySuspects.map(s => s.id);
    const correctCount = selected.filter(id => guiltyIds.includes(id)).length;
    const wrongCount = selected.filter(id => !guiltyIds.includes(id)).length;
    const bonus = Math.max(0, (correctCount * 10) - (wrongCount * 5));
    onArrest({ bonus, guiltySelected: suspects.filter(s => selected.includes(s.id) && s.guilty) });
  };

  return (
    <div className="screen screen--suspects">
      <div className="suspects__head">
        <div className="suspects__eyebrow">CASE {caseData.code} · STEP 2 OF 3</div>
        <h1>Identify the <em>Culprit</em></h1>
        <p>Study the personnel files. Your investigation found <b>{pct}%</b> of the evidence.</p>
      </div>
      {showDefense && (
        <div className="modal-shade" onClick={()=>setShowDefense(null)}>
          <div className="modal modal--defense" onClick={e=>e.stopPropagation()}>
            <div className="modal__hint-label">DEFENDANT'S STATEMENT</div>
            <h3>{showDefense.name}</h3>
            <p className="defense-quote">"{showDefense.defense}"</p>
            <div className="modal__why"><div className="modal__hint-label">ISO ANALYSIS:</div>{showDefense.defenseISO}</div>
            <button className="btn btn--ghost" onClick={()=>setShowDefense(null)}>Close</button>
          </div>
        </div>
      )}
      {!revealed && (
        <div className="suspects__instruction">
          {guiltySuspects.length > 1 ? `SELECT ALL RESPONSIBLE PARTIES (${guiltySuspects.length} SUSPECTS)` : "SELECT THE RESPONSIBLE PARTY"}
        </div>
      )}
      <div className="suspect-grid">
        {suspects.map(s => {
          const isSelected = selected.includes(s.id);
          return (
            <div key={s.id} className="suspect-wrap">
              <button className={`suspect-card ${isSelected ? "is-selected" : ""}`} onClick={()=>toggleSelect(s.id)}>
                {isSelected && !revealed && <span className="suspect-card__check">✓</span>}
                {revealed && <span className={`suspect-card__stamp ${s.guilty ? "is-guilty" : "is-clear"}`}>{s.guilty ? "GUILTY" : "INNOCENT"}</span>}
                <AvatarBadge suspect={s} mood={revealed && s.guilty ? "guilty" : "neutral"} />
                <div className="suspect-card__body">
                  <div className="suspect-card__name">{s.name}</div>
                  <div className="suspect-card__role">{s.role}</div>
                  {revealed && <div className={`suspect-card__reason ${s.guilty ? "is-guilty" : "is-clear"}`}>{s.guilty ? s.guiltReason : s.innocentReason}</div>}
                </div>
              </button>
              <button className="defense-btn" onClick={()=>setShowDefense(s)}>Hear defense</button>
            </div>
          );
        })}
      </div>
      <div className="suspects__actions">
        {!revealed ? (
          <>
            <div className="suspects__selected">Selected: <b>{selected.length}</b></div>
            <button className="btn btn--primary" disabled={selected.length === 0} onClick={()=>setRevealed(true)}>Lock In Suspects</button>
          </>
        ) : (
          <>
            <div className="suspects__quote">"Every failure has an author. Now you know who signed this one."</div>
            <button className="btn btn--primary" onClick={handleProceed}>Make the arrest →</button>
          </>
        )}
      </div>
    </div>
  );
};

const ArrestScreen = ({ caseData, guiltySelected, bonus, onContinue, muted }) => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(()=>setStep(1), 500);
    const t2 = setTimeout(()=>{ setStep(2); playSiren(muted); }, 1400);
    const t3 = setTimeout(()=>setStep(3), 3400);
    return () => [t1,t2,t3].forEach(clearTimeout);
  }, []);

  const displayed = guiltySelected.length > 0 ? guiltySelected : (caseData.suspects || []).filter(s => s.guilty);
  return (
    <div className="arrest-screen">
      <div className="arrest-lights"/>
      <Rain count={50}/>
      <div className={`arrest-title ${step>=1 ? "is-in" : ""}`}>CASE CLOSED</div>
      {step >= 1 && (
        <svg className="police-car" viewBox="0 0 360 130" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="180" cy="125" rx="160" ry="12" fill="rgba(59,130,246,0.22)"/>
          <rect x="20" y="52" width="320" height="58" rx="8" fill="#16213e"/>
          <rect x="40" y="28" width="240" height="48" rx="10" fill="#1a2540"/>
          <rect x="52" y="32" width="75" height="36" rx="5" fill="#0f3460" opacity="0.85"/>
          <rect x="143" y="32" width="75" height="36" rx="5" fill="#0f3460" opacity="0.85"/>
          <rect x="234" y="32" width="46" height="36" rx="5" fill="#0f3460" opacity="0.85"/>
          <rect x="85" y="22" width="190" height="10" rx="3" fill="#2a2a3e"/>
          <rect x="92" y="24" width="35" height="6" rx="1" fill="#EF4444"/>
          <rect x="233" y="24" width="35" height="6" rx="1" fill="#3B82F6"/>
          <text x="180" y="76" textAnchor="middle" fontFamily="'Special Elite',monospace" fontSize="13" fill="#F59E0B" letterSpacing="5">POLICE</text>
          <circle cx="85" cy="110" r="17" fill="#0a0a14" stroke="#2a3050" strokeWidth="2"/>
          <circle cx="275" cy="110" r="17" fill="#0a0a14" stroke="#2a3050" strokeWidth="2"/>
        </svg>
      )}
      {step >= 2 && (
        <div className="jail-row">
          {displayed.map((s, idx)=>(
            <div key={s.id} className="jail-card" style={{ animationDelay: `${idx*0.18}s` }}>
              <div className="jail-cell">
                <div className="jail-bars">{Array.from({length:5}).map((_, i)=><span key={i}/>)}</div>
                <AvatarBadge suspect={s} mood="guilty"/>
                <div className="jail-card__name">{s.name}</div>
                <div className="jail-card__role">{s.role}</div>
              </div>
              <div className="jail-card__quote">"{s.guiltReason.split(".")[0]}."</div>
            </div>
          ))}
        </div>
      )}
      {bonus > 0 && step >= 2 && <div className="arrest-bonus">+{bonus} BONUS — Correct identification</div>}
      {step >= 3 && <button className="btn btn--primary arrest-next" onClick={onContinue}>Improve the case →</button>}
    </div>
  );
};

const CaseImprovement = ({ caseData, totalScore, maxScore, onNext, isLast }) => {
  const [selected, setSelected] = useState([]);
  const improvements = caseData.improvements || [];
  const maxSelect = 3;
  const toggle = (id) => setSelected(prev => {
    if (prev.includes(id)) return prev.filter(x => x !== id);
    if (prev.length >= maxSelect) return prev;
    return [...prev, id];
  });
  const bonusPts = selected.reduce((sum, id) => sum + (improvements.find(i=>i.id===id)?.pts || 0), 0);
  const currentPct = Math.round((totalScore / maxScore) * 100);
  return (
    <div className="screen screen--improve">
      <div className="improve__head">
        <div className="improve__eyebrow">CASE {caseData.code} · STEP 3 OF 3</div>
        <h1>Improve the <em>Test Suite</em></h1>
        <p className="improve__subtitle">The culprit is behind bars. Select up to <b>3 improvements</b> to prevent the next failure.</p>
      </div>
      <div className="improve__instruction">SELECT UP TO 3 IMPROVEMENTS · {selected.length}/{maxSelect}</div>
      <div className="improve__grid">
        {improvements.map(imp => {
          const isSelected = selected.includes(imp.id);
          return (
            <button key={imp.id} className={`improve-card ${isSelected ? "is-selected" : ""}`} onClick={()=>toggle(imp.id)}>
              <div className="improve-card__icon">{imp.icon}</div>
              <div className="improve-card__title">{imp.title}</div>
              <div className="improve-card__desc">{imp.desc}</div>
              <div className="improve-card__iso">{imp.iso}</div>
              <div className="improve-card__pts">+{imp.pts} pts</div>
            </button>
          );
        })}
      </div>
      <div className="improve__score-preview">
        <div className="improve__score-label">Current Performance</div>
        <div className="improve__score-val">{currentPct}%</div>
        <div className="improve__bonus">{selected.length > 0 ? `+${bonusPts} improvement bonus available` : "Select improvements to earn bonus points"}</div>
      </div>
      <div className="improve__actions">
        <button className="btn btn--primary" onClick={()=>onNext(bonusPts)}>{isLast ? "Final verdict →" : "Next case →"}</button>
      </div>
    </div>
  );
};

const FinalSummary = ({ scores, name, onRestart, onDashboard, animationsOn, muted }) => {
  const total = scores.reduce((a,b)=>a+b.score, 0);
  const totalMax = scores.reduce((a,b)=>a+b.max, 0);
  const pct = Math.round((total/totalMax)*100);
  const rank = rankFor(pct);
  return (
    <div className="screen screen--verdict screen--final">
      <div className="verdict__head">
        <div className="verdict__case">ISO DETECTIVE · COMPLETE CASE FILE</div>
        <h1>FINAL VERDICT</h1>
        {name && <div className="final-detective">Detective {name}</div>}
      </div>
      <div className={`rank-badge rank-badge--big ${animationsOn?"in":""}`}>
        <div className="rank-badge__glyph">{rank.glyph}</div>
        <div className="rank-badge__label">{rank.label}</div>
        <div className="rank-badge__pct">{pct}%</div>
        <div className="rank-badge__score">{total} / {totalMax} pts</div>
        <div className="rank-badge__quote">"{rank.quote}"</div>
      </div>
      <table className="case-table">
        <thead><tr><th>Case</th><th>Score</th><th>%</th><th>Rank</th></tr></thead>
        <tbody>
          {scores.map(s => {
            const p = Math.round((s.score/s.max)*100);
            const r = rankFor(p);
            return (
              <tr key={s.id}>
                <td>{s.title}</td>
                <td>{s.score} / {s.max}</td>
                <td>{p}%</td>
                <td>{r.glyph} {r.label}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="verdict__actions">
        <button className="btn btn--primary" onClick={onRestart}>Reopen the file</button>
        <button className="btn btn--ghost" onClick={onDashboard}>Teacher dashboard</button>
      </div>
    </div>
  );
};

// ---------- TEACHER DASHBOARD (mocked) ----------
const Dashboard = ({ onBack }) => {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  if (!auth) return (
    <div className="screen screen--dash-auth">
      <div className="dash-gate">
        <h2>Teacher Access</h2>
        <p>Passcode (demo: <b>9119</b>)</p>
        <input value={pass} onChange={e=>setPass(e.target.value)} type="password"/>
        <button className="btn btn--primary" onClick={()=>setAuth(pass==="9119")}>Unlock</button>
        <button className="btn btn--ghost" onClick={onBack}>← Back</button>
      </div>
    </div>
  );

  // mocked sample data
  const students = [
    {n:"M. Demir",s:218,r:"Chief Detective"},{n:"E. Aydın",s:187,r:"Senior Investigator"},
    {n:"A. Şahin",s:241,r:"Legendary Detective"},{n:"B. Kaya",s:142,r:"Senior Investigator"},
    {n:"C. Yıldız",s:95,r:"Rookie Detective"},{n:"D. Öztürk",s:201,r:"Chief Detective"},
    {n:"F. Polat",s:178,r:"Senior Investigator"},{n:"G. Acar",s:223,r:"Chief Detective"},
    {n:"H. Korkmaz",s:155,r:"Senior Investigator"},{n:"K. Tunç",s:88,r:"Rookie Detective"},
    {n:"L. Erdem",s:212,r:"Chief Detective"},{n:"N. Avcı",s:174,r:"Senior Investigator"},
  ];
  const buckets = [0,0,0,0,0,0,0,0,0,0];
  students.forEach(s => buckets[Math.min(9, Math.floor(s.s/30))]++);
  const techDifficulty = [
    {n:"Equivalence Partitioning",pct:91},{n:"Boundary Value Analysis",pct:84},
    {n:"Decision Table",pct:62},{n:"State Transition",pct:58},{n:"Pairwise",pct:46},
    {n:"Classification Tree",pct:39},{n:"Cause-Effect Graphing",pct:31},
    {n:"Statement Testing",pct:78},{n:"Branch Testing",pct:64},
    {n:"Condition Testing",pct:55},{n:"MC/DC",pct:28},{n:"Path Testing",pct:42},
    {n:"Error Guessing",pct:71},{n:"Exploratory",pct:67},{n:"Checklist-Based",pct:73},
  ];
  const heatmap = CASES[0].hotspots.map((h,i) => ({...h, found: 60 + ((i*37)%40)}));

  return (
    <div className="screen screen--dashboard">
      <div className="dash-head">
        <div>
          <div className="dash-eyebrow">ISO DETECTIVE · LIVE CLASSROOM</div>
          <h1>Teacher Dashboard</h1>
        </div>
        <button className="btn btn--ghost" onClick={onBack}>← Back to game</button>
      </div>
      <div className="dash-stats">
        <Stat label="Joined" v={students.length+4} sub={"of 18 enrolled"}/>
        <Stat label="Submitted" v={students.length} sub="3 in progress"/>
        <Stat label="Mean score" v={Math.round(students.reduce((a,b)=>a+b.s,0)/students.length)} sub={`/ 270 pts`}/>
        <Stat label="Median rank" v="Senior" sub="Investigator"/>
      </div>
      <div className="dash-grid">
        <div className="dash-card">
          <h3>Score distribution</h3>
          <div className="bars">
            {buckets.map((c,i)=>(
              <div key={i} className="bars__col">
                <div className="bars__bar" style={{height: `${c*22+4}px`}}><b>{c}</b></div>
                <div className="bars__lab">{i*30}-{i*30+29}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="dash-card">
          <h3>Technique difficulty (% correct)</h3>
          <div className="diff-list">
            {techDifficulty.map(t => (
              <div key={t.n} className="diff-row">
                <span className="diff-row__n">{t.n}</span>
                <div className="diff-row__bar">
                  <div style={{width:`${t.pct}%`, background: t.pct<50?"#EF4444":t.pct<70?"#F59E0B":"#10B981"}}/>
                </div>
                <span className="diff-row__v">{t.pct}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="dash-card">
          <h3>Hotspot heatmap — TechBank</h3>
          <div className="heatmap">
            {heatmap.map(h => (
              <div key={h.id} className="heat" style={{
                left:`${h.x}%`, top:`${h.y}%`,
                background:`radial-gradient(circle, rgba(245,158,11,${h.found/100}), transparent 70%)`
              }}>{h.found}%</div>
            ))}
          </div>
          <div className="heatmap__cap">% of students who found each hotspot</div>
        </div>
        <div className="dash-card dash-card--students">
          <h3>Students</h3>
          <table>
            <thead><tr><th>Name</th><th>Score</th><th>Rank</th></tr></thead>
            <tbody>
              {students.sort((a,b)=>b.s-a.s).map(s => (
                <tr key={s.n}><td>{s.n}</td><td>{s.s}</td><td>{s.r}</td></tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn--ghost btn--sm">Reveal answers to class</button>
        </div>
      </div>
    </div>
  );
};
const Stat = ({ label, v, sub }) => (
  <div className="stat">
    <div className="stat__l">{label}</div>
    <div className="stat__v">{v}</div>
    <div className="stat__s">{sub}</div>
  </div>
);

// ---------- ROOT APP ----------
const reducer = (state, a) => {
  switch (a.type) {
    case "collect": {
      if (state.collected.find(c=>c.hotspotId===a.hotspotId)) return state;
      return {...state, collected:[...state.collected, {hotspotId:a.hotspotId}]};
    }
    case "link": {
      const prev = state.links[a.hotspotId] || { attempts:0, solved:false, points:0 };
      const attempts = prev.attempts + 1;
      const solved = a.solved || prev.solved;
      const points = a.solved && !prev.solved ? a.points : prev.points;
      return {...state, links:{...state.links, [a.hotspotId]:{
        techId: a.solved ? a.techId : prev.techId, attempts, solved, points
      }}};
    }
    case "complete":
      return {...state, complete:true, timeBonus:a.timeBonus};
    default: return state;
  }
};
const initState = () => ({ collected:[], links:{}, complete:false, timeBonus:0 });

const App = () => {
  const [t, setTweak] = window.useTweaks
    ? window.useTweaks(TWEAK_DEFAULTS)
    : [TWEAK_DEFAULTS, ()=>{}];
  const [view, setView] = useState("landing"); // landing | case | invest | verdict | suspect | arrest | improve | final | dashboard
  const [caseIdx, setCaseIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const [name, setName] = useState("");
  const [scores, setScores] = useState([]);
  const [investState, setInvestState] = useState(initState());
  const [arrestData, setArrestData] = useState(null);

  useRain(muted || !t.rain);

  const caseData = CASES[caseIdx];
  const dispatch = (a) => setInvestState(s => reducer(s,a));

  const startGame = (n) => { setName(n); setView("case"); };

  const completeInvestigation = ({ timeBonus }) => {
    const linkPoints = Object.values(investState.links).reduce((a,l)=>a+(l.points||0),0);
    const evidencePoints = investState.collected.length * 5;
    const allFirst = caseData.hotspots.every(h => investState.links[h.id]?.solved && investState.links[h.id]?.attempts===1);
    const allFound = investState.collected.length === caseData.hotspots.length;
    const perfect = allFirst && allFound ? 20 : 0;
    const score = linkPoints + evidencePoints + timeBonus + perfect;
    const max = caseData.hotspots.length * (15+5) + 10 + 20;
    setScores(s => [...s, { id: caseData.id, title: caseData.title, score, max, timeBonus, perfect }]);
    setInvestState(s => ({...s, complete:true, timeBonus}));
    setView("verdict");
  };

  const nextCase = () => {
    if (caseIdx < CASES.length - 1) {
      setCaseIdx(caseIdx+1);
      setInvestState(initState());
      setArrestData(null);
      setView("case");
    } else {
      setView("final");
    }
  };

  const handleArrest = ({ bonus, guiltySelected }) => {
    setArrestData({ bonus, guiltySelected });
    playSiren(muted);
    setView("arrest");
  };

  const afterArrest = () => {
    if (arrestData?.bonus > 0) {
      setScores(prev => prev.map((s, i) => i === prev.length - 1 ? {...s, score:s.score + arrestData.bonus} : s));
    }
    setView("improve");
  };

  const afterImprovement = (improveBonus) => {
    setScores(prev => prev.map((s, i) => i === prev.length - 1 ? {...s, score:s.score + improveBonus, max:s.max + 60} : s));
    nextCase();
  };

  const restart = () => {
    setCaseIdx(0); setInvestState(initState()); setScores([]); setArrestData(null); setView("landing");
  };

  const lastScore = scores[scores.length-1];

  return (
    <div className={`app ${t.animationsOn?"":"no-anim"}`}>
      {t.grain && <FilmGrain/>}
      <Vignette/>
      {t.particles && view!=="landing" && <Particles/>}
      {view === "landing" && (
        <Landing onStart={startGame} muted={muted} setMuted={setMuted} onTeacher={()=>setView("dashboard")}/>
      )}
      {view === "case" && (
        <CaseFileOpen caseData={caseData} animationsOn={t.animationsOn} muted={muted}
          onBegin={()=>setView("invest")}/>
      )}
      {view === "invest" && (
        <Investigation caseData={caseData} animationsOn={t.animationsOn} muted={muted}
          timerSeconds={t.timerSeconds} showHints={t.showHints}
          state={investState} dispatch={dispatch}
          onComplete={completeInvestigation}/>
      )}
      {view === "verdict" && lastScore && (
        <Verdict caseData={caseData} state={investState} score={lastScore.score}
          onNextStep={()=>setView("suspect")}
          animationsOn={t.animationsOn} muted={muted}/>
      )}
      {view === "suspect" && lastScore && (
        <SuspectIdentification caseData={caseData} score={lastScore.score}
          onArrest={handleArrest}/>
      )}
      {view === "arrest" && (
        <ArrestScreen caseData={caseData}
          guiltySelected={arrestData?.guiltySelected || []}
          bonus={arrestData?.bonus || 0}
          onContinue={afterArrest}
          muted={muted}/>
      )}
      {view === "improve" && lastScore && (
        <CaseImprovement caseData={caseData}
          totalScore={lastScore.score}
          maxScore={lastScore.max}
          onNext={afterImprovement}
          isLast={caseIdx === CASES.length-1}/>
      )}
      {view === "final" && (
        <FinalSummary scores={scores} name={name} onRestart={restart}
          onDashboard={()=>setView("dashboard")}
          animationsOn={t.animationsOn} muted={muted}/>
      )}
      {view === "dashboard" && (
        <Dashboard onBack={()=>setView("landing")}/>
      )}
      {window.TweaksPanel && (
        <window.TweaksPanel title="Tweaks">
          <window.TweakSection label="Effects"/>
          <window.TweakToggle label="Animations" value={t.animationsOn} onChange={v=>setTweak("animationsOn",v)}/>
          <window.TweakToggle label="Rain audio" value={t.rain} onChange={v=>setTweak("rain",v)}/>
          <window.TweakToggle label="Film grain" value={t.grain} onChange={v=>setTweak("grain",v)}/>
          <window.TweakToggle label="Drift particles" value={t.particles} onChange={v=>setTweak("particles",v)}/>
          <window.TweakSection label="Difficulty"/>
          <window.TweakSlider label="Timer" value={t.timerSeconds} min={120} max={600} step={30} unit="s"
            onChange={v=>setTweak("timerSeconds",v)}/>
          <window.TweakToggle label="Show ISO hints" value={t.showHints} onChange={v=>setTweak("showHints",v)}/>
        </window.TweaksPanel>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
