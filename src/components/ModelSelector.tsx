import React, { useEffect, useState } from 'react';
import { ModelDeployment } from '../types';
import { fetchModelDeployments } from '../services/api';
import { ChevronDown } from 'lucide-react';

interface ModelSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  value, 
  onChange, 
  error, 
  required = false 
}) => {
  const [models, setModels] = useState<ModelDeployment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const response = await fetchModelDeployments();
        // Filter only successful deployments
        const availableModels = response.data.filter(model => model.status === 'succeeded');
        setModels(availableModels);
      } catch (error) {
        console.error('Failed to load model deployments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  if (loading) {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          AI Model {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center justify-center p-3 border rounded-md">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-sm text-gray-500">Loading models...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        AI Model {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          name="model"
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-3 py-2 border rounded-md shadow-sm appearance-none
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
        >
          <option value="">Select an AI model...</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.model} ({model.id})
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-fadeIn">{error}</p>
      )}
      {models.length === 0 && !loading && (
        <p className="mt-1 text-sm text-yellow-600">No available models found</p>
      )}
    </div>
  );
};

export default ModelSelector;