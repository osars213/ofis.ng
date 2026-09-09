import React, { useState, useEffect, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { PreLaunchPage } from './components/pages/PreLaunchPage';
import './index.css';

// Lazy-load the heavy marketplace app bundle so prelaunch page loads with minimal JS
const AppProvider = React.lazy(() => 
  import('./context/AppContext').then(m => ({ default: m.AppProvider }))
);
const App = React.lazy(() => 
  import('./App').then(m => ({ default: m.App }))
);

function AppLoadingFallback() {
  return (
    <div className="min-h-screen bg-[#071521] flex flex-col items-center justify-center p-4">
      <div className="w-8 h-8 rounded-full border-2 border-[#14B8A6] border-t-transparent animate-spin mb-4" />
      <p className="text-sm font-medium text-[#F8FAFC]">Loading OFIS Workspaces...</p>
    </div>
  );
}

function Root() {
  const [isAppMode, setIsAppMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('app') === '1';
  });

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      setIsAppMode(params.get('app') === '1');
    };

    window.addEventListener('popstate', handleUrlChange);

    // Prefetch App in idle time after initial paint so click-to-enter is instantaneous
    if (!isAppMode && 'requestIdleCallback' in window) {
      const handle = (window as any).requestIdleCallback(() => {
        import('./App');
        import('./context/AppContext');
      }, { timeout: 3000 });
      return () => {
        window.removeEventListener('popstate', handleUrlChange);
        if ('cancelIdleCallback' in window) {
          (window as any).cancelIdleCallback(handle);
        }
      };
    }

    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [isAppMode]);

  const handleEnterApp = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('app', '1');
    window.history.pushState({}, '', url.toString());
    setIsAppMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAppMode) {
    return (
      <Suspense fallback={<AppLoadingFallback />}>
        <AppProvider>
          <App />
        </AppProvider>
      </Suspense>
    );
  }

  return <PreLaunchPage onEnterApp={handleEnterApp} />;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

