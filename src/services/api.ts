import { FormData, Website, Collection } from '../types';

const API_URL = import.meta.env.VITE_WEBHOOK_URL;
const WEBFLOW_API_URL = "http://localhost:8000";

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
    console.log('Raw API response:', data); // Debug log
    
    // Handle different response formats
    const sites = Array.isArray(data) ? data : data.sites || [];
    
    if (!Array.isArray(sites)) {
      console.error('Invalid response format. Expected array, got:', typeof sites);
      return [];
    }
    
    return sites.map((site: any) => {
      // Debug log for each site object
      console.log('Processing site:', site);
      
      return {
        id: site.id?.toString() || undefined,
        name: site.displayName || site.name || undefined,
      };
    });
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
    console.log('Raw collections response:', data); // Debug log
    
    // Handle different response formats
    const collections = Array.isArray(data) ? data : data.collections || [];
    
    if (!Array.isArray(collections)) {
      console.error('Invalid collections format. Expected array, got:', typeof collections);
      return [];
    }

    return collections.map((collection: any) => {
      // Debug log for each collection object
      console.log('Processing collection:', collection);
      
      return {
        id: collection.id?.toString() || undefined,
        name: collection.displayName || collection.name || undefined,
      };
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
};