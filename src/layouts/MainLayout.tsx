import { Outlet } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { useDocumentHead } from '../hooks/useDocumentHead';

export default function MainLayout() {
  useDocumentHead();

  return (
    <div className="min-h-screen bg-cream text-charcoal font-nunito overflow-x-hidden">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
