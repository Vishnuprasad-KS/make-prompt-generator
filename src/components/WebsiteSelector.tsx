import React, { useEffect, useState } from 'react';
import { Website } from '../types';
import { fetchWebsites } from '../services/api';
import { ChevronDown } from 'lucide-react';

interface WebsiteSelectorProps {
  onSelect: (websiteId: string, websiteName: string) => void;
  error?: string;
}

const WebsiteSelector: React.FC<WebsiteSelectorProps> = ({ onSelect, error }) => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWebsite, setSelectedWebsite] = useState('');

  useEffect(() => {
    const loadWebsites = async () => {
      try {
        const data = await fetchWebsites();
        setWebsites(data);
      } catch (error) {
        console.error('Failed to load websites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWebsites();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const websiteId = e.target.value;
    const website = websites.find(w => w.id === websiteId);
    setSelectedWebsite(websiteId);
    onSelect(websiteId, website?.name || '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Website <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select
          value={selectedWebsite}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm appearance-none
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
        >
          <option value="">Choose a website...</option>
          {websites.map((website) => (
            <option key={website.id} value={website.id}>
              {website.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-sm text-red-600 animate-fadeIn">{error}</p>}
    </div>
  );
};

export default WebsiteSelector