import { BookOpen } from 'lucide-react';
import Reveal from '../components/Reveal';
import Button from '../components/Button';

export default function TallerFique() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-32 pb-24">
      <Reveal>
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 rounded-full bg-moss/20 flex items-center justify-center mx-auto mb-8">
            <BookOpen size={36} className="text-penca" />
          </div>
          <h1 className="text-4xl md:text-5xl font-fraunces text-charcoal mb-4">
            Taller Fique
          </h1>
          <p className="text-charcoal/70 text-lg mb-8 font-light">
            Próximamente podrás explorar videos, diarios de artesanos y tutoriales
            de tintorería natural en una experiencia interactiva.
          </p>
          <Button to="/" variant="outline">
            Volver al inicio
          </Button>
        </div>
      </Reveal>
    </section>
  );
}