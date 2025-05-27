import React, { useState } from 'react';
import { FormData, FormErrors, NotificationType } from '../types';
import { submitFormData } from '../services/api';
import FormField from './FormField';
import Notification from './Notification';
import WebsiteSelector from './WebsiteSelector';
import CollectionSelector from './CollectionSelector';
import { Send, ArrowRight } from 'lucide-react';

const PromptForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    prompt: '',
    keywords: '',
    model: '',
    otherDetails: '',
    selectedWebsite: '',
    selectedCollection: '',
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

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {};
    
    if (currentStep === 1 && !formData.selectedWebsite) {
      newErrors.selectedWebsite = 'Please select a website';
    }
    
    if (currentStep === 2 && !formData.selectedCollection) {
      newErrors.selectedCollection = 'Please select a collection';
    }
    
    if (currentStep === 3) {
      if (!formData.prompt.trim()) {
        newErrors.prompt = 'Prompt is required';
      }
      if (!formData.model.trim()) {
        newErrors.model = 'AI Model is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWebsiteSelect = (websiteId: string) => {
    setFormData(prev => ({ ...prev, selectedWebsite: websiteId }));
    if (errors.selectedWebsite) {
      setErrors(prev => ({ ...prev, selectedWebsite: undefined }));
    }
  };

  const handleCollectionSelect = (collectionId: string) => {
    setFormData(prev => ({ ...prev, selectedCollection: collectionId }));
    if (errors.selectedCollection) {
      setErrors(prev => ({ ...prev, selectedCollection: undefined }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);
    
    try {
      await submitFormData(formData);
      setNotification({
        type: 'success',
        message: 'Your prompt was submitted successfully!',
      });
      
      setFormData({
        prompt: '',
        keywords: '',
        model: '',
        otherDetails: '',
        selectedWebsite: '',
        selectedCollection: '',
      });
      setStep(1);
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

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <WebsiteSelector 
              onSelect={handleWebsiteSelect}
              error={errors.selectedWebsite}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <CollectionSelector 
              websiteId={formData.selectedWebsite}
              onSelect={handleCollectionSelect}
              error={errors.selectedCollection}
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <>
            <div className="mb-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Selected Website:</strong> {formData.selectedWebsite}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Selected Collection:</strong> {formData.selectedCollection}
                </p>
              </div>
            </div>
            
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
            
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="mr-2 h-5 w-5" />
                    Submit Prompt
                  </span>
                )}
              </button>
            </div>
          </>
        );
      
      default:
        return null;
    }
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
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {[1, 2, 3].map((number) => (
              <div
                key={number}
                className={`z-10 flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= number ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {number}
              </div>
            ))}
            <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200">
              <div
                className="h-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {renderStepContent()}
      </form>
    </div>
  );
};

export default PromptForm;