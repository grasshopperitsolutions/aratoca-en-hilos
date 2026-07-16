import { Link } from 'react-router-dom';
import { Leaf, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-cream border-t border-stone/30 pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-10 mb-16 text-center md:text-left">
          <div className="md:w-1/3">
            <Link
              to="/"
              className="text-2xl font-fraunces font-bold text-earth mb-4 flex items-center justify-center md:justify-start gap-2"
            >
              <Leaf className="text-penca" size={20} />
              Aratoca{' '}
              <span className="italic font-light text-terracotta">en Hilos</span>
            </Link>
            <p className="text-charcoal/60 text-sm mt-4">
              Protegiendo y tejiendo la memoria artesanal de Santander. Un
              tributo a la planta, las manos y la herencia.
            </p>
          </div>

          <div className="flex gap-12 text-sm">
            <div>
              <h4 className="font-bold uppercase tracking-widest text-charcoal mb-4">
                Navegar
              </h4>
              <ul className="space-y-3 text-charcoal/70">
                <li>
                  <Link to="/acerca-de" className="hover:text-terracotta transition-colors">
                    Acerca de
                  </Link>
                </li>
                <li>
                  <Link to="/taller-fique" className="hover:text-terracotta transition-colors">
                    Taller Fique
                  </Link>
                </li>
                <li>
                  <Link to="/contacto" className="hover:text-terracotta transition-colors">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-widest text-charcoal mb-4">
                Legal
              </h4>
              <ul className="space-y-3 text-charcoal/70">
                <li>
                  <Link to="/privacidad" className="hover:text-terracotta transition-colors">
                    Privacidad
                  </Link>
                </li>
                <li>
                  <Link to="/terminos" className="hover:text-terracotta transition-colors">
                    Términos
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <a
              href="#"
              className="w-12 h-12 rounded-full border border-stone flex items-center justify-center text-earth hover:bg-earth hover:text-cream hover:border-transparent transition-all"
              aria-label="Redes sociales"
            >
              <Globe size={20} />
            </a>
          </div>
        </div>

        <div className="text-center text-stone text-xs uppercase tracking-widest border-t border-stone/20 pt-8">
          &copy; {new Date().getFullYear()} Aratoca en Hilos. Arte de Colombia.
        </div>
      </div>
    </footer>
  );
}