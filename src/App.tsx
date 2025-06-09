import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import { useEffect } from 'react';

function App() {
  useEffect(() => {

    const sendBeaconSafely = (endpoint: string) => {
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon(endpoint);
        } else {
          // Fallback for older browsers
          fetch(endpoint).catch(() => {}); // Ignore errors on page unload
        }
      } catch (error) {
        console.warn('Failed to send beacon:', error);
      }
    };

    const handleBeforeUnload = () => {
      sendBeaconSafely('/session/session-end');
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendBeaconSafely('/session/session-pause');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;