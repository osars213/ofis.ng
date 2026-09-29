import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AppProvider } from './context/AppContext';
import { App } from './App';

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
        <div className="min-h-screen bg-[#FFF9F4] dark:bg-[#07383D] text-[#12383B] dark:text-[#FFFFFF] flex flex-col items-center justify-center p-6 text-center selection:bg-[#14BEB8] selection:text-white">
          <div className="w-14 h-14 rounded-2xl bg-[#FFA987]/20 border border-[#FFA987]/40 flex items-center justify-center text-[#FFA987] mb-6 text-2xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-sm text-[#5D7A7D] dark:text-[#B8D1D0] max-w-md mb-6 leading-relaxed">
            {this.state.error?.message || 'An unexpected error occurred while loading the application.'}
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="px-6 py-2.5 rounded-xl bg-[#006B70] hover:bg-[#14BEB8] text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-[#006B70]/20"
          >
            Refresh Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
