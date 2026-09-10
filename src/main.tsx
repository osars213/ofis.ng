import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { PreLaunchPage } from './components/pages/PreLaunchPage';
import { AppProvider } from './context/AppContext';
import { App } from './App';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in OFIS app:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#071521] text-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F4A261]/20 border border-[#F4A261]/40 flex items-center justify-center text-[#F4A261] mb-6 text-2xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-sm text-[#94A3B8] max-w-md mb-6 leading-relaxed">
            {this.state.error?.message || 'An unexpected error occurred while loading the application.'}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#14B8A6] text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-[#0F766E]/20"
          >
            Refresh Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
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
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </React.StrictMode>
);

