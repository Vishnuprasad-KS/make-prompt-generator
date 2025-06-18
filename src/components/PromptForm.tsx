import React, { useState } from 'react';
import { FormData, FormErrors, NotificationType } from '../types';
import { submitFormData } from '../services/api';
import Notification from './Notification';
import WebsiteSelector from './WebsiteSelector';
import CollectionSelector from './CollectionSelector';
import { ArrowRight } from 'lucide-react';
import BlogForm from './forms/BlogForm';
import IntegrationForm from './forms/IntegrationForm';
import { getPresetPrompt } from '../constants/presetPrompts';

const PromptForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    prompt: '',
    keywords: '',
    model: '',
    otherDetails: '',
    selectedWebsite: '',
    selectedWebsiteName: '',
    selectedCollection: '',
    selectedCollectionName: '',
    category: '',
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
        newErrors.prompt = 'Please use the chat interface to generate a prompt';
      }
      
      if (!formData.model.trim()) {
        newErrors.model = 'AI Model is required';
      }
      if (formData.selectedCollection === '66a345b2baa543bc5924b256' && !formData.category?.trim()) {
        newErrors.category = 'Category is required for blog posts';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWebsiteSelect = (websiteId: string, websiteName: string) => {
    setFormData(prev => ({ 
      ...prev, 
      selectedWebsite: websiteId,
      selectedWebsiteName: websiteName
    }));
    if (errors.selectedWebsite) {
      setErrors(prev => ({ ...prev, selectedWebsite: undefined }));
    }
  };

  const handleCollectionSelect = (collectionId: string, collectionName: string) => {
    // Get the preset prompt based on collection selection
    const presetPromptData = getPresetPrompt(collectionId);
    
    setFormData(prev => ({ 
      ...prev, 
      selectedCollection: collectionId,
      selectedCollectionName: collectionName,
      prompt: '' // Reset prompt when collection changes
    }));
    
    if (errors.selectedCollection) {
      setErrors(prev => ({ ...prev, selectedCollection: undefined }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
        selectedWebsiteName: '',
        selectedCollection: '',
        selectedCollectionName: '',
        category: '',
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
        return formData.selectedCollection === '66a345b2baa543bc5924b256' ? (
          <BlogForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleBack={handleBack}
            isSubmitting={isSubmitting}
          />
        ) : (
          <IntegrationForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleBack={handleBack}
            isSubmitting={isSubmitting}
          />
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

export default PromptForm