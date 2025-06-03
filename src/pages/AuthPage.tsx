import React from 'react';
import { LogIn } from 'lucide-react';

const AuthPage: React.FC = () => {
  const handleAuth = () => {
    // Redirect to the backend's auth initiation endpoint
    window.location.href = 'http://localhost:8000/auth/webflow';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center animate-fadeIn">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">
          Welcome to AI Prompt Generator
        </h1>
        <p className="text-gray-600 mb-8">
          Connect your Webflow account to start generating AI prompts for your website content.
        </p>
        
        <button
          onClick={handleAuth}
          className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg
            hover:bg-indigo-700 transition-colors"
        >
          <div className="flex items-center">
            <LogIn className="w-5 h-5 mr-2" />
            Connect with Webflow
          </div>
        </button>
      </div>
    </div>
  );
};

export default AuthPage;