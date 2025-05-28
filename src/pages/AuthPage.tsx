import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to authenticate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center animate-fadeIn">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">
          Welcome to AI Prompt Generator
        </h1>
        <p className="text-gray-600 mb-8">
          Please authenticate to start generating AI prompts for your website content.
        </p>
        
        <button
          onClick={handleAuth}
          disabled={isLoading}
          className={`w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg
            hover:bg-indigo-700 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Authenticating...
            </div>
          ) : (
            <div className="flex items-center">
              <LogIn className="w-5 h-5 mr-2" />
              Authenticate with Webflow
            </div>
          )}
        </button>
        
        {error && (
          <p className="mt-4 text-red-600 text-sm animate-fadeIn">{error}</p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;