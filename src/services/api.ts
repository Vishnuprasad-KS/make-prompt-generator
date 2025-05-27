import { FormData, Website, Collection } from '../types';

const API_URL = import.meta.env.VITE_WEBHOOK_URL;
const WEBFLOW_API_URL = import.meta.env.VITE_WEBFLOW_API_URL;

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
    const response = await fetch(`${WEBFLOW_API_URL}/sites`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_WEBFLOW_API_KEY}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch websites');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching websites:', error);
    throw error;
  }
};

export const fetchCollections = async (websiteId: string): Promise<Collection[]> => {
  try {
    const response = await fetch(`${WEBFLOW_API_URL}/sites/${websiteId}/collections`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_WEBFLOW_API_KEY}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch collections');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
};