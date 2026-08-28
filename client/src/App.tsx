import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { useMotionRoot } from './motion';
import Home from './pages/Home';

// §19.5 — every non-home public route is code-split.
const Services       = lazy(() => import('./pages/Services'));
const ServiceDetail  = lazy(() => import('./pages/ServiceDetail'));
const GettingStarted = lazy(() => import('./pages/GettingStarted'));
const Results        = lazy(() => import('./pages/Results'));
const CaseStudy      = lazy(() => import('./pages/CaseStudy'));
const Pricing        = lazy(() => import('./pages/Pricing'));
const About          = lazy(() => import('./pages/About'));
const Team           = lazy(() => import('./pages/Team'));
const Insights       = lazy(() => import('./pages/Insights'));
const Article        = lazy(() => import('./pages/Article'));
const Contact        = lazy(() => import('./pages/Contact'));
const GetStarted     = lazy(() => import('./pages/GetStarted'));
const Legal          = lazy(() => import('./pages/Legal'));
const NotFound       = lazy(() => import('./pages/NotFound'));

function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span className="visually-hidden">Loading</span>
    </div>
  );
}

export default function App() {
  useMotionRoot();
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Suspense fallback={<RouteFallback />}><Services /></Suspense>} />
        <Route path="services/:slug" element={<Suspense fallback={<RouteFallback />}><ServiceDetail /></Suspense>} />
        <Route path="getting-started" element={<Suspense fallback={<RouteFallback />}><GettingStarted /></Suspense>} />
        <Route path="results" element={<Suspense fallback={<RouteFallback />}><Results /></Suspense>} />
        <Route path="results/:slug" element={<Suspense fallback={<RouteFallback />}><CaseStudy /></Suspense>} />
        <Route path="pricing" element={<Suspense fallback={<RouteFallback />}><Pricing /></Suspense>} />
        <Route path="about" element={<Suspense fallback={<RouteFallback />}><About /></Suspense>} />
        <Route path="team" element={<Suspense fallback={<RouteFallback />}><Team /></Suspense>} />
        <Route path="insights" element={<Suspense fallback={<RouteFallback />}><Insights /></Suspense>} />
        <Route path="insights/:slug" element={<Suspense fallback={<RouteFallback />}><Article /></Suspense>} />
        <Route path="contact" element={<Suspense fallback={<RouteFallback />}><Contact /></Suspense>} />
        <Route path="get-started" element={<Suspense fallback={<RouteFallback />}><GetStarted /></Suspense>} />
        <Route path="privacy" element={<Suspense fallback={<RouteFallback />}><Legal /></Suspense>} />
        <Route path="terms" element={<Suspense fallback={<RouteFallback />}><Legal /></Suspense>} />
        <Route path="cookies" element={<Suspense fallback={<RouteFallback />}><Legal /></Suspense>} />
        <Route path="*" element={<Suspense fallback={<RouteFallback />}><NotFound /></Suspense>} />
      </Route>
    </Routes>
  );
}
