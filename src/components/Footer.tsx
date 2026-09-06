import { Gift } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="px-6 py-16 text-center"
      style={{ background: 'linear-gradient(160deg, #e8f0e8 0%, #d4e4d4 100%)' }}
    >
      <div className="mx-auto max-w-sm">
        <p
          className="font-display text-5xl text-[#4f7052]"
          style={{ fontFamily: 'Corinthia, cursive' }}
        >
          Rhiscel & Kim
        </p>
        <div className="mt-4 h-px w-16 bg-[#e8b4b8] mx-auto" />
        <p className="mt-5 font-serif text-lg italic text-[#2c2c2c]">
          "We can't wait to celebrate with you!"
        </p>
        <p className="mt-2 text-sm text-[#6b6b6b]">September 27, 2026 · Davao City, PH</p>

        <a
          href="#"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#7a9e7e] px-6 py-2.5 text-sm text-[#4f7052] transition hover:bg-[#7a9e7e] hover:text-white"
        >
          <Gift size={14} strokeWidth={1.5} />
          View Gift Registry
        </a>

        <p className="mt-10 text-xs text-[#a0a0a0]">
          © 2026 · badweeds
        </p>
      </div>
    </footer>
  );
}
