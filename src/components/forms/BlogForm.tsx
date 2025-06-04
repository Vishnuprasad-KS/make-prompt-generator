import React from 'react';
import { FormData, FormErrors } from '../../types';
import FormField from '../FormField';
import { Send } from 'lucide-react';

interface BlogFormProps {
  formData: FormData;
  errors: FormErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBack: () => void;
  isSubmitting: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({
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
        placeholder="Enter your blog post prompt here..."
      />
      
      <FormField
        label="Category"
        name="category"
        value={formData.category || ''}
        onChange={handleChange}
        required
        placeholder="Enter blog category..."
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

export default BlogForm;