"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Heart, Music, VolumeX, Gift, X, Ticket } from "lucide-react";

import photo1 from "@/assets/1.jpg";
import photo2 from "@/assets/2.jpg";
import photo3 from "@/assets/10.jpg";
import photo4 from "@/assets/3.jpg";
import photo5 from "@/assets/4.jpg";
import photo6 from "@/assets/5.jpg";
import photo7 from "@/assets/6.jpg";
import photo8 from "@/assets/7.jpg";
import photo9 from "@/assets/11.jpg";
import familyBig from "@/assets/big.jpg";
import bgBokeh from "@/assets/bg-bokeh.jpg";

type Memory = {
  src: any; // StaticImageData
  caption: string;
  rotate: number;
  top: string;
  left: string;
  delay: number;
};

// Foto untuk polaroid melayang di sekitar surat (background scatter)
const scatterMemories: Memory[] = [
  { src: photo2, caption: "Senyumnya bikin meleleh 🥹", rotate: -7, top: "6%", left: "4%", delay: 0 },       // 2.jpg - Bunda & bayi di kereta
  { src: photo3, caption: "Date night kita berdua 🌙", rotate: 5, top: "12%", left: "78%", delay: 0.1 },            // 10.jpg - Selfie berdua malam hari
  { src: photo1, caption: "Hai dunia, aku datang! 👶", rotate: -4, top: "55%", left: "2%", delay: 0.2 },             // 1.jpg - Newborn letterboard
  { src: photo4, caption: "Pipi gembilnya ga abis-abis ✨", rotate: 8, top: "60%", left: "80%", delay: 0.3 },        // 3.jpg - Close-up bayi senyum
];

// Foto untuk galeri grid momen terindah (tidak ada duplikat dengan scatter)
const gridMemories: Memory[] = [
  { src: photo5, caption: "Jagoan kecil lagi santai~", rotate: -3, top: "0%", left: "0%", delay: 0 },               // 4.jpg - Bayi di karpet sama mainan
  { src: photo6, caption: "Jalan-jalan bertiga, lengkap sudah 💕", rotate: 6, top: "0%", left: "0%", delay: 0.1 },   // 5.jpg - Keluarga bertiga di danau
  { src: photo7, caption: "Papa sama jagoannya~", rotate: -5, top: "0%", left: "0%", delay: 0.2 },                   // 6.jpg - Ayah topi Converse gendong bayi
  { src: photo8, caption: "Ketawa bareng di perjalanan 🚂", rotate: 6, top: "0%", left: "0%", delay: 0.3 },          // 7.jpg - Ayah & bayi senyum di kereta
  { src: photo9, caption: "Tidur pulas, damai banget 😴", rotate: -4, top: "0%", left: "0%", delay: 0.4 },           // 11.jpg - Bayi tidur close-up
];

// Gabungan semua untuk lightbox
const allMemories: Memory[] = [...scatterMemories, ...gridMemories];

// Helper to get image source URL from Vite/Next.js imports
function getImgSrc(img: any): string {
  if (typeof img === "string") return img;
  return img?.src || "";
}

export default function BirthdayLetter() {
  const [opened, setOpened] = useState(false);
  const [lightbox, setLightbox] = useState<Memory | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = (forceState?: boolean) => {
    if (!audioRef.current) return;
    const nextState = forceState !== undefined ? forceState : !musicOn;
    if (nextState) {
      audioRef.current.play()
        .then(() => setMusicOn(true))
        .catch((err) => {
          console.log("Audio playback failed or was prevented:", err);
          setMusicOn(false);
        });
    } else {
      audioRef.current.pause();
      setMusicOn(false);
    }
  };

  // Attempt autoplay on initial mount (might be blocked by browser)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setMusicOn(true))
        .catch(() => {
          // Autoplay blocked, wait for user interaction
          setMusicOn(false);
        });
    }
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Soft background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-40 blur-3xl"
        style={{ backgroundImage: `url(${getImgSrc(bgBokeh)})`, backgroundSize: "cover", backgroundPosition: "center" }}
        aria-hidden
      />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,235,200,0.55),rgba(220,170,120,0.25)_60%,rgba(140,90,40,0.35))]" aria-hidden />

      <FloatingParticles />

      {/* Audio element for local MP3 */}
      <audio ref={audioRef} src="/audio.mp3" loop autoPlay />

      {/* Music toggle */}
      <button
        onClick={() => toggleMusic()}
        aria-label={musicOn ? "Jeda musik latar" : "Putar musik latar"}
        className="fixed top-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-cream/70 px-4 py-2 text-sm text-ink shadow-lg backdrop-blur-md transition hover:bg-cream"
      >
        {musicOn ? <Music className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        <span className="font-[var(--font-hand)] text-base">
          {musicOn ? "Musik Aktif" : "Putar Musik"}
        </span>
      </button>

      <AnimatePresence mode="wait">
        {!opened ? (
          <EnvelopeIntro key="intro" onOpen={() => {
            setOpened(true);
            toggleMusic(true);
          }} />
        ) : (
          <RevealedExperience key="open" onPhotoClick={setLightbox} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightbox && <Lightbox memory={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>
    </main>
  );
}

/* ------------------------------- Envelope ------------------------------- */

function EnvelopeIntro({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="flex min-h-screen flex-col items-center justify-center px-6"
    >
      <motion.button
        onClick={onOpen}
        aria-label="Buka surat"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="group relative outline-none"
      >
        <motion.div
          className="animate-breathe"
          style={{ filter: "drop-shadow(0 30px 50px rgba(120, 60, 20, 0.45))" }}
        >
          <Envelope />
        </motion.div>
      </motion.button>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="mt-10 text-center font-[var(--font-script)] text-2xl text-ink/85 md:text-3xl"
      >
        Surat spesial untukmu <Heart className="inline h-5 w-5 fill-wax text-wax" />
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.6, duration: 1.2 }}
        className="mt-3 text-sm tracking-[0.3em] text-ink/60 uppercase"
      >
        Ketuk untuk membuka
      </motion.p>
    </motion.section>
  );
}

function Envelope({ open = false }: { open?: boolean }) {
  return (
    <div className="relative h-56 w-80 md:h-72 md:w-[28rem]">
      {/* Body */}
      <div
        className="absolute inset-0 rounded-md"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.94 0.03 85) 0%, oklch(0.88 0.05 80) 60%, oklch(0.82 0.07 75) 100%)",
          boxShadow:
            "inset 0 0 40px rgba(120,70,30,0.18), 0 20px 40px -10px rgba(80,40,10,0.35)",
        }}
      />
      {/* Bottom flap edges */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, oklch(0.86 0.05 78) 60%, oklch(0.78 0.07 70) 100%)",
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          clipPath: "polygon(0 0, 50% 60%, 100% 0, 100% 100%, 0 100%)",
          background:
            "linear-gradient(180deg, oklch(0.9 0.05 80) 0%, oklch(0.82 0.07 75) 100%)",
        }}
      />
      {/* Top flap */}
      <motion.div
        className="absolute inset-x-0 top-0 origin-top"
        initial={false}
        animate={{ rotateX: open ? -175 : 0 }}
        transition={{ duration: 1.2, ease: [0.6, 0.05, 0.2, 0.95] }}
        style={{
          transformStyle: "preserve-3d",
          height: "62%",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          background:
            "linear-gradient(180deg, oklch(0.93 0.04 85) 0%, oklch(0.84 0.06 78) 100%)",
          boxShadow: "0 4px 12px rgba(80,40,10,0.2)",
        }}
      />
      {/* Wax seal */}
      <div className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
        <div
          className="relative flex h-16 w-16 items-center justify-center rounded-full md:h-20 md:w-20"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, oklch(0.6 0.2 22), oklch(0.38 0.18 22) 70%, oklch(0.28 0.12 22))",
            boxShadow:
              "inset -3px -4px 8px rgba(0,0,0,0.4), inset 3px 3px 6px rgba(255,180,150,0.4), 0 4px 10px rgba(80,20,10,0.4)",
          }}
        >
          <Heart className="h-7 w-7 fill-cream/90 text-cream/90 md:h-9 md:w-9" strokeWidth={1.2} />
        </div>
      </div>
      {/* To label */}
      <p
        className="pointer-events-none absolute left-1/2 bottom-[18%] -translate-x-1/2 text-center font-[var(--font-script)] text-lg tracking-wide md:text-xl"
        style={{ color: "oklch(0.4 0.08 50)" }}
      >
        Untuk istriku Bella
      </p>
    </div>
  );
}

/* ----------------------------- Revealed view ---------------------------- */

function RevealedExperience({ onPhotoClick }: { onPhotoClick: (m: Memory) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative"
    >
      <Confetti />
      <LetterSection />
      <PhotoScatter memories={scatterMemories} onPhotoClick={onPhotoClick} />
      <MemoryStream memories={gridMemories} onPhotoClick={onPhotoClick} />
      <FinalSurprise />
    </motion.div>
  );
}

function LetterSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-4 py-24">
      <motion.article
        initial={{ y: 60, opacity: 0, rotateX: -8, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, rotateX: 0, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="paper relative z-10 mx-auto w-full max-w-2xl rounded-sm px-8 py-12 md:px-16 md:py-20"
        style={{ boxShadow: "var(--shadow-paper)" }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-amber-900/10" />
        <h1 className="text-center font-[var(--font-script)] text-4xl text-wax md:text-6xl text-shadow-soft">
          Selamat Ulang Tahun, Istriku Tercinta
        </h1>
        <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-wax/60 to-transparent" />

        <div className="mt-10 space-y-5 font-[var(--font-hand)] text-xl leading-relaxed text-ink md:text-2xl">
          <p>Untuk istriku tersayang,</p>
          <p>
            Maaf karena ucapan ini datang terlambat, bahkan meskipun hari ulang tahunmu sudah terlewat.
            Namun, rasa sayang dan syukurku untukmu tidak pernah datang terlambat, selalu ada setiap hari
            tanpa henti.
          </p>
          <p>
            Hari ini bukan hanya tentang bertambahnya usiamu, tetapi juga tentang merayakan sosok luar biasa
            yang telah membawa begitu banyak kebahagiaan dan kehangatan dalam hidup kami.
          </p>
          <p>
            Terima kasih telah menjadi istri yang penuh kasih, sahabat terbaik dalam setiap perjalanan hidup,
            dan ibu yang begitu baik untuk jagoan kita. Melihatmu merawat, mendidik, dan menyayangi anak kita
            selalu membuatku bangga dan bersyukur memiliki kamu di sisi kami.
          </p>
          <p>
            Setiap tawa yang terdengar di rumah ini, setiap pelukan hangat, dan setiap momen kebersamaan yang
            kita miliki, tidak lepas dari cinta dan perhatian yang kamu berikan setiap hari.
          </p>
          <p>
            Aku bersyukur atas semua kenangan yang telah kita lalui bersama, dan aku menantikan begitu banyak
            cerita indah yang masih akan kita ukir di masa depan.
          </p>
          <p>
            Di usiamu yang baru ini, semoga Allah selalu melimpahkan keberkahan dalam setiap langkahmu,
            menguatkan hatimu dalam beribadah, dan memberikan kesehatan serta kebahagiaan yang selalu
            menyertaimu. Jangan lupa untuk selalu menjaga kesehatan, karena kamu adalah sosok yang sangat
            berharga bagi kami.
          </p>
          <p>
            Terima kasih untuk semua cinta, kesabaran, dan pengorbanan yang telah kamu berikan untuk keluarga
            kecil kita.
          </p>
          <p>Kami mencintaimu lebih dari yang bisa diungkapkan dengan kata-kata.</p>
          <p className="pt-2">Selamat Ulang Tahun, Sayangku. ❤️</p>
          <p className="pt-6 text-right font-[var(--font-script)] text-2xl text-wax md:text-3xl">
            Selamanya milikmu,
            <br />
            Suamimu
            <br />
            <span className="text-lg text-ink/70 md:text-xl">dan jagoan kecil kita</span>{" "}
            <Heart className="inline h-5 w-5 fill-wax text-wax" />
          </p>
        </div>
      </motion.article>
    </section>
  );
}

/* ---------------------------- Photo Scatter ----------------------------- */

function PhotoScatter({ memories: items, onPhotoClick }: { memories: Memory[]; onPhotoClick: (m: Memory) => void }) {
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      {items.map((m, i) => (
        <motion.button
          key={i}
          onClick={() => onPhotoClick(m)}
          aria-label={`Buka memori: ${m.caption}`}
          className="pointer-events-auto absolute"
          style={{ top: m.top, left: m.left }}
          initial={{ opacity: 0, scale: 0.6, rotate: m.rotate * 2 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: m.rotate,
            y: [0, -8, 0],
          }}
          transition={{
            opacity: { delay: 1 + m.delay, duration: 0.8 },
            scale: { delay: 1 + m.delay, duration: 0.8 },
            rotate: { delay: 1 + m.delay, duration: 0.8 },
            y: { repeat: Infinity, duration: 5 + i * 0.6, ease: "easeInOut" },
          }}
          whileHover={{ scale: 1.08, rotate: 0, zIndex: 20 }}
        >
          <Polaroid src={m.src} caption={m.caption} />
        </motion.button>
      ))}
    </div>
  );
}

