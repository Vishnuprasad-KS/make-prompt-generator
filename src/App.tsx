import React from 'react';
import PromptForm from './components/PromptForm';

function App() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="text-center mb-8 animate-slideUp">
        <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-2">
          AI Prompt Generator
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Create and submit your AI prompts with ease. Fill in the required fields and let our system handle the rest.
        </p>
      </div>
      
      <PromptForm />
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>© 2025 AI Prompt Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;