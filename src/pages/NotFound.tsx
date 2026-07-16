import { SearchX } from 'lucide-react';
import Reveal from '../components/Reveal';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-32 pb-24">
      <Reveal>
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 rounded-full bg-moss/20 flex items-center justify-center mx-auto mb-8">
            <SearchX size={36} className="text-terracotta" />
          </div>
          <h1 className="text-6xl md:text-7xl font-fraunces font-bold text-charcoal mb-2">
            404
          </h1>
          <p className="text-stone font-fraunces text-xl mb-6">
            Página no encontrada
          </p>
          <p className="text-charcoal/70 text-lg mb-8 font-light">
            La página que buscas no existe o ha sido movida. Te invitamos a
            volver al inicio para seguir explorando el legado del fique.
          </p>
          <Button to="/" variant="outline">
            Volver al inicio
          </Button>
        </div>
      </Reveal>
    </section>
  );
}