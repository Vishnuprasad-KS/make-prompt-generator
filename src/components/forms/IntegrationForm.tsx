import React from 'react';
import { FormData, FormErrors } from '../../types';
import FormField from '../FormField';
import ModelSelector from '../ModelSelector';
import { Send, Info } from 'lucide-react';

interface IntegrationFormProps {
  formData: FormData;
  errors: FormErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBack: () => void;
  isSubmitting: boolean;
}

const IntegrationForm: React.FC<IntegrationFormProps> = ({
  formData,
  errors,
  handleChange,
  handleBack,
  isSubmitting,
}) => {
  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Selected Website:</strong> {formData.selectedWebsiteName}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Selected Collection:</strong> {formData.selectedCollectionName}
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Prompt <span className="text-red-500">*</span>
        </label>
        <div className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Please customize this template with your specific requirements. Replace [PURPOSE] and other placeholders with your actual content needs.
            </p>
          </div>
        </div>
        <textarea
          name="prompt"
          value={formData.prompt}
          onChange={handleChange}
          placeholder="Enter your prompt here..."
          rows={5}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
            errors.prompt ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          required
        />
        {errors.prompt && (
          <p className="mt-1 text-sm text-red-600 animate-fadeIn">{errors.prompt}</p>
        )}
      </div>
      
      <FormField
        label="Keywords"
        name="keywords"
        value={formData.keywords}
        onChange={handleChange}
        placeholder="Enter comma separated keywords..."
      />
      
      <ModelSelector
        value={formData.model}
        onChange={handleChange}
        error={errors.model}
        required
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
              <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full" />
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
};

export default IntegrationForm;