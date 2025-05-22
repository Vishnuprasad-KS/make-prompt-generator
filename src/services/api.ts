import { FormData } from '../types';

// Replace with your actual API endpoint
const API_URL = import.meta.env.VITE_WEBHOOK_URL;

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