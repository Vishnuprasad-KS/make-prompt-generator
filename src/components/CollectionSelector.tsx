import React, { useEffect, useState } from 'react';
import { Collection } from '../types';
import { fetchCollections } from '../services/api';
import { Search } from 'lucide-react';

interface CollectionSelectorProps {
  websiteId: string;
  onSelect: (collectionId: string, collectionName: string) => void;
  error?: string;
}

const CollectionSelector: React.FC<CollectionSelectorProps> = ({ 
  websiteId, 
  onSelect,
  error 
}) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('');

  useEffect(() => {
    const loadCollections = async () => {
      if (!websiteId) return;
      
      setLoading(true);
      try {
        const data = await fetchCollections(websiteId);
        setCollections(data);
      } catch (error) {
        console.error('Failed to load collections:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCollections();
  }, [websiteId]);

  const filteredCollections = collections.filter(collection =>
    collection.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (collectionId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    setSelectedCollection(collectionId);
    onSelect(collectionId, collection?.name || '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Select Collection <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search collections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div className="mt-2 max-h-60 overflow-y-auto border rounded-md">
        {filteredCollections.map((collection) => (
          <button
            key={collection.id}
            onClick={() => handleSelect(collection.id || '')}
            className={`w-full text-left px-4 py-2 hover:bg-indigo-50 transition-colors
              ${selectedCollection === collection.id ? 'bg-indigo-100' : ''}`}
          >
            {collection.name}
          </button>
        ))}
        {filteredCollections.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No collections found
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600 animate-fadeIn">{error}</p>}
    </div>
  );
};