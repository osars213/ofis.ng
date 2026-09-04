import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './context/AppContext';
import { App } from './App';
import { PreLaunchPage } from './components/pages/PreLaunchPage';
import './index.css';

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
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleEnterApp = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('app', '1');
    window.history.pushState({}, '', url.toString());
    setIsAppMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isAppMode) {
    return (
      <AppProvider>
        <App />
      </AppProvider>
    );
  }

  return <PreLaunchPage onEnterApp={handleEnterApp} />;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

