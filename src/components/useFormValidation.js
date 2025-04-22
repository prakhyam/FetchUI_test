import { useState } from 'react';

/**
 * @param {Object} initialValues 
 * @param {Function} validate 
 * @returns {Object} 
 */
export const useFormValidation = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    const fieldErrors = validate({ [name]: value });
    return fieldErrors[name] || '';
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: newValue
    }));
    
    if (touched[name]) {
      const fieldError = validateField(name, newValue);
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: fieldError
      }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    
    const fieldError = validateField(name, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: fieldError
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  const validateForm = () => {
    const formErrors = validate(values);
    setErrors(formErrors);
    
    const touchedFields = {};
    Object.keys(values).forEach(key => {
      touchedFields[key] = true;
    });
    setTouched(touchedFields);
    
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (callback) => {
    setIsSubmitting(true);
    
    if (validateForm()) {
      await callback(values);
    }
    
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    validateField,
    validateForm
  };
};

export default useFormValidation;