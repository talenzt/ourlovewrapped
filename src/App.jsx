// OurLoveWrapped.jsx
// Experiencia de aniversario inspirada en Spotify Wrapped
// Stack: React, Tailwind CSS, Framer Motion

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Paleta de colores ───────────────────────────────────────────────────────
// #0F0F0F – negro base
// #1DB954 – verde Spotify (acento)
// #FF6B6B – rosa coral (calidez)
// #C77DFF – violeta suave (romance)
// #FFD166 – amarillo dorado (alegría)
// #06D6A0 – menta (frescura)
// #1A1A2E – azul marino oscuro (fondo alternativo)

// ─── Datos de slides ─────────────────────────────────────────────────────────
const SLIDES = [
  { id: 0, type: "intro" },
  { id: 1, type: "soundtrack" },
  { id: 2, type: "stats" },
  { id: 3, type: "mood" },
  { id: 4, type: "message" },
];

// ─── Gradientes por slide ────────────────────────────────────────────────────
const SLIDE_GRADIENTS = [
  "from-[#1A1A2E] via-[#16213E] to-[#0F3460]",
  "from-[#1DB954] via-[#0F0F0F] to-[#1A1A2E]",
  "from-[#C77DFF] via-[#1A1A2E] to-[#0F0F0F]",
  "from-[#FF6B6B] via-[#1A1A2E] to-[#0F0F0F]",
  "from-[#FFD166] via-[#FF6B6B] to-[#C77DFF]",
];

// ─── Tarjetas de recuerdos (Slide 2) ────────────────────────────────────────
const MEMORIES = [
  {
    id: 1,
    label: "Primera Cita",
    emoji: "🌙",
    color: "#C77DFF",
    image: "/airbnb.jpg",
  },
  {
    id: 2,
    label: "Llamadas de Noche",
    emoji: "📞",
    color: "#1DB954",
    image: "/call.png",
  },
  {
    id: 3,
    label: "Nuestra Canción",
    emoji: "🎵",
    color: "#FFD166",
    image: "/stay.jpg",
  },
  {
    id: 4,
    label: "Primeros drinks",
    emoji: "💋",
    color: "#FF6B6B",
    image: "/drinks.jpg",
  },
];

