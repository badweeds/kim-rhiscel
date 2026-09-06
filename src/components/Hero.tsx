import { ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1529636798458-92182e662485?w=1600&h=2400&fit=crop&auto=format)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
        <p
          className="font-serif text-sm font-light uppercase tracking-[0.3em] text-white/80"
          style={{ letterSpacing: '0.3em' }}
        >
          Together with their families
        </p>

        <h1
          className="font-display text-[5.5rem] leading-none text-white sm:text-[8rem]"
          style={{ fontFamily: 'Corinthia, cursive' }}
        >
          Rhiscel
          <br />
          <span className="text-[3rem] font-light italic sm:text-[4.5rem]" style={{ fontFamily: 'Lora, serif' }}>
            &amp;
          </span>
          <br />
          Kim
        </h1>

        <div className="h-px w-24 bg-white/40" />

        <p className="font-serif text-lg italic text-white/90">
          Tuesday, the twenty-seventh of October.
        </p>
        <p className="font-serif text-base text-white/75">Two Thousand and Twenty-Six</p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
        <a href="#countdown">
          <ChevronDown
            className="animate-bounce-slow text-white/70"
            size={32}
            strokeWidth={1.5}
          />
        </a>
      </div>
    </section>
  );
}
