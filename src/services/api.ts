import { FormData, Website, Collection } from '../types';
import { WebflowClient } from 'webflow-api';

const API_URL = import.meta.env.VITE_WEBHOOK_URL;
const webflow = new WebflowClient({ accessToken: import.meta.env.VITE_WEBFLOW_API_KEY });

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
    const sites = await webflow.sites.list();
    console.log(sites)
    return sites.sites!.map(site => ({
      id: site.id,
      name: site.displayName
    }));
  } catch (error) {
    console.error('Error fetching websites:', error);
    throw error;
  }
};

export const fetchCollections = async (websiteId: string): Promise<Collection[]> => {
  try {
    const collections = await webflow.collections.list(websiteId);
    return collections.collections!.map(collection => ({
      id: collection.id,
      name: collection.displayName
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
};