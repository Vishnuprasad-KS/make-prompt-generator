import { FormData, Website, Collection } from '../types';

const API_URL = import.meta.env.VITE_WEBHOOK_URL;
const WEBFLOW_API_URL = "http://localhost:5000";

export const submitFormData = async (formData: FormData): Promise<Response> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    return response;
  } catch (error) {
    console.error('Error submitting form data:', error);
    throw error;
  }
};

export const fetchWebsites = async (): Promise<Website[]> => {
  try {
    const response = await fetch(`${WEBFLOW_API_URL}/api/sites`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error('Unexpected response format:', data);
      return [];
    }
    
    return data.map((site: any) => ({
      id: site.id || undefined,
      name: site.displayName || site.name || undefined,
    }));
  } catch (error) {
    console.error('Error fetching websites:', error);
    return [];
  }
};

export const fetchCollections = async (websiteId: string): Promise<Collection[]> => {
  try {
    const response = await fetch(`${WEBFLOW_API_URL}/api/collections?siteId=${websiteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error('Unexpected response format:', data);
      return [];
    }

    return data.map((collection: any) => ({
      id: collection.id || undefined,
      name: collection.displayName || collection.name || undefined,
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
};