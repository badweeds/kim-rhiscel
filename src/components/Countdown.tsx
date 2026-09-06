import { useEffect, useState } from 'react';

const TARGET = new Date('2026-12-31T17:00:00');

function getTimeLeft() {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-[#c9dbc9] bg-white/70 px-4 py-6 shadow-sm backdrop-blur-sm">
      <span className="font-serif text-4xl font-semibold text-[#4f7052] sm:text-5xl">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs uppercase tracking-widest text-[#7a9e7e]">{label}</span>
    </div>
  );
}

export default function Countdown() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="countdown"
      className="bg-[#f0ede6] px-6 py-20"
      style={{ background: 'linear-gradient(160deg, #f5f0e8 0%, #e8f0e8 100%)' }}
    >
      <div className="mx-auto max-w-lg text-center">
        <p className="font-serif text-sm uppercase tracking-[0.25em] text-[#7a9e7e]">
          Counting down to forever
        </p>
        <h2 className="mt-3 font-serif text-3xl font-medium text-[#2c2c2c] sm:text-4xl">
          The Big Day
        </h2>
        <div className="mt-3 h-px w-12 bg-[#e8b4b8] mx-auto" />

        <div className="mt-10 grid grid-cols-4 gap-3">
          <Unit value={time.days} label="Days" />
          <Unit value={time.hours} label="Hours" />
          <Unit value={time.minutes} label="Mins" />
          <Unit value={time.seconds} label="Secs" />
        </div>
      </div>
    </section>
  );
}