// ─── Variantes de animación ──────────────────────────────────────────────────
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (dir) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { y: 40, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ─── Burbujas flotantes ──────────────────────────────────────────────────────
function Bubble({ x, size, color, delay, duration }) {
  // Cada burbuja sube en zigzag suave con drift horizontal
  const driftX = (Math.random() - 0.5) * 80;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        bottom: "-10%",
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}22)`,
        border: `1px solid ${color}55`,
        backdropFilter: "blur(2px)",
      }}
      initial={{ y: 0, x: 0, opacity: 0, scale: 0.4 }}
      animate={{
        y: [0, "-110vh"],
        x: [0, driftX, -driftX / 2, driftX / 3],
        opacity: [0, 0.85, 0.7, 0],
        scale: [0.4, 1, 0.9, 0.7],
      }}
      transition={{ duration, delay, ease: "easeInOut" }}
    />
  );
}

function Bubbles() {
  const COLORS = [
    "#C77DFF",
    "#1DB954",
    "#06D6A0",
    "#FFD166",
    "#FF6B6B",
    "#ffffff",
  ];
  const bubbles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 12 + Math.random() * 36, // entre 12px y 48px
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    delay: Math.random() * 2.5,
    duration: 4 + Math.random() * 3, // entre 4s y 7s
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
      {bubbles.map((b) => (
        <Bubble key={b.id} {...b} />
      ))}
    </div>
  );
}

// ─── Barra de progreso ───────────────────────────────────────────────────────
function ProgressBar({ current, total }) {
  return (
    <div className="flex gap-2 px-6 pt-5 pb-2 z-10 relative">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1 flex-1 rounded-full overflow-hidden bg-white/20"
        >
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ scaleX: 0, transformOrigin: "left" }}
            animate={{ scaleX: i < current ? 1 : 0 }}
            transition={{ duration: 0.4, delay: i === current - 1 ? 0.1 : 0 }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Slide 1: Intro ──────────────────────────────────────────────────────────
function SlideIntro() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full px-8 text-center"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp} className="mb-4">
        <span className="text-6xl">💞</span>
      </motion.div>
      <motion.p
        variants={fadeUp}
        className="text-white/50 uppercase tracking-[0.25em] text-xs font-medium mb-3"
      >
        Tu año en amor
      </motion.p>
      <motion.h1
        variants={fadeUp}
        className="text-5xl font-black text-white leading-tight"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Nuestros
        <br />
        <span style={{ color: "#1DB954" }}>Primeros 60</span>
        <br />
        Días.
      </motion.h1>
      <motion.p
        variants={fadeUp}
        className="text-white/50 mt-6 text-sm max-w-xs leading-relaxed"
        style={{ fontFamily: "'Lora', serif", fontStyle: "italic" }}
      >
        Dos meses de momentos, recuerdos y magia — envueltos solo para ti.
      </motion.p>
    </motion.div>
  );
}

// ─── Slide 2: Momentos ───────────────────────────────────────────────────────
function SlideSoundtrack() {
  return (
    <motion.div
      className="flex flex-col h-full px-6 pt-4 pb-8"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp} className="mb-5">
        <p className="text-white/50 uppercase tracking-[0.2em] text-xs mb-1">
          Capítulo 2
        </p>
        <h2
          className="text-3xl font-black text-white"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Nuestros Momentos
          <br />
          <span style={{ color: "#1DB954" }}>Más Repetidos.</span>
        </h2>
      </motion.div>

      {/* Grid bento 2×2 */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {MEMORIES.map((m) => (
          <motion.div
            key={m.id}
            variants={scaleIn}
            whileHover={{ scale: 1.03 }}
            className="rounded-2xl overflow-hidden relative flex flex-col justify-between p-4"
            style={{
              background: `${m.color}22`,
              border: `1px solid ${m.color}44`,
            }}
          >
            {/* Imagen de fondo que cubre todo el recuadro */}
            <img
              src={m.image}
              alt={m.label}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: 0.5,
                filter: "blur(0px)",
              }}
            />

            {/* Gradiente sobre la imagen */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${m.color}40 0%, transparent 60%)`,
              }}
            />

            {/* Contenido por encima de la imagen */}
            <span className="text-3xl relative z-10">{m.emoji}</span>
            <div className="relative z-10">
              <p
                className="text-white font-bold text-sm"
                style={{ color: m.color }}
              >
                {m.label}
              </p>
              <p className="text-white/60 text-xs">Un recuerdo especial</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Slide 3: Estadísticas ───────────────────────────────────────────────────
function SlideStats() {
  const stats = [
    { value: "2", unit: "meses", label: "juntos", color: "#C77DFF" },
    { value: "120+", unit: "horas", label: "en llamadas", color: "#1DB954" },
    { value: "12", unit: "citas", label: "y contando", color: "#FFD166" },
    { value: "∞", unit: "risas", label: "garantizadas", color: "#FF6B6B" },
  ];

  return (
    <motion.div
      className="flex flex-col h-full px-6 pt-4 pb-8"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp} className="mb-6">
        <p className="text-white/50 uppercase tracking-[0.2em] text-xs mb-1">
          Capítulo 3
        </p>
        <h2
          className="text-3xl font-black text-white"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          En
          <br />
          <span style={{ color: "#C77DFF" }}>Números.</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={scaleIn}
            className="rounded-2xl p-5 flex flex-col justify-between"
            style={{
              background: `${s.color}18`,
              border: `1px solid ${s.color}33`,
            }}
          >
            <div>
              {/* Fuente más pequeña si el valor es largo (ej: "120+") */}
              <span
                className="font-black leading-none block"
                style={{
                  color: s.color,
                  fontFamily: "'Syne', sans-serif",
                  fontSize: s.value.length > 2 ? "2.4rem" : "3rem",
                }}
              >
                {s.value}
              </span>
              <span className="text-white font-semibold text-base">
                {s.unit}
              </span>
            </div>
            <p className="text-white/40 text-xs uppercase tracking-widest">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Slide 4: Género / Mood ──────────────────────────────────────────────────
function SlideMood() {
  const tags = [
    "Alegría pura",
    "Noches largas",
    "Mariposas",
    "Conversaciones profundas",
    "Lugar seguro",
  ];

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full px-6 text-center"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.p
        variants={fadeUp}
        className="text-white/50 uppercase tracking-[0.2em] text-xs mb-2"
      >
        Capítulo 4 · Tu género
      </motion.p>
      <motion.div
        variants={scaleIn}
        className="w-28 h-28 rounded-3xl mb-5 flex items-center justify-center text-5xl"
        style={{ background: "linear-gradient(135deg, #FF6B6B, #C77DFF)" }}
      >
        🎬
      </motion.div>
      <motion.h2
        variants={fadeUp}
        className="text-4xl font-black text-white mb-1"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Comedia
      </motion.h2>
      <motion.h2
        variants={fadeUp}
        className="text-4xl font-black mb-6"
        style={{ color: "#FF6B6B", fontFamily: "'Syne', sans-serif" }}
      >
        Romántica.
      </motion.h2>

      <motion.div
        variants={staggerContainer}
        className="flex flex-wrap justify-center gap-2"
      >
        {tags.map((tag) => (
          <motion.span
            key={tag}
            variants={fadeUp}
            className="text-xs px-3 py-2 rounded-full text-white/70 border border-white/20"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Slide 5: Mensaje final ──────────────────────────────────────────────────
// Recibe playing/onPlay para controlar el audio desde el padre
function SlideMessage({ playing, onPlay }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full px-8 text-center"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.span variants={fadeUp} className="text-5xl mb-4 block">
        💌
      </motion.span>
      <motion.p
        variants={fadeUp}
        className="text-white/50 uppercase tracking-[0.2em] text-xs mb-5"
      >
        Una nota para ti
      </motion.p>
      <motion.p
        variants={fadeUp}
        className="text-white text-base leading-relaxed font-light mb-8"
        style={{ fontFamily: "'Lora', serif", fontStyle: "italic" }}
      >
        "Hace mas de dos meses llegaste a mi vida y de alguna forma sentí que
        siempre habías estado aquí. Cada risa, cada llamada, cada momento en
        silencio — los repetiría todos. Aquí va por siempre más. 🫶"
      </motion.p>

      {/* Botón play/pausa — cambia color y texto según estado */}
      <motion.button
        variants={scaleIn}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPlay}
        className="flex items-center gap-3 px-8 py-4 rounded-full text-black font-bold text-sm transition-all"
        style={{
          background: playing
            ? "linear-gradient(90deg, #FF6B6B, #C77DFF)"
            : "linear-gradient(90deg, #1DB954, #06D6A0)",
        }}
      >
        <span className="text-lg">{playing ? "⏸" : "▶"}</span>
        {playing ? "Pausar canción" : "Reproducir nuestra canción"}
      </motion.button>

      {/* Barras animadas de "reproduciendo" */}
      {playing && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mt-4"
        >
          {[0, 0.15, 0.3, 0.15, 0].map((delay, i) => (
            <motion.div
              key={i}
              className="w-0.75 rounded-full"
              style={{ background: "#1DB954" }}
              animate={{ height: ["6px", "18px", "6px"] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
              }}
            />
          ))}
          <span className="text-white/40 text-xs ml-2">reproduciendo...</span>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Pantalla de inicio ───────────────────────────────────────────────────────
function LandingScreen({ onStart }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className="w-20 h-20 rounded-3xl mb-6 flex items-center justify-center text-4xl"
        style={{ background: "linear-gradient(135deg, #1DB954, #C77DFF)" }}
      >
        💞
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-black text-white mb-2"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        Our Love
      </motion.h1>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-black mb-4"
        style={{ color: "#1DB954", fontFamily: "'Syne', sans-serif" }}
      >
        Wrapped 💚
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/40 text-sm mb-10"
        style={{ fontFamily: "'Lora', serif", fontStyle: "italic" }}
      >
        2 meses. Incontables recuerdos.
      </motion.p>
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={onStart}
        className="px-10 py-4 rounded-full text-black font-bold tracking-wide text-sm"
        style={{ background: "#1DB954" }}
      >
        Comenzar →
      </motion.button>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function OurLoveWrapped() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [bubbles, setBubbles] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Ref del objeto Audio — se crea una sola vez al primer click
  // ⚠️ Cambia "/song.mp3" por la ruta real de tu canción dentro de /public
  const audioRef = useRef(null);

  // Inyección de fuentes Google
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Lora:ital@0;1&display=swap";
    document.head.appendChild(link);
  }, []);

  // Pausa automática si el usuario sale del slide 5
  useEffect(() => {
    if (current !== 4 && audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
    }
  }, [current]);

  function goNext() {
    if (current < SLIDES.length - 1) {
      setDirection(1);
      setCurrent((p) => p + 1);
    }
  }

  function goPrev() {
    if (current > 0) {
      setDirection(-1);
      setCurrent((p) => p - 1);
    }
  }

  // Toggle play/pausa; confetti solo al primer play
  function handlePlay() {
    if (!audioRef.current) {
      audioRef.current = new Audio("/song.mp3");
      audioRef.current.volume = 0.7;
      audioRef.current.addEventListener("ended", () => setPlaying(false));
    }

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
      // Confetti solo si es el comienzo de la canción
      if (audioRef.current.currentTime < 1) {
        setBubbles(true);
        setTimeout(() => setBubbles(false), 6000);
      }
    }
  }

  const renderSlide = (type) => {
    if (type === "intro") return <SlideIntro />;
    if (type === "soundtrack") return <SlideSoundtrack />;
    if (type === "stats") return <SlideStats />;
    if (type === "mood") return <SlideMood />;
    if (type === "message")
      return <SlideMessage playing={playing} onPlay={handlePlay} />;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F] p-4">
      {bubbles && <Bubbles />}

      {/* Marco tipo teléfono */}
      <div
        className="relative w-full max-w-sm h-170 rounded-[2.5rem] overflow-hidden shadow-2xl"
        style={{
          boxShadow:
            "0 0 80px rgba(29,185,84,0.15), 0 30px 60px rgba(0,0,0,0.6)",
        }}
      >
        {!started ? (
          <div className="absolute inset-0 bg-linear-to-br from-[#1A1A2E] via-[#0F0F0F] to-[#1DB95422]">
            <LandingScreen onStart={() => setStarted(true)} />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col">
            {/* Fondo degradado por slide */}
            <div
              className={`absolute inset-0 bg-linear-to-br ${SLIDE_GRADIENTS[current]} transition-all duration-700`}
            />

            {/* Textura de ruido sutil */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />

            <ProgressBar current={current + 1} total={SLIDES.length} />

            {/* Área de slides con animación de entrada/salida */}
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence custom={direction} mode="popLayout">
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >
                  {renderSlide(SLIDES[current].type)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controles de navegación */}
            <div className="relative z-10 flex items-center justify-between px-6 py-4">
              <button
                onClick={goPrev}
                disabled={current === 0}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 disabled:opacity-20 transition-all hover:bg-white/10"
              >
                ←
              </button>

              <span className="text-white/30 text-xs">
                {current + 1} / {SLIDES.length}
              </span>

              {current < SLIDES.length - 1 ? (
                <button
                  onClick={goNext}
                  className="px-5 py-2 rounded-full text-sm font-semibold text-black"
                  style={{ background: "#1DB954" }}
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  onClick={() => {
                    setCurrent(0);
                    setStarted(false);
                    setBubbles(false);
                  }}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-white/60 border border-white/20"
                >
                  Repetir
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
