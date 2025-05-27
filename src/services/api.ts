import { FormData, Website, Collection } from '../types';
import { WebflowClient } from 'webflow-api';

const API_URL = import.meta.env.VITE_WEBHOOK_URL;
const webflow = new WebflowClient({ token: import.meta.env.VITE_WEBFLOW_API_KEY });

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
    const sites = await webflow.sites();
    return sites.map(site => ({
      id: site._id,
      name: site.name
    }));
  } catch (error) {
    console.error('Error fetching websites:', error);
    throw error;
  }
};

export const fetchCollections = async (websiteId: string): Promise<Collection[]> => {
  try {
    const collections = await webflow.collections({ siteId: websiteId });
    return collections.map(collection => ({
      id: collection._id,
      name: collection.name
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
};