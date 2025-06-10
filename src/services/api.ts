import { FormData, Website, Collection, ModelDeploymentsResponse } from '../types';

const API_URL = import.meta.env.VITE_WEBHOOK_URL;
const WEBFLOW_API_URL = import.meta.env.VITE_API_URL;

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    // Redirect to auth endpoint
    window.location.href = `${WEBFLOW_API_URL}/auth`;
    throw new Error('Authentication required');
  }
  
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  
  return response;
};

export const submitFormData = async (formData: FormData): Promise<Response> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    await handleResponse(response);
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
    
    await handleResponse(response);
    
    const data = await response.json();
    console.log('Raw API response:', data);
    
    const sites = Array.isArray(data) ? data : data.sites || [];
    
    if (!Array.isArray(sites)) {
      console.error('Invalid response format. Expected array, got:', typeof sites);
      return [];
    }
    
    return sites.map((site: any) => {
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
    const response = await fetch(`${WEBFLOW_API_URL}/api/collections/${websiteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    await handleResponse(response);

    const data = await response.json();
    console.log('Raw collections response:', data);
    
    const collections = Array.isArray(data) ? data : data.collections || [];
    
    if (!Array.isArray(collections)) {
      console.error('Invalid collections format. Expected array, got:', typeof collections);
      return [];
    }

    return collections.map((collection: any) => {
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

export const fetchModelDeployments = async (): Promise<ModelDeploymentsResponse> => {
  try {
    const response = await fetch(`${WEBFLOW_API_URL}/azure/model-deployments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    await handleResponse(response);
    
    const data = await response.json();
    console.log('Raw model deployments response:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching model deployments:', error);
    return { data: [], object: 'list' };
  }
};