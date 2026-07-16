import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';

const menuItems = [
  { label: 'Inicio', path: '/' },
  { label: 'Acerca de', path: '/acerca-de' },
  { label: 'Taller Fique', path: '/taller-fique' },
  { label: 'Contacto', path: '/contacto' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const prevPathname = useRef(location.pathname);
  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      setMobileMenuOpen(false);
      prevPathname.current = location.pathname;
    }
  }, [location.pathname]);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-500 border-b ${
        isScrolled
          ? 'bg-cream/90 backdrop-blur-md py-4 border-stone/20 shadow-sm'
          : 'bg-transparent py-6 border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Menú Izquierdo (Desktop) */}
        <nav className="hidden md:flex gap-6 w-1/3">
          {menuItems.slice(0, 2).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-semibold tracking-widest uppercase transition-colors ${
                location.pathname === item.path
                  ? 'text-terracotta'
                  : 'text-charcoal hover:text-terracotta'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logo Central */}
        <Link
          to="/"
          className="w-1/3 flex justify-start md:justify-center items-center z-50 cursor-pointer"
        >
          <span className="text-2xl md:text-3xl font-fraunces font-bold text-earth tracking-tight flex items-center gap-2">
            <Leaf className="text-penca" size={24} />
            Aratoca{' '}
            <span className="italic font-light text-terracotta">en Hilos</span>
          </span>
        </Link>

        {/* Menú Derecho (Desktop) */}
        <nav className="hidden md:flex gap-6 w-1/3 justify-end items-center">
          {menuItems.slice(2, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-semibold tracking-widest uppercase transition-colors ${
                location.pathname === item.path
                  ? 'text-terracotta'
                  : 'text-charcoal hover:text-terracotta'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Botón Menú Mobile */}
        <button
          className="md:hidden z-50 text-charcoal"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú Mobile Fullscreen */}
      <div
        className={`fixed inset-0 bg-charcoal text-cream flex flex-col justify-center items-center gap-10 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] md:hidden ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="absolute top-10 left-10 opacity-10">
          <Leaf size={200} />
        </div>
        {menuItems.map((item, i) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileMenuOpen(false)}
            className="text-4xl font-fraunces hover:text-fique transition-colors"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}