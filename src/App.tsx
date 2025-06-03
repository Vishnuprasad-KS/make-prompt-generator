import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './components/Dashboard';

function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      localStorage.setItem('authToken', token);
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  }, [navigate, location]);

  return null;
}

function App() {
  const isAuthenticated = !!localStorage.getItem('authToken');

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
        />
        <Route path="/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;