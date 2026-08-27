import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/shell/Header';
import { Footer } from './components/shell/Footer';
import { BackgroundLayer } from './components/shell/BackgroundLayer';
import { useMotionRoot } from './motion';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';

/** Restore scroll on route change; jump to a hash target when one is present. */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const { pathname } = useLocation();
  useMotionRoot();

  // C0 renders in the scrolled state from load — no dark hero sits beneath it.
  const solidHeader = pathname !== '/';

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollManager />
      <BackgroundLayer />
      <Header solid={solidHeader} />

      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
