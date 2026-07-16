import { Mail } from 'lucide-react';
import Reveal from '../components/Reveal';
import Button from '../components/Button';

export default function Contact() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-32 pb-24">
      <Reveal>
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 rounded-full bg-moss/20 flex items-center justify-center mx-auto mb-8">
            <Mail size={36} className="text-terracotta" />
          </div>
          <h1 className="text-4xl md:text-5xl font-fraunces text-charcoal mb-4">
            Contacto
          </h1>
          <p className="text-charcoal/70 text-lg mb-8 font-light">
            Estamos preparando un formulario de contacto para que puedas
            comunicarte directamente con nosotros. Mientras tanto, puedes
            escribirnos a través de nuestras redes sociales.
          </p>
          <Button to="/" variant="outline">
            Volver al inicio
          </Button>
        </div>
      </Reveal>
    </section>
  );
}