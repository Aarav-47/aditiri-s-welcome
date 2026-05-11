import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import sleepImg from "@/assets/aditiri-new.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aditiri Arya · A Little Magical Welcome" },
      { name: "description", content: "You're lovingly invited to Aditiri Arya's Chhathi Samaroh on 19 May 2026 in Patna." },
      { property: "og:title", content: "Aditiri Arya · You're Invited" },
      { property: "og:description", content: "A premium baby celebration invitation experience." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Great+Vibes&family=Inter:wght@300;400;500;600&display=swap" },
    ],
  }),
  component: PreInvitation,
});

const INVITATION_URL = "https://invitation.aditiriarya.online/";

/* ---------- Background FX ---------- */
function Particles() {
  const items = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 12,
        size: 4 + Math.random() * 8,
        kind: Math.random() > 0.6 ? "star" : "dot",
      })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* soft glows */}
      <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-blush opacity-40 blur-3xl animate-drift" />
      <div className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-gold-soft opacity-30 blur-3xl animate-drift" style={{ animationDelay: "3s" }} />
      <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-cream opacity-50 blur-3xl animate-drift" style={{ animationDelay: "6s" }} />
      {/* floating particles */}
      {items.map((p) => (
        <span
          key={p.id}
          className="absolute block"
          style={{
            left: `${p.left}%`,
            bottom: `-20px`,
            width: p.size,
            height: p.size,
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
          }}
        >
          {p.kind === "star" ? (
            <span className="block h-full w-full text-gold animate-twinkle" style={{ filter: "drop-shadow(0 0 6px currentColor)" }}>
              ✦
            </span>
          ) : (
            <span className="block h-full w-full rounded-full bg-gold-soft" style={{ boxShadow: "0 0 12px var(--gold)" }} />
          )}
        </span>
      ))}
      {/* floral corners */}
      <div className="absolute top-4 left-4 text-4xl opacity-20 select-none">❀</div>
      <div className="absolute bottom-6 right-6 text-5xl opacity-20 select-none">❀</div>
    </div>
  );
}

/* ---------- Audio (lullaby) ---------- */
function useLullaby(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const AC = (window.AudioContext || (window as any).webkitAudioContext);
    if (!AC) return;
    const ctx = new AC();
    ctxRef.current = ctx;
    const master = ctx.createGain();
    master.gain.value = 0.0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.5);

    // Gentle lullaby: simple arpeggio (twinkle-twinkle-ish)
    const notes = [523.25, 523.25, 783.99, 783.99, 880, 880, 783.99, 698.46, 698.46, 659.25, 659.25, 587.33, 587.33, 523.25];
    let t = ctx.currentTime + 0.2;
    const playLoop = () => {
      notes.forEach((f) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = f;
        g.gain.value = 0;
        g.gain.linearRampToValueAtTime(0.5, t + 0.05);
        g.gain.linearRampToValueAtTime(0, t + 0.55);
        o.connect(g).connect(master);
        o.start(t);
        o.stop(t + 0.6);
        t += 0.55;
      });
    };
    playLoop();
    const id = window.setInterval(playLoop, notes.length * 550);
    return () => {
      window.clearInterval(id);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      setTimeout(() => ctx.close(), 600);
    };
  }, [enabled]);
}

/* ---------- Typing text ---------- */
function TypingLine({ text, onDone, className = "" }: { text: string; onDone?: () => void; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i >= text.length) { onDone?.(); return; }
    const t = setTimeout(() => setI(i + 1), 55);
    return () => clearTimeout(t);
  }, [i, text, onDone]);
  return (
    <span className={className}>
      {text.slice(0, i)}
      <span className="inline-block w-[2px] h-[0.9em] bg-current opacity-70 align-middle ml-0.5 animate-pulse" />
    </span>
  );
}

/* ---------- Mascot (cute kitty/teddy hybrid SVG) ---------- */
function Mascot({ mood = "idle" }: { mood?: "idle" | "wave" | "hug" | "smile" }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      <svg viewBox="0 0 220 220" className="w-44 h-44 sm:w-56 sm:h-56 drop-shadow-[0_15px_30px_rgba(220,140,140,0.35)]">
        <defs>
          <radialGradient id="face" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#fff5ec" />
            <stop offset="100%" stopColor="#f3d9c4" />
          </radialGradient>
          <linearGradient id="bow" x1="0" x2="1">
            <stop offset="0%" stopColor="#f7b8c2" />
            <stop offset="100%" stopColor="#e88a98" />
          </linearGradient>
        </defs>
        {/* ears */}
        <motion.g animate={mood === "wave" ? { rotate: [0, -6, 6, 0] } : {}} transition={{ duration: 1, repeat: Infinity }}>
          <path d="M55 70 L40 30 L85 55 Z" fill="url(#face)" stroke="#d9a98c" strokeWidth="2" />
          <path d="M165 70 L180 30 L135 55 Z" fill="url(#face)" stroke="#d9a98c" strokeWidth="2" />
          <path d="M58 65 L52 42 L78 56 Z" fill="#f7b8c2" />
          <path d="M162 65 L168 42 L142 56 Z" fill="#f7b8c2" />
        </motion.g>
        {/* head */}
        <ellipse cx="110" cy="115" rx="78" ry="72" fill="url(#face)" stroke="#d9a98c" strokeWidth="2" />
        {/* bow */}
        <g transform="translate(110 50)">
          <path d="M-22 0 Q-30 -14 -10 -8 Q0 -14 10 -8 Q30 -14 22 0 Q30 14 10 8 Q0 14 -10 8 Q-30 14 -22 0 Z" fill="url(#bow)" />
          <circle r="5" fill="#c96c7c" />
        </g>
        {/* eyes */}
        <motion.g
          animate={{ scaleY: [1, 1, 0.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.85, 0.9, 1] }}
          style={{ transformOrigin: "110px 110px" }}
        >
          <ellipse cx="85" cy="110" rx="7" ry="9" fill="#3b2a26" />
          <ellipse cx="135" cy="110" rx="7" ry="9" fill="#3b2a26" />
          <circle cx="87" cy="107" r="2" fill="#fff" />
          <circle cx="137" cy="107" r="2" fill="#fff" />
        </motion.g>
        {/* cheeks */}
        <circle cx="78" cy="135" r="9" fill="#f7b8c2" opacity="0.7" />
        <circle cx="142" cy="135" r="9" fill="#f7b8c2" opacity="0.7" />
        {/* nose + mouth */}
        <path d="M105 132 Q110 128 115 132 Q110 136 105 132 Z" fill="#c96c7c" />
        {mood === "smile" || mood === "hug" ? (
          <path d="M95 148 Q110 162 125 148" stroke="#7a4a3e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        ) : (
          <path d="M100 145 Q110 152 120 145" stroke="#7a4a3e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}
        {/* paw waving */}
        {mood === "wave" && (
          <motion.g
            animate={{ rotate: [0, 20, -10, 20, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{ transformOrigin: "180px 130px" }}
          >
            <ellipse cx="180" cy="130" rx="14" ry="18" fill="url(#face)" stroke="#d9a98c" strokeWidth="2" />
          </motion.g>
        )}
        {mood === "hug" && (
          <>
            <ellipse cx="55" cy="160" rx="22" ry="14" fill="url(#face)" stroke="#d9a98c" strokeWidth="2" transform="rotate(-20 55 160)" />
            <ellipse cx="165" cy="160" rx="22" ry="14" fill="url(#face)" stroke="#d9a98c" strokeWidth="2" transform="rotate(20 165 160)" />
          </>
        )}
      </svg>
    </motion.div>
  );
}

/* ---------- Speech bubble ---------- */
function Bubble({ children, side = "right" }: { children: React.ReactNode; side?: "right" | "left" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass relative rounded-3xl px-5 py-3 text-foreground font-display text-lg sm:text-xl shadow-soft"
    >
      {children}
      <span
        className={`absolute bottom-[-8px] ${side === "right" ? "left-8" : "right-8"} w-4 h-4 rotate-45 glass border-r border-b`}
      />
    </motion.div>
  );
}

/* ---------- Sparkle burst ---------- */
function Burst({ trigger }: { trigger: number }) {
  const parts = useMemo(() => Array.from({ length: 18 }), []);
  return (
    <AnimatePresence>
      {trigger > 0 && (
        <motion.div key={trigger} className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {parts.map((_, i) => {
            const angle = (i / parts.length) * Math.PI * 2;
            const dist = 90 + Math.random() * 60;
            return (
              <motion.span
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 1.4 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute text-gold text-xl"
                style={{ filter: "drop-shadow(0 0 8px currentColor)" }}
              >
                ✦
              </motion.span>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Main component ---------- */
type Phase = "tap-to-start" | "scene1" | "scene2" | "scene2-reaction" | "scene3" | "envelope";

function PreInvitation() {
  const [phase, setPhase] = useState<Phase>("tap-to-start");
  const [line, setLine] = useState(0);
  const [reaction, setReaction] = useState<string>("");
  const [burst, setBurst] = useState(0);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [audioOn, setAudioOn] = useState(false);

  useLullaby(audioOn);

  const vibrate = (ms = 12) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(ms);
  };

  // Scene 1 → Scene 2
  useEffect(() => {
    if (phase === "scene1" && line >= 4) {
      const t = setTimeout(() => setPhase("scene2"), 600);
      return () => clearTimeout(t);
    }
  }, [phase, line]);

  const start = () => {
    setAudioOn(true);
    setPhase("scene1");
    vibrate(20);
  };

  const choose = (option: "teddy" | "stars" | "hi") => {
    vibrate(25);
    if (option === "teddy") setReaction("Aww! Thank you 💖");
    if (option === "stars") { setReaction("You caught my wishes ✨"); setBurst(Date.now()); }
    if (option === "hi") setReaction("Aditiri is smiling already 😊");
    setPhase("scene2-reaction");
    setTimeout(() => setPhase("scene3"), 2600);
  };

  const openEnvelope = () => {
    vibrate(30);
    setEnvelopeOpen(true);
  };

  const goToInvite = () => {
    vibrate(40);
    window.location.href = INVITATION_URL;
  };

  const lines = [
    "Hey there 👋",
    "I am Aditiri Arya",
    "Born on 23 April 2026 💕",
    "Welcome to my little magical world…",
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-luxe">
      <Particles />

      {/* Top brand */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-8">
        <div className="flex items-center gap-2 text-foreground/80">
          <span className="text-gold text-xl">❀</span>
          <span className="font-script text-2xl gold-text">Aditiri</span>
        </div>
        <button
          onClick={() => setAudioOn((v) => !v)}
          className="glass rounded-full px-3 py-1.5 text-xs font-medium text-foreground/80 hover:text-foreground transition"
          aria-label="Toggle music"
        >
          {audioOn ? "🔊 Music" : "🔈 Mute"}
        </button>
      </div>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-xl flex-col items-center justify-center px-5 pb-10">
        <AnimatePresence mode="wait">
          {/* ---------- Tap to start ---------- */}
          {phase === "tap-to-start" && (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="mx-auto mb-8 h-44 w-44 sm:h-52 sm:w-52 rounded-full overflow-hidden shadow-luxe border-4 border-cream"
              >
                <img src={sleepImg} alt="Baby Aditiri Arya" className="h-full w-full object-cover" />
              </motion.div>
              <p className="font-script text-3xl gold-text mb-2">a magical welcome</p>
              <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-3">Aditiri Arya</h1>
              <p className="text-muted-foreground mb-8">Tap to begin the experience ✨</p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={start}
                className="bg-gold-grad text-white font-medium px-8 py-3.5 rounded-full shadow-luxe text-base"
              >
                Begin ✨
              </motion.button>
            </motion.div>
          )}

          {/* ---------- Scene 1: typing intro ---------- */}
          {phase === "scene1" && (
            <motion.div
              key="s1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full text-center min-h-[300px] flex flex-col items-center justify-center gap-4"
            >
              {lines.slice(0, line + 1).map((t, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={
                    idx === 1
                      ? "font-script text-4xl sm:text-5xl gold-text leading-[1.4] py-2"
                      : idx === 3
                      ? "font-display italic text-xl sm:text-2xl text-foreground/80"
                      : "font-display text-2xl sm:text-3xl text-foreground"
                  }
                >
                  {idx === line ? (
                    <TypingLine text={t} onDone={() => setLine((l) => l + 1)} />
                  ) : (
                    t
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ---------- Scene 2: mascot + choices ---------- */}
          {phase === "scene2" && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center gap-5"
            >
              <div className="flex flex-col items-center gap-3">
                <Mascot mood="wave" />
                <div className="flex gap-2">
                  <Bubble>Hiii! 👋</Bubble>
                </div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                  <Bubble>Can we be friends?</Bubble>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="grid w-full gap-3 mt-2"
              >
                {[
                  { id: "teddy", label: "🐻  Give Teddy a Hug" },
                  { id: "stars", label: "⭐  Catch the Magic Stars" },
                  { id: "hi", label: "🍼  Say Hi to Aditiri" },
                ].map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => choose(opt.id as any)}
                    className="glass shadow-soft rounded-2xl px-5 py-4 text-base font-medium text-foreground border border-gold-soft/40 hover:shadow-glow transition-all"
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* ---------- Scene 2 reaction ---------- */}
          {phase === "scene2-reaction" && (
            <motion.div
              key="s2r"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex flex-col items-center gap-4"
            >
              <div className="relative">
                <Mascot mood="hug" />
                <Burst trigger={burst} />
              </div>
              <Bubble>{reaction}</Bubble>
            </motion.div>
          )}

          {/* ---------- Scene 3: envelope ---------- */}
          {phase === "scene3" && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center gap-5"
            >
              {!envelopeOpen && (
                <div className="flex flex-col items-center gap-3">
                  <Mascot mood="smile" />
                  <Bubble>Would you like to come to my welcoming party?</Bubble>
                  <Bubble>I have something special for you 💌</Bubble>
                </div>
              )}

              <motion.div
                initial={{ y: 60, opacity: 0, rotate: -4 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ delay: envelopeOpen ? 0 : 0.8, type: "spring", stiffness: 80 }}
                className="relative mt-4 w-full max-w-sm"
              >
                <Envelope open={envelopeOpen} onOpen={openEnvelope} />
              </motion.div>

              {envelopeOpen && (
                <motion.button
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={goToInvite}
                  className="bg-gold-grad text-white font-medium px-8 py-4 rounded-full shadow-luxe text-base mt-2 relative overflow-hidden group"
                >
                  <span className="relative z-10">Open My Invitation 💖</span>
                  <span className="absolute inset-0 bg-white/20 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700" />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className="relative z-10 pb-4 text-center text-xs text-muted-foreground">
        ​
      </footer>
    </main>
  );
}

/* ---------- Envelope ---------- */
function Envelope({ open, onOpen }: { open: boolean; onOpen: () => void }) {
  return (
    <div className="relative mx-auto" style={{ perspective: "1200px" }}>
      <motion.div
        whileHover={!open ? { scale: 1.02 } : {}}
        onClick={!open ? onOpen : undefined}
        className={`relative aspect-[3/2] w-full rounded-2xl shadow-luxe ${!open ? "cursor-pointer" : ""}`}
        style={{
          background: "linear-gradient(135deg, oklch(0.95 0.04 25), oklch(0.88 0.06 20))",
          border: "2px solid var(--gold)",
        }}
      >
        {/* Glow under flap */}
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "radial-gradient(circle at 50% 30%, oklch(0.95 0.13 80 / 0.7), transparent 65%)",
              filter: "blur(8px)",
            }}
          />
        )}

        {/* Card peeking out */}
        <motion.div
          initial={{ y: 0 }}
          animate={open ? { y: -50, opacity: 1 } : { y: 0, opacity: 0 }}
          transition={{ delay: 1.0, duration: 0.9, ease: "easeOut" }}
          className="absolute inset-x-4 top-4 bottom-6 rounded-xl bg-cream shadow-soft p-4 flex flex-col items-center justify-center text-center"
          style={{ border: "1px solid var(--gold-soft)" }}
        >
          <p className="font-script text-2xl gold-text">You're lovingly invited to</p>
          <h2 className="font-display text-2xl sm:text-3xl text-foreground mt-1 leading-tight">
            Aditiri Arya's<br />Chhathi Samaroh
          </h2>
          <p className="text-sm text-muted-foreground mt-2">19 May 2026 · Patna</p>
          <span className="mt-2 text-gold">✦ ❀ ✦</span>
        </motion.div>

        {/* Envelope back triangles (decorative) */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-1/2"
               style={{ background: "linear-gradient(180deg, transparent, oklch(0.92 0.05 22))" }} />
          <div className="absolute bottom-0 left-0 right-0 h-1/2"
               style={{ clipPath: "polygon(0 100%, 100% 100%, 50% 30%)", background: "oklch(0.96 0.04 25)" }} />
        </div>

        {/* Flap */}
        <motion.div
          initial={false}
          animate={open ? { rotateX: 180 } : { rotateX: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute top-0 left-0 right-0 origin-top"
          style={{
            height: "60%",
            transformStyle: "preserve-3d",
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            background: "linear-gradient(135deg, oklch(0.93 0.05 22), oklch(0.85 0.08 22))",
            borderTop: "2px solid var(--gold)",
            zIndex: 5,
          }}
        />

        {/* Wax seal */}
        {!open && (
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full flex items-center justify-center font-script text-2xl text-white shadow-luxe"
            style={{ background: "var(--gradient-gold)", border: "2px solid oklch(0.98 0.01 80)" }}
          >
            A
          </motion.div>
        )}

        {/* Floral corners */}
        <span className="absolute top-1 left-2 text-gold text-sm">❀</span>
        <span className="absolute top-1 right-2 text-gold text-sm">❀</span>

        {!open && (
          <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-foreground/70 font-medium tracking-wide z-10">
            Tap to open ✨
          </div>
        )}
      </motion.div>
    </div>
  );
}
