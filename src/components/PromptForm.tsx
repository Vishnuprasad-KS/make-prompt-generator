import React, { useState } from 'react';
import { FormData, FormErrors, NotificationType } from '../types';
import { submitFormData } from '../services/api';
import FormField from './FormField';
import Notification from './Notification';
import { Send } from 'lucide-react';

const PromptForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    prompt: '',
    keywords: '',
    model: '',
    otherDetails: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: NotificationType;
    message: string;
  }>({
    type: null,
    message: '',
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.prompt.trim()) {
      newErrors.prompt = 'Prompt is required';
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'AI Model is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await submitFormData(formData);
      setNotification({
        type: 'success',
        message: 'Your prompt was submitted successfully!',
      });
      
      // Reset form after successful submission
      setFormData({
        prompt: '',
        keywords: '',
        model: '',
        otherDetails: '',
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to submit prompt. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearNotification = () => {
    setNotification({ type: null, message: '' });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Notification
        type={notification.type}
        message={notification.message}
        onClose={clearNotification}
      />
      
      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-xl rounded-xl p-6 md:p-8 animate-fadeIn"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Website Generator</h2>
        
        <FormField
          label="Prompt"
          name="prompt"
          type="textarea"
          value={formData.prompt}
          onChange={handleChange}
          error={errors.prompt}
          required
          placeholder="Enter your prompt here..."
        />
        
        <FormField
          label="Keywords"
          name="keywords"
          value={formData.keywords}
          onChange={handleChange}
          placeholder="Enter comma separated keywords..."
        />
        
        <FormField
          label="AI Model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          error={errors.model}
          required
          placeholder="e.g., GPT-4, Claude, etc."
        />
        
        <FormField
          label="Other Details"
          name="otherDetails"
          value={formData.otherDetails}
          onChange={handleChange}
          placeholder="Enter any additional details..."
        />
        
        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing....
              </span>
            ) : (
              <span className="flex items-center">
                <Send className="mr-2 h-5 w-5" />
                Submit Prompt
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptForm;