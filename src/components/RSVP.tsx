import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function RSVP() {
  const [form, setForm] = useState({
    name: '',
    guests: '1',
    attending: 'accept',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="rsvp" className="bg-[#faf6f0] px-6 py-20">
      <div className="mx-auto max-w-lg">
        <div className="text-center">
          <p className="font-serif text-sm uppercase tracking-[0.25em] text-[#7a9e7e]">
            You're invited
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-[#2c2c2c] sm:text-4xl">
            RSVP
          </h2>
          <div className="mt-3 h-px w-12 bg-[#e8b4b8] mx-auto" />
          <p className="mt-4 text-sm text-[#6b6b6b]">
            Kindly respond by September 30, 2026
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-[#c9dbc9] bg-white/80 p-8 shadow-lg backdrop-blur-sm">
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <CheckCircle2 size={48} className="text-[#7a9e7e]" strokeWidth={1.5} />
              <h3 className="font-serif text-2xl text-[#2c2c2c]">
                {form.attending === 'accept' ? "We'll see you there!" : "We'll miss you."}
              </h3>
              <p className="text-sm text-[#6b6b6b]">
                {form.attending === 'accept'
                  ? `Thank you, ${form.name}! We can't wait to celebrate with you.`
                  : `Thank you for letting us know, ${form.name}. You'll be in our hearts.`}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-widest text-[#7a9e7e]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-xl border border-[#c9dbc9] bg-[#faf6f0] px-4 py-3 text-sm text-[#2c2c2c] placeholder-[#b0b0b0] outline-none transition focus:border-[#7a9e7e] focus:ring-2 focus:ring-[#7a9e7e]/20"
                />
              </div>

              {/* Guests */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-widest text-[#7a9e7e]">
                  Number of Guests
                </label>
                <select
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  className="rounded-xl border border-[#c9dbc9] bg-[#faf6f0] px-4 py-3 text-sm text-[#2c2c2c] outline-none transition focus:border-[#7a9e7e] focus:ring-2 focus:ring-[#7a9e7e]/20 appearance-none"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Attending */}
              <div className="flex flex-col gap-3">
                <span className="text-xs uppercase tracking-widest text-[#7a9e7e]">
                  Will you attend?
                </span>
                {[
                  { value: 'accept', label: 'Joyfully Accept' },
                  { value: 'decline', label: 'Regretfully Decline' },
                ].map(({ value, label }) => (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                      form.attending === value
                        ? 'border-[#7a9e7e] bg-[#e8f0e8]'
                        : 'border-[#c9dbc9] bg-transparent'
                    }`}
                  >
                    <input
                      type="radio"
                      name="attending"
                      value={value}
                      checked={form.attending === value}
                      onChange={(e) => setForm({ ...form, attending: e.target.value })}
                      className="accent-[#7a9e7e]"
                    />
                    <span className="text-sm text-[#2c2c2c]">{label}</span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="mt-2 rounded-xl bg-[#4f7052] py-4 text-sm font-medium uppercase tracking-widest text-white shadow-md transition hover:bg-[#3d5a40] active:scale-[0.98]"
              >
                Confirm RSVP
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
