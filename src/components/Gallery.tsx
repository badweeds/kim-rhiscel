import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

const PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1627964464837-6328f5931576?w=800&h=1000&fit=crop&auto=format',
    alt: 'Couple laughing on the beach',
  },
  {
    url: 'https://images.unsplash.com/photo-1600038937815-57cbbba6ba7d?w=800&h=1000&fit=crop&auto=format',
    alt: 'Couple in formal attire sharing a kiss',
  },
  {
    url: 'https://images.unsplash.com/photo-1672184702625-71ddc099768e?w=800&h=1000&fit=crop&auto=format',
    alt: 'Couple seated on a rock together',
  },
  {
    url: 'https://images.unsplash.com/photo-1619439822797-e0b6e7022373?w=800&h=1000&fit=crop&auto=format',
    alt: 'Couple in a floral garden',
  },
];

export default function Gallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  return (
    <section
      id="gallery"
      className="px-6 py-20"
      style={{ background: 'linear-gradient(160deg, #e8f0e8 0%, #f5f0e8 100%)' }}
    >
      <div className="mx-auto max-w-lg">
        <div className="text-center">
          <p className="font-serif text-sm uppercase tracking-[0.25em] text-[#7a9e7e]">
            Our story
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-[#2c2c2c] sm:text-4xl">
            Photo Gallery
          </h2>
          <div className="mt-3 h-px w-12 bg-[#e8b4b8] mx-auto" />
        </div>

        <div className="mt-10">
          <div className="embla overflow-hidden rounded-3xl shadow-lg" ref={emblaRef}>
            <div className="embla__container flex">
              {PHOTOS.map((photo) => (
                <div key={photo.url} className="embla__slide relative">
                  <div className="aspect-[4/5] w-full bg-[#c9dbc9]">
                    <img
                      src={photo.url}
                      alt={photo.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex
                    ? 'w-6 bg-[#7a9e7e]'
                    : 'w-1.5 bg-[#c9dbc9]'
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
