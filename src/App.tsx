import Hero from './components/Hero';
import Countdown from './components/Countdown';
import EventDetails from './components/EventDetails';
import Gallery from './components/Gallery';
import RSVP from './components/RSVP';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-full w-full">
      <Hero />
      <Countdown />
      <EventDetails />
      <Gallery />
      <RSVP />
      <Footer />
    </div>
  );
}
