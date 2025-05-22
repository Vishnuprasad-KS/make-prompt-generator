import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'textarea';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder = '',
}) => {
  return (
    <div className="mb-6">
      <label 
        htmlFor={name} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={5}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          required={required}
        />
      ) : (
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          required={required}
        />
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-fadeIn">{error}</p>
      )}
    </div>
  );
};

export default FormField;