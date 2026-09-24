import { Outlet } from 'react-router-dom';

import FondoVivo from '../components/FondoVivo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useDocumentHead } from '../hooks/useDocumentHead';

export default function MainLayout() {
  useDocumentHead();

  return (
    <div className="relative min-h-screen bg-cream text-charcoal font-nunito overflow-x-hidden">
      <FondoVivo />
      {/* Everything readable sits above the drifting layer. */}
      <div className="relative z-10">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
