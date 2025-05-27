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
    const response = await fetch(WEBFLOW_API_URL + "/api/sites", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    // Assuming the API returns an array of websites with id and name
    return data.map((site: any) => ({
      id: site.id,
      name: site.displayName,
    })) as Website[];
  } catch (error) {
    console.error('Error fetching websites:', error);
    throw error;
  }
};

export const fetchCollections = async (websiteId: string): Promise<Collection[]> => {
    try {
    const response = await fetch(WEBFLOW_API_URL + "/api/collections?siteId" + websiteId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    // Assuming the API returns an array of websites with id and name
    return data.map((site: any) => ({
      id: site.id,
      name: site.displayName,
    })) as Collection[];
  } catch (error) {
    console.error('Error fetching websites:', error);
    throw error;
  }
};