function Polaroid({ src, caption, large = false }: { src: any; caption: string; large?: boolean }) {
  return (
    <figure
      className={`bg-cream p-3 pb-12 ${large ? "w-72" : "w-44 lg:w-52"}`}
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <img
        src={getImgSrc(src)}
        alt={caption}
        loading="lazy"
        width={400}
        height={400}
        className={`block w-full object-cover ${large ? "h-72" : "h-44 lg:h-52"}`}
      />
      <figcaption className="absolute bottom-2 left-0 right-0 text-center font-[var(--font-hand)] text-base text-ink/80">
        {caption}
      </figcaption>
    </figure>
  );
}

/* --------------------------- Memory stream ------------------------------ */

function MemoryStream({ memories: items, onPhotoClick }: { memories: Memory[]; onPhotoClick: (m: Memory) => void }) {
  return (
    <section className="relative mx-auto max-w-5xl px-4 py-24">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1 }}
        className="text-center font-[var(--font-script)] text-4xl text-wax md:text-5xl"
      >
        Sebagian dari momen terindah kita
      </motion.h2>

      <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-3">
        {items.map((m, i) => (
          <motion.button
            key={i}
            onClick={() => onPhotoClick(m)}
            initial={{ opacity: 0, y: 40, rotate: m.rotate * 1.4 }}
            whileInView={{ opacity: 1, y: 0, rotate: m.rotate }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, delay: i * 0.08 }}
            whileHover={{ scale: 1.05, rotate: 0 }}
            className="relative mx-auto block"
          >
            <Polaroid src={m.src} caption={m.caption} large />
          </motion.button>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Lightbox -------------------------------- */

function Lightbox({ memory, onClose }: { memory: Memory; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-6 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={memory.caption}
    >
      <button
        aria-label="Tutup"
        className="absolute right-5 top-5 rounded-full bg-cream/90 p-2 text-ink shadow"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-cream p-4 pb-16 shadow-2xl"
      >
        <img
          src={getImgSrc(memory.src)}
          alt={memory.caption}
          className="max-h-[75vh] w-auto object-contain"
        />
        <p className="absolute bottom-4 left-0 right-0 text-center font-[var(--font-hand)] text-2xl text-ink/85">
          {memory.caption}
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ----------------------------- Final Surprise --------------------------- */

type Voucher = {
  id: number;
  title: string;
  shortDesc: string;
  longDesc: string;
  rules: string[];
  reward: string;
};

const initialVouchers: Voucher[] = [
  {
    id: 1,
    title: "Voucher Movie Night",
    shortDesc: "Nonton film pilihan Bunda sepuasnya ditemani camilan favorit.",
    longDesc: "Bunda berhak memilih film apa saja untuk ditonton bersama malam ini tanpa interupsi, dan Papa akan menyiapkan jajanan pendamping bioskop pilihan Bunda.",
    rules: [
      "Jagoan kecil harus sudah tidur nyenyak terlebih dahulu.",
      "Papa bertindak sebagai 'pelayan bioskop' pribadi (menyiapkan minuman & cemilan).",
      "Bebas pilih film genre apa saja (termasuk drakor/romance kesukaan Bunda)."
    ],
    reward: "Camilan & film ditanggung Papa",
  },
  {
    id: 2,
    title: "Voucher Mystery Date",
    shortDesc: "Kencan rahasia spesial yang direncanakan 100% oleh Papa.",
    longDesc: "Satu hari kencan penuh kejutan di mana destinasi kuliner, aktivitas, dan rute perjalanan sepenuhnya dirancang rahasia oleh Papa.",
    rules: [
      "Bunda tidak boleh bertanya ke mana tujuannya sampai tiba di lokasi.",
      "Klaim H-3 agar Papa memiliki waktu untuk mempersiapkan reservasi & rute.",
      "Dress code ditentukan oleh Papa demi keselarasan suasana kencan."
    ],
    reward: "Klaim H-3 sebelum pergi",
  },
  {
    id: 3,
    title: "Voucher Dream Day",
    shortDesc: "Satu hari penuh bebas tugas rumah tangga & mengasuh anak.",
    longDesc: "Satu hari istimewa di mana Bunda dibebaskan sepenuhnya dari rutinitas harian untuk me-time atau beristirahat. Papa akan mengambil alih seluruh tugas.",
    rules: [
      "Seluruh tugas domestik (masak, cuci piring, bersih-bersih) di-takeover Papa.",
      "Mengasuh & menemani bermain jagoan kecil sepenuhnya diurus Papa.",
      "Bunda berhak menolak segala permintaan bantuan domestik di hari itu."
    ],
    reward: "Klaim H-1 untuk persiapan Papa",
  },
];

function VoucherCard({
  voucher,
  isClaimed,
  onClickDetail,
}: {
  voucher: Voucher;
  isClaimed: boolean;
  onClickDetail: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClickDetail}
      className={`relative flex flex-col justify-between w-full max-w-sm rounded-2xl border border-amber-900/10 p-6 cursor-pointer ${
        isClaimed ? "bg-cream/40 opacity-75 select-none" : "bg-cream"
      } shadow-lg transition-all duration-300 overflow-hidden`}
    >
      {/* Decorative punched holes on left/right edges */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[rgba(235,190,140,0.85)] border-r border-amber-900/10 z-10" />
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[rgba(235,190,140,0.85)] border-l border-amber-900/10 z-10" />

      {/* Dashed line inside the card */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-dashed border-amber-900/20 z-0 pointer-events-none" />

      {/* Top half */}
      <div className="relative z-10 pb-6 flex flex-col justify-start text-left">
        <div className="flex items-center gap-2 text-wax">
          <Ticket className="h-5 w-5" />
          <span className="font-semibold text-xs tracking-wider uppercase">Gift Voucher</span>
        </div>
        <h3 className="mt-2 font-[var(--font-script)] text-2xl text-wax font-bold leading-tight">
          {voucher.title}
        </h3>
        <p className="mt-2 font-[var(--font-hand)] text-lg text-ink/80 leading-snug">
          {voucher.shortDesc}
        </p>
      </div>

      {/* Bottom half */}
      <div className="relative z-10 pt-6 flex items-center justify-between border-t border-amber-900/5">
        <span className="text-[11px] font-semibold tracking-wider text-ink/50 uppercase">
          {voucher.reward}
        </span>

        {isClaimed ? (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: -15 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-red-700/85 text-cream border border-red-900/30 shadow-md font-[var(--font-script)] text-sm font-bold uppercase tracking-wider"
            style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
          >
            Claimed
          </motion.div>
        ) : (
          <span className="px-4 py-1.5 rounded-full bg-wax text-cream font-[var(--font-hand)] text-base shadow hover:bg-wax/90 transition-colors z-20">
            Detail
          </span>
        )}
      </div>
    </motion.div>
  );
}

function VoucherModal({
  voucher,
  isClaimed,
  onClaim,
  onClose,
}: {
  voucher: Voucher;
  isClaimed: boolean;
  onClaim: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/75 p-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-cream border border-amber-900/10 rounded-2xl p-8 max-w-md w-full relative shadow-2xl overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -left-3 top-1/3 w-6 h-6 rounded-full bg-ink/75" />
        <div className="absolute -right-3 top-1/3 w-6 h-6 rounded-full bg-ink/75" />
        
        {/* Close Button */}
        <button
          aria-label="Tutup"
          className="absolute right-4 top-4 rounded-full bg-cream hover:bg-cream/80 p-2 text-ink/70 transition-colors shadow-sm cursor-pointer"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-wax mb-3">
          <Ticket className="h-5 w-5" />
          <span className="font-semibold text-xs tracking-wider uppercase">Voucher Detail</span>
        </div>

        <h3 className="font-[var(--font-script)] text-3xl text-wax font-bold leading-tight text-left">
          {voucher.title}
        </h3>

        <div className="mt-4 border-t border-amber-900/5 pt-4 text-left">
          <p className="font-[var(--font-hand)] text-xl text-ink/90 leading-relaxed">
            {voucher.longDesc}
          </p>
        </div>

        {/* Rules */}
        <div className="mt-6 text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-ink/50 mb-3">Aturan & Detail:</h4>
          <ul className="space-y-2">
            {voucher.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5 font-[var(--font-hand)] text-lg text-ink/80">
                <Heart className="h-4.5 w-4.5 fill-wax/20 text-wax shrink-0 mt-1" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Claim / Status Button */}
        <div className="mt-8 pt-6 border-t border-amber-900/5 flex flex-col items-center gap-2">
          {isClaimed ? (
            <div className="flex flex-col items-center gap-2">
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: -8 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-red-700 text-cream border border-red-900/30 shadow-md font-[var(--font-script)] text-base font-bold uppercase tracking-wider"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
              >
                Claimed
              </motion.div>
              <span className="text-xs font-medium text-ink/40">Voucher ini sudah terpakai</span>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                onClaim();
              }}
              className="w-full py-3 rounded-xl bg-wax text-cream font-[var(--font-hand)] text-xl shadow-md hover:bg-wax/90 transition-colors cursor-pointer"
            >
              Klaim Voucher Ini
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function FinalSurprise() {
  const [revealed, setRevealed] = useState(false);
  const [claimedVouchers, setClaimedVouchers] = useState<Record<number, boolean>>({});
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const handleClaim = (id: number) => {
    setClaimedVouchers((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="gift"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <p className="mb-8 text-center font-[var(--font-script)] text-3xl text-wax md:text-4xl">
              Satu kejutan terakhir
            </p>
            <motion.button
              onClick={() => setRevealed(true)}
              whileHover={{ scale: 1.08, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ y: { repeat: Infinity, duration: 2.4, ease: "easeInOut" } }}
              aria-label="Buka kado"
              className="relative inline-flex h-40 w-40 items-center justify-center rounded-md bg-gradient-to-br from-rose to-wax text-cream shadow-2xl md:h-52 md:w-52"
              style={{ boxShadow: "0 30px 60px -20px rgba(120,30,20,0.55)" }}
            >
              <div className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 bg-gold/90" />
              <div className="absolute left-1/2 inset-y-0 w-4 -translate-x-1/2 bg-gold/90" />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <div className="h-10 w-20 rounded-t-full bg-gold/90 shadow-md" />
              </div>
              <Gift className="relative z-10 h-12 w-12" />
            </motion.button>
            <p className="mt-6 text-sm tracking-[0.3em] text-ink/60 uppercase">Ketuk untuk membuka</p>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center"
          >
            <Fireworks />
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="font-[var(--font-script)] text-4xl text-wax md:text-6xl"
            >
              Kamu adalah anugerah terindah dalam hidup kami{" "}
              <Heart className="inline h-8 w-8 fill-wax text-wax" />
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-6 font-[var(--font-hand)] text-2xl text-ink/85 md:text-3xl"
            >
              Selamat Ulang Tahun, Bunda.
              <br />
              Selamat Ulang Tahun, Sayangku.
            </motion.p>
            <motion.figure
              initial={{ y: 40, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 1.2 }}
              className="mt-12 bg-cream p-4 pb-14 shadow-2xl relative"
              style={{ boxShadow: "var(--shadow-paper)" }}
            >
              <img
                src={getImgSrc(familyBig)}
                alt="Keluarga kita tercinta — bersama selamanya."
                loading="lazy"
                width={1600}
                height={1024}
                className="block w-full object-cover"
              />
              <figcaption className="absolute bottom-3 left-0 right-0 text-center font-[var(--font-hand)] text-xl text-ink/80">
                Seluruh dunia kita — bersama selamanya.
              </figcaption>
            </motion.figure>

            {/* Special Vouchers Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 1 }}
              className="mt-16 w-full flex flex-col items-center"
            >
              <h3 className="font-[var(--font-script)] text-3xl text-wax md:text-4xl mb-2">
                Kado Spesial Untuk Bunda
              </h3>
              <p className="font-[var(--font-hand)] text-lg text-ink/75 max-w-md mb-8">
                Tiga voucher istimewa yang bisa Bunda klaim dan gunakan kapan saja Bunda mau.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4 justify-items-center">
                {initialVouchers.map((voucher) => (
                  <VoucherCard
                    key={voucher.id}
                    voucher={voucher}
                    isClaimed={!!claimedVouchers[voucher.id]}
                    onClickDetail={() => setSelectedVoucher(voucher)}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voucher Modal */}
      <AnimatePresence>
        {selectedVoucher && (
          <VoucherModal
            voucher={selectedVoucher}
            isClaimed={!!claimedVouchers[selectedVoucher.id]}
            onClaim={() => handleClaim(selectedVoucher.id)}
            onClose={() => setSelectedVoucher(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ----------------------------- Particles -------------------------------- */

function FloatingParticles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 6 + Math.random() * 10,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 14,
        isHeart: Math.random() > 0.55,
      })),
    [],
  );

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-[5] overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-[-10vh]"
          style={{
            left: `${p.left}%`,
            animation: `${p.isHeart ? "heart-rise" : "float-particle"} ${p.duration}s linear ${p.delay}s infinite`,
          }}
        >
          {p.isHeart ? (
            <Heart
              className="fill-wax/60 text-wax/60"
              style={{ width: p.size, height: p.size }}
            />
          ) : (
            <span
              className="block rounded-full bg-gold/70"
              style={{
                width: p.size * 0.5,
                height: p.size * 0.5,
                boxShadow: "0 0 12px 2px rgba(220,180,120,0.6)",
              }}
            />
          )}
        </span>
      ))}
    </div>
  );
}

function Confetti() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.5 + Math.random() * 2,
        rotate: Math.random() * 360,
        color: ["#c9a84c", "#e85d3a", "#f7d6a8", "#a64a3a"][i % 4],
      })),
    [],
  );

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[80] h-[60vh] overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: -20, opacity: 1, rotate: p.rotate }}
          animate={{ y: "70vh", opacity: 0, rotate: p.rotate + 360 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
          className="absolute block h-2 w-3 rounded-sm"
          style={{ left: `${p.left}%`, backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

function Fireworks() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const bursts = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 40,
        delay: i * 0.4,
        color: ["#f5c469", "#e85d3a", "#f8a5b0", "#c9a84c", "#fff1c9"][i % 5],
      })),
    [],
  );

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
      {bursts.map((b) => (
        <div key={b.id} className="absolute" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
          {Array.from({ length: 14 }).map((_, j) => {
            const angle = (j / 14) * Math.PI * 2;
            return (
              <motion.span
                key={j}
                className="absolute block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: b.color, boxShadow: `0 0 8px ${b.color}` }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos(angle) * 120,
                  y: Math.sin(angle) * 120,
                  opacity: 0,
                }}
                transition={{ duration: 1.4, delay: b.delay, ease: "easeOut", repeat: Infinity, repeatDelay: 2 }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Silence unused-import warning for useScroll/useTransform if tree-shaken
void useScroll;
void useTransform;
