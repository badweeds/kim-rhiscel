import { Clock, MapPin } from 'lucide-react';

interface EventCardProps {
  type: string;
  time: string;
  venue: string;
  address: string;
  mapUrl: string;
}

function EventCard({ type, time, venue, address, mapUrl }: EventCardProps) {
  return (
    <div className="rounded-3xl border border-[#c9dbc9] bg-white/80 p-8 shadow-md backdrop-blur-sm">
      <p className="font-serif text-xs uppercase tracking-[0.3em] text-[#7a9e7e]">{type}</p>
      <h3 className="mt-2 font-serif text-2xl font-semibold text-[#2c2c2c]">{venue}</h3>
      <div className="mt-1 h-px w-8 bg-[#e8b4b8]" />

      <div className="mt-5 flex items-center gap-2 text-[#6b6b6b]">
        <Clock size={15} strokeWidth={1.5} className="shrink-0 text-[#7a9e7e]" />
        <span className="text-sm">{time}</span>
      </div>

      <div className="mt-2 flex items-start gap-2 text-[#6b6b6b]">
        <MapPin size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-[#7a9e7e]" />
        <span className="text-sm leading-relaxed">{address}</span>
      </div>

      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#7a9e7e] px-5 py-2.5 text-sm text-[#4f7052] transition-colors hover:bg-[#7a9e7e] hover:text-white"
      >
        <MapPin size={14} strokeWidth={1.5} />
        View on Map
      </a>
    </div>
  );
}

export default function EventDetails() {
  return (
    <section id="details" className="bg-[#faf6f0] px-6 py-20">
      <div className="mx-auto max-w-lg">
        <div className="text-center">
          <p className="font-serif text-sm uppercase tracking-[0.25em] text-[#7a9e7e]">
            Join us
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-[#2c2c2c] sm:text-4xl">
            Event Details
          </h2>
          <div className="mt-3 h-px w-12 bg-[#e8b4b8] mx-auto" />
        </div>

        <div className="mt-12 flex flex-col gap-6">
          <EventCard
            type="Ceremony"
            time="11:00 AM — 2:00 PM"
            venue="St Francis of Assisi Parish Church La Verna Hills"
            address="San Marcelino St, La Verna Hills, Davao City, Davao del Sur"
            mapUrl="https://maps.app.goo.gl/2ZiFLRbmafncRoD47"
          />
          <EventCard
            type="Reception"
            time="8:30 AM — 10:00 AM"
            venue="Y&J Events & Catering"
            address="Margarita St, Bajada, Davao City, Davao del Sur"
            mapUrl="https://maps.app.goo.gl/gdaxcZrvYWckdBe59"
          />
        </div>
      </div>
    </section>
  );
}
