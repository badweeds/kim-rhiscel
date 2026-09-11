import { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase";
import photo1 from "./photo/1.jpg";
import photo2 from "./photo/2.jpg";
import photo3 from "./photo/3.jpg";
import photo4 from "./photo/4.jpg";

// ── Botanical SVG accents ──────────────────────────────────────────────────

function LeafSprig({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 70 Q40 50 20 40 Q40 35 60 70Z" fill="#9ea595" opacity="0.35" />
      <path d="M60 70 Q80 50 100 40 Q80 35 60 70Z" fill="#9ea595" opacity="0.35" />
      <path d="M60 70 Q45 42 35 20 Q55 30 60 70Z" fill="#9ea595" opacity="0.25" />
      <path d="M60 70 Q75 42 85 20 Q65 30 60 70Z" fill="#9ea595" opacity="0.25" />
      <line x1="60" y1="70" x2="60" y2="15" stroke="#9ea595" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}

function CornerLeaves({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const transforms: Record<string, string> = {
    tl: "rotate(135deg)",
    tr: "rotate(225deg) scaleX(-1)",
    bl: "rotate(45deg)",
    br: "rotate(-45deg) scaleX(-1)",
  };
  const corners: Record<string, string> = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  };
  return (
    <svg
      className={`absolute ${corners[position]} w-36 h-36 pointer-events-none select-none`}
      style={{ transform: transforms[position], opacity: 0.18 }}
      viewBox="0 0 150 150"
      fill="none"
    >
      <path d="M10 140 Q30 80 90 50 Q60 100 10 140Z" fill="#9ea595" />
      <path d="M10 140 Q70 90 120 30 Q80 90 10 140Z" fill="#9ea595" opacity="0.7" />
      <path d="M10 140 Q50 100 80 20 Q55 80 10 140Z" fill="#7a8c72" opacity="0.5" />
      <path d="M10 140 Q20 100 10 50" stroke="#9ea595" strokeWidth="1.5" opacity="0.7" />
      <path d="M10 140 Q40 110 100 80" stroke="#9ea595" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

// ── Countdown timer ────────────────────────────────────────────────────────

function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        style={{ fontFamily: "var(--font-serif)", color: "#6b5b4e", fontSize: "2.5rem", lineHeight: 1 }}
        className="font-semibold"
      >
        {String(value).padStart(2, "0")}
      </span>
      <span style={{ fontFamily: "var(--font-sans)", color: "#9ea595", fontSize: "0.65rem", letterSpacing: "0.18em" }} className="uppercase">
        {label}
      </span>
    </div>
  );
}

// ── October 2026 Mini Calendar ─────────────────────────────────────────────

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const OCT_2026_START = 4; // Thursday = index 4
const OCT_DAYS = 31;
const HIGHLIGHTED = 27;

function MiniCalendar() {
  const cells: (number | null)[] = [];
  for (let i = 0; i < OCT_2026_START; i++) cells.push(null);
  for (let d = 1; d <= OCT_DAYS; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: "1rem", border: "1px solid #c8d4c0" }} className="p-5 w-full max-w-xs mx-auto">
      <p style={{ fontFamily: "var(--font-sans)", color: "#9ea595", fontSize: "0.65rem", letterSpacing: "0.2em" }} className="uppercase text-center mb-3">
        October 2026
      </p>
      <div className="grid grid-cols-7 gap-y-1">
        {DAYS.map((d) => (
          <div key={d} style={{ fontFamily: "var(--font-sans)", color: "#a08c7e", fontSize: "0.65rem", letterSpacing: "0.1em" }} className="text-center uppercase py-1">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          const isHighlight = day === HIGHLIGHTED;
          return (
            <div
              key={i}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.8rem",
                borderRadius: "50%",
                width: "2rem",
                height: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                background: isHighlight ? "#9ea595" : "transparent",
                color: isHighlight ? "#fefcf8" : day ? "#6b5b4e" : "transparent",
                fontWeight: isHighlight ? 600 : 400,
              }}
            >
              {day ?? ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Add to Calendar ────────────────────────────────────────────────────────

function AddToCalendar() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const googleUrl =
    "https://www.google.com/calendar/render?action=TEMPLATE&text=Kim+%26+Rhiscel+Wedding&dates=20261027T003000Z/20261027T060000Z&details=Wedding+Ceremony+%26+Reception&location=St.+Francis+of+Assisi+Parish+Church,+La+Verna+Hills,+Davao+City";

  const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:20261027T003000Z\nDTEND:20261027T060000Z\nSUMMARY:Kim & Rhiscel Wedding\nDESCRIPTION:Wedding Ceremony & Reception\nLOCATION:St. Francis of Assisi Parish Church, La Verna Hills\nEND:VEVENT\nEND:VCALENDAR`;

  const downloadIcs = () => {
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kim-rhiscel-wedding.ics";
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.75rem",
          letterSpacing: "0.18em",
          color: "#9ea595",
          border: "1.5px solid #9ea595",
          borderRadius: "2rem",
          padding: "0.6rem 1.6rem",
          background: "transparent",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.background = "#9ea595";
          (e.target as HTMLButtonElement).style.color = "#fefcf8";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.background = "transparent";
          (e.target as HTMLButtonElement).style.color = "#9ea595";
        }}
      >
        ADD TO CALENDAR
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fefcf8",
            border: "1px solid #c8d4c0",
            borderRadius: "0.75rem",
            boxShadow: "0 8px 24px rgba(107,91,78,0.12)",
            zIndex: 50,
            minWidth: "200px",
            overflow: "hidden",
          }}
        >
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "#6b5b4e", display: "block", padding: "0.85rem 1.25rem", textDecoration: "none" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "#f0ede7")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "transparent")}
          >
            📅 Google Calendar
          </a>
          <div style={{ height: "1px", background: "#e8e0d8" }} />
          <button
            onClick={downloadIcs}
            style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "#6b5b4e", display: "block", padding: "0.85rem 1.25rem", background: "transparent", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = "#f0ede7")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = "transparent")}
          >
            🍎 Apple Calendar (.ics)
          </button>
        </div>
      )}
    </div>
  );
}

// ── OS-aware map URL ──────────────────────────────────────────────────────

function getMapUrl(googleUrl: string, appleUrl: string): string {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as Record<string, unknown>).MSStream;
  return isIOS ? appleUrl : googleUrl;
}

// ── Map Pin Icon ───────────────────────────────────────────────────────────

function MapPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// ── Venue Card ─────────────────────────────────────────────────────────────

function VenueCard({
  title,
  time,
  venue,
  address,
  googleMapUrl,
  appleMapUrl,
}: {
  title: string;
  time: string;
  venue: string;
  address: string;
  googleMapUrl: string;
  appleMapUrl: string;
}) {
  const mapUrl = getMapUrl(googleMapUrl, appleMapUrl);
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.55)",
        border: "1px solid #c8d4c0",
        borderRadius: "1.25rem",
        padding: "1.75rem",
        backdropFilter: "blur(4px)",
        boxShadow: "0 4px 20px rgba(107,91,78,0.06)",
      }}
    >
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#9ea595" }} className="uppercase mb-2">
        {title}
      </p>
      <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "#6b5b4e" }} className="mb-3">
        {time}
      </p>
      <p style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", color: "#6b5b4e", fontStyle: "italic" }} className="mb-1">
        {venue}
      </p>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "#a08c7e", lineHeight: 1.5 }} className="mb-4">
        {address}
      </p>
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.7rem",
          letterSpacing: "0.15em",
          color: "#9ea595",
          border: "1.5px solid #9ea595",
          borderRadius: "2rem",
          padding: "0.5rem 1.2rem",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35rem",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.background = "#9ea595";
          el.style.color = "#fefcf8";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.background = "transparent";
          el.style.color = "#9ea595";
        }}
      >
        <MapPin /> VIEW ON MAP
      </a>
    </div>
  );
}

// ── Music Button ───────────────────────────────────────────────────────────

function MusicButton({ playing, togglePlay }: { playing: boolean; togglePlay: () => void }) {
  return (
    <button
      onClick={togglePlay}
      title={playing ? "Pause music" : "Play music"}
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 100,
        width: "3.25rem",
        height: "3.25rem",
        borderRadius: "50%",
        background: "#9ea595",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(107,91,78,0.25)",
        transition: "transform 0.2s, box-shadow 0.2s",
        color: "#fefcf8",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(107,91,78,0.3)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(107,91,78,0.25)";
      }}
    >
      {playing ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5,3 19,12 5,21" />
        </svg>
      )}
    </button>
  );
}

// ── Section heading ────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 mb-10">
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", letterSpacing: "0.28em", color: "#9ea595" }} className="uppercase">
        {children}
      </p>
      <div style={{ width: "3rem", height: "1px", background: "#9ea595", opacity: 0.5 }} />
    </div>
  );
}

// ── Divider ────────────────────────────────────────────────────────────────

function Divider() {
  return <div style={{ width: "100%", height: "1px", background: "linear-gradient(to right, transparent, #9ea595 30%, #9ea595 70%, transparent)", opacity: 0.3, margin: "0 auto" }} />;
}

// ── Guestbook ─────────────────────────────────────────────────────────────

function Guestbook() {
  const [name, setName] = useState("");
  const [wish, setWish] = useState("");
  const [wishes, setWishes] = useState<{ id: string; name: string; wish: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWishes();
  }, []);

  const loadWishes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("guestbook")
      .select("id, name, wish, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load wishes:", error);
      setError("Unable to load wishes right now.");
    } else {
      setWishes(data || []);
    }
    setLoading(false);
  };

  const submit = async () => {
    const cleanName = name.trim();
    const cleanWish = wish.trim();

    if (!cleanName || !cleanWish) {
      setError("Please enter your name and wishes.");
      return;
    }

    if (cleanName.length > 100) {
      setError("Your name is too long.");
      return;
    }

    if (cleanWish.length > 1000) {
      setError("Your wishes are too long.");
      return;
    }

    setSubmitting(true);
    setError("");

    const { data, error } = await supabase
      .from("guestbook")
      .insert({ name: cleanName, wish: cleanWish })
      .select("id, name, wish, created_at")
      .single();

    if (error) {
      console.error("Failed to submit wish:", error);
      setError("Something went wrong. Please try again.");
    } else if (data) {
      setWishes((prev) => [data, ...prev]);
      setName("");
      setWish("");
    }

    setSubmitting(false);
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.55)", border: "1px solid #c8d4c0", borderRadius: "1.5rem", boxShadow: "0 8px 32px rgba(107,91,78,0.08)", padding: "2rem", maxWidth: "36rem", width: "100%", margin: "0 auto" }}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        maxLength={100}
        style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#6b5b4e", background: "rgba(254,252,248,0.8)", border: "1px solid #c8d4c0", borderRadius: "0.75rem", padding: "0.75rem 1rem", width: "100%", outline: "none", marginBottom: "0.85rem", boxSizing: "border-box" }}
      />

      <textarea
        value={wish}
        onChange={(e) => setWish(e.target.value)}
        placeholder="Enter your wishes*"
        rows={4}
        maxLength={1000}
        style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#6b5b4e", background: "rgba(254,252,248,0.8)", border: "1px solid #c8d4c0", borderRadius: "0.75rem", padding: "0.75rem 1rem", width: "100%", outline: "none", resize: "none", marginBottom: "1rem", boxSizing: "border-box" }}
      />

      <button
        onClick={submit}
        disabled={submitting}
        style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.18em", color: "#fefcf8", background: submitting ? "#b8beb0" : "#9ea595", border: "none", borderRadius: "2rem", padding: "0.75rem 2rem", cursor: submitting ? "not-allowed" : "pointer", width: "100%", transition: "background 0.2s" }}
      >
        {submitting ? "SENDING..." : "SEND WISHES"}
      </button>

      {error && (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#a06f65", textAlign: "center", marginTop: "1rem" }}>
          {error}
        </p>
      )}

      <div className="mt-5">
        {loading ? (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "#a08c7e", textAlign: "center" }}>
            Loading wishes...
          </p>
        ) : wishes.length === 0 ? (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.78rem", color: "#a08c7e", textAlign: "center" }}>
            No wishes yet. Be the first!
          </p>
        ) : (
          wishes.map((w, i) => (
            <div key={w.id} style={{ borderTop: i > 0 ? "1px solid #e8e0d8" : "none", paddingTop: i > 0 ? "0.85rem" : "0", marginTop: i > 0 ? "0.85rem" : "0" }}>
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.85rem", color: "#6b5b4e", fontStyle: "italic" }}>
                &ldquo;{w.wish}&rdquo;
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", color: "#9ea595", marginTop: "0.3rem" }}>
                — {w.name}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────

export default function App() {
  const weddingDate = new Date("2026-10-27T08:30:00+08:00");
  const countdown = useCountdown(weddingDate);

    // Audio & Entry State
  const [hasEntered, setHasEntered] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Gallery Lightbox State
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handleEnter = async () => {
    setHasEntered(true);
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.volume = 0.7;
      await audio.play();
      setPlaying(true);
    } catch (error) {
      console.error("MUSIC PLAY ERROR:", error);
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch (error) {
        console.error("MUSIC PLAY ERROR:", error);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const photos = [
    {
      url: photo1,
      alt: "Bride and groom embracing in doorway",
    },
    {
      url: photo2,
      alt: "Couple embracing under chandelier in garden",
    },
    {
      url: photo3,
      alt: "Couple embracing romantically outdoors",
    },
    {
      url: photo4,
      alt: "Couple in formal attire holding hands outdoors",
    },
  ];

  const nextPhoto = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % photos.length);
    }
  };

  const prevPhoto = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + photos.length) % photos.length);
    }
  };

  // Basic touch swipe logic for Lightbox
  let touchStartX = 0;
  const onTouchStart = (e: React.TouchEvent) => { touchStartX = e.changedTouches[0].screenX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) nextPhoto();
    if (touchEndX > touchStartX + 50) prevPhoto();
  };

  const dressCodes = [
    { name: "Sage Green", hex: "#9ea595" },
    { name: "Dusty Blue", hex: "#b0c1c8" },
    { name: "Champagne", hex: "#f7e7a9" },
    { name: "Dusty Rose", hex: "#e6bdb9" },
    { name: "Blush", hex: "#ead5d4" },
  ];

  return (
    <div style={{ background: "#fefcf8", minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      
      {/* ── ENTRY OVERLAY WITH 3D TRANSITION ── */}
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#fefcf8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 1.2s cubic-bezier(0.77, 0, 0.175, 1), opacity 1.2s ease-in-out",
        transform: hasEntered ? "perspective(1000px) translateZ(-200px) rotateX(45deg)" : "perspective(1000px) translateZ(0) rotateX(0deg)",
        opacity: hasEntered ? 0 : 1,
        pointerEvents: hasEntered ? "none" : "auto",
        transformOrigin: "center center",
      }}>
        <CornerLeaves position="tl" />
        <CornerLeaves position="br" />
        
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.35em", color: "#9ea595", marginBottom: "1.5rem" }} className="uppercase">
          You are invited
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 8vw, 4rem)", color: "#6b5b4e", marginBottom: "2rem", textAlign: "center" }}>
          Kim &amp; Rhiscel
        </h1>
        
        <button 
          onClick={handleEnter}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.8rem",
            letterSpacing: "0.2em",
            color: "#fefcf8",
            background: "#9ea595",
            border: "none",
            borderRadius: "2rem",
            padding: "1rem 2.5rem",
            cursor: "pointer",
            transition: "transform 0.3s, background 0.3s",
            boxShadow: "0 4px 15px rgba(158, 165, 149, 0.4)"
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#7a8c72")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#9ea595")}
        >
          OPEN INVITATION
        </button>
      </div>

      {/* ── PHOTO LIGHTBOX OVERLAY ── */}
      {selectedPhotoIndex !== null && (
        <div 
          style={{
            position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.9)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button 
            onClick={() => setSelectedPhotoIndex(null)}
            style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "transparent", border: "none", color: "white", fontSize: "2rem", cursor: "pointer", zIndex: 10001 }}
          >
            &times;
          </button>
          
          <button onClick={prevPhoto} style={{ position: "absolute", left: "1rem", background: "transparent", border: "none", color: "white", fontSize: "3rem", cursor: "pointer", padding: "1rem" }}>&#8249;</button>
          
          <img 
            src={photos[selectedPhotoIndex].url} 
            alt={photos[selectedPhotoIndex].alt} 
            style={{ maxHeight: "85vh", maxWidth: "90vw", objectFit: "contain", borderRadius: "0.5rem", userSelect: "none" }} 
          />
          
          <button onClick={nextPhoto} style={{ position: "absolute", right: "1rem", background: "transparent", border: "none", color: "white", fontSize: "3rem", cursor: "pointer", padding: "1rem" }}>&#8250;</button>
        </div>
      )}

      {/* Music button is only mounted/shown once they enter */}
      {hasEntered && <MusicButton playing={playing} togglePlay={togglePlay} />}

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6rem 1.5rem 4rem", overflow: "hidden" }}>
        <CornerLeaves position="tl" />
        <CornerLeaves position="tr" />
        <CornerLeaves position="bl" />
        <CornerLeaves position="br" />

        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.35em", color: "#9ea595", marginBottom: "2.5rem" }} className="uppercase">
          The Wedding of
        </p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(3rem, 12vw, 7rem)", fontWeight: 400, color: "#6b5b4e", lineHeight: 1.05, margin: 0 }}>
            Kim Rapliza
          </h1>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 10vw, 5.5rem)", fontWeight: 400, color: "#9ea595", fontStyle: "italic", lineHeight: 1 }}>
            &amp;
          </span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(3rem, 12vw, 7rem)", fontWeight: 400, color: "#6b5b4e", lineHeight: 1.05, margin: 0 }}>
            Rhiscel Cereligia
          </h1>
        </div>

        <div style={{ width: "3rem", height: "1px", background: "#9ea595", opacity: 0.5, margin: "2.5rem auto 1.5rem" }} />
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", letterSpacing: "0.22em", color: "#a08c7e" }} className="uppercase">
          October 27, 2026
        </p>
      </section>

      <Divider />

      {/* ── FAMILY ANNOUNCEMENT ───────────────────────────────────────── */}
      <section style={{ padding: "5rem 1.5rem", maxWidth: "52rem", margin: "0 auto", textAlign: "center" }}>
        <SectionHeading>We joyfully announce the wedding of our children</SectionHeading>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "1.5rem", alignItems: "center" }}>
          {/* Groom */}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.1rem, 4vw, 1.5rem)", fontWeight: 500, color: "#6b5b4e" }}>Kim Rapliza</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#9ea595", margin: "0.35rem 0 1rem" }} className="uppercase">Groom</p>
            <div style={{ height: "1px", background: "#e8ddd5", margin: "0 auto 0.85rem", width: "2.5rem" }} />
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "#a08c7e", lineHeight: 1.6 }}>
              Son of<br />
              <span style={{ color: "#6b5b4e" }}>Gerry Rapliza</span><br />
              <span style={{ color: "#9ea595" }}>&amp;</span>{" "}
              <span style={{ color: "#6b5b4e" }}>Rosalina Rapliza</span>
            </p>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "1px", height: "4rem", background: "#c8d4c0", opacity: 0.6 }} />
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", color: "#9ea595", fontStyle: "italic" }}>&amp;</span>
            <div style={{ width: "1px", height: "4rem", background: "#c8d4c0", opacity: 0.6 }} />
          </div>

          {/* Bride */}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.1rem, 4vw, 1.5rem)", fontWeight: 500, color: "#6b5b4e" }}>Rhiscel Cereligia</p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#9ea595", margin: "0.35rem 0 1rem" }} className="uppercase">Bride</p>
            <div style={{ height: "1px", background: "#e8ddd5", margin: "0 auto 0.85rem", width: "2.5rem" }} />
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "#a08c7e", lineHeight: 1.6 }}>
              Daughter of<br />
              <span style={{ color: "#6b5b4e" }}>Alfredo Cereligia</span><br />
              <span style={{ color: "#9ea595" }}>&amp;</span>{" "}
              <span style={{ color: "#6b5b4e" }}>Jessica Cereligia</span>
            </p>
          </div>
        </div>
      </section>

      <Divider />

      {/* ── PHOTO GALLERY (CLICKABLE) ─────────────────────────────────── */}
      <section style={{ padding: "5rem 1.5rem", maxWidth: "60rem", margin: "0 auto" }}>
        <SectionHeading>Photo Gallery</SectionHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gridTemplateRows: "auto auto", gap: "1rem" }}>
          
          <div onClick={() => setSelectedPhotoIndex(0)} style={{ cursor: "pointer", gridRow: "1 / 3", borderRadius: "1.25rem", overflow: "hidden", background: "#e8ddd5", aspectRatio: "3/4" }}>
            <img src={photos[0].url} alt={photos[0].alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s" }} onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} />
          </div>
          
          <div onClick={() => setSelectedPhotoIndex(1)} style={{ cursor: "pointer", borderRadius: "1.25rem", overflow: "hidden", background: "#e8ddd5", aspectRatio: "4/3" }}>
  <img 
    src={photos[1].url} 
    alt={photos[1].alt} 
    style={{ 
      width: "100%", 
      height: "100%", 
      objectFit: "cover", 
      objectPosition: "50% 20%", // <-- THIS IS THE MAGIC FIX
      display: "block", 
      transition: "transform 0.3s" 
    }} 
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} 
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} 
  />
</div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div onClick={() => setSelectedPhotoIndex(2)} style={{ cursor: "pointer", borderRadius: "1.25rem", overflow: "hidden", background: "#e8ddd5", aspectRatio: "1" }}>
              <img src={photos[2].url} alt={photos[2].alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s" }} onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} />
            </div>
            <div onClick={() => setSelectedPhotoIndex(3)} style={{ cursor: "pointer", borderRadius: "1.25rem", overflow: "hidden", background: "#e8ddd5", aspectRatio: "1" }}>
              <img src={photos[3].url} alt={photos[3].alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s" }} onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} />
            </div>
          </div>

        </div>
      </section>

      <Divider />

      {/* ── DATE, COUNTDOWN & CALENDAR ────────────────────────────────── */}
      <section style={{ padding: "5rem 1.5rem", maxWidth: "42rem", margin: "0 auto", textAlign: "center" }}>
        <SectionHeading>Event Info</SectionHeading>
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.75rem, 6vw, 3rem)", fontWeight: 400, color: "#6b5b4e", letterSpacing: "0.05em" }}>
            Tuesday · 27 · October 2026
          </p>
        </div>
        <MiniCalendar />
        <div style={{ margin: "2rem auto" }}>
          <AddToCalendar />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0", background: "rgba(255,255,255,0.5)", border: "1px solid #c8d4c0", borderRadius: "1.25rem", padding: "1.75rem 1rem", marginTop: "2rem" }}>
          <CountdownUnit value={countdown.days} label="Days" />
          <CountdownUnit value={countdown.hours} label="Hours" />
          <CountdownUnit value={countdown.minutes} label="Minutes" />
          <CountdownUnit value={countdown.seconds} label="Seconds" />
        </div>
      </section>

      <Divider />

      {/* ── VENUE, SCHEDULE & DRESS CODE ──────────────────────────────── */}
      <section style={{ padding: "5rem 1.5rem", maxWidth: "52rem", margin: "0 auto" }}>
        <SectionHeading>When &amp; Where</SectionHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "3.5rem" }}>
          <VenueCard title="Ceremony" time="08:30 AM — 10:00 AM" venue="St. Francis of Assisi Parish Church La Verna Hills" address="San Marcelino St, La Verna Hills, Davao City, Davao del Sur" googleMapUrl="https://maps.app.goo.gl/2ZiFLRbmafncRoD47" appleMapUrl="https://maps.apple/r/66AVp2TNjRXVMg" />
          <VenueCard title="Reception" time="11:00 AM — 2:00 PM" venue="Y&J Events & Catering" address="Margarita St, Bajada, Davao City, Davao del Sur" googleMapUrl="https://maps.app.goo.gl/gdaxcZrvYWckdBe59" appleMapUrl="https://maps.apple/p/jFn.Hk~yVYD~fH" />
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", letterSpacing: "0.25em", color: "#9ea595", marginBottom: "1.5rem" }} className="uppercase">
            Dress Code: Party Attire
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            {dressCodes.map((dc) => (
              <div key={dc.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.65rem" }}>
                <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: dc.hex, boxShadow: "0 2px 8px rgba(107,91,78,0.15)", border: "2px solid rgba(255,255,255,0.7)" }} />
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.65rem", color: "#a08c7e", textAlign: "center", lineHeight: 1.3 }}>{dc.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ── GUESTBOOK ─────────────────────────────────────────────────── */}
      <section style={{ padding: "5rem 1.5rem", maxWidth: "44rem", margin: "0 auto" }}>
        <SectionHeading>Guestbook</SectionHeading>
        <Guestbook />
      </section>

      <Divider />

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer style={{ padding: "3rem 1.5rem 2rem", textAlign: "center" }}>
        <div style={{ margin: "0 auto 1.5rem", opacity: 0.3 }}>
          <LeafSprig className="w-20 h-14 mx-auto" />
        </div>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "#6b5b4e", marginBottom: "0.5rem" }}>
          Kim &amp; Rhiscel
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.58rem", letterSpacing: "0.25em", color: "#9ea595" }} className="uppercase">
          October 27, 2026 · Forever
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.62rem", color: "#c4b5a8", marginTop: "2rem", letterSpacing: "0.08em" }}>
          © 2026 · badweeds
        </p>
      </footer>
    </div>
  );
}