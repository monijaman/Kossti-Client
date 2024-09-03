interface FormData {
    [key: string]: string; // Defines the structure for formData
  }
  
  interface ValidationRules {
    required?: boolean;
    email?: boolean;
    phoneNumber?: boolean;
    passwordConfirmation?: boolean;
    minLength?: number;
    maxLength?: number;
    custom?: (value: string, formData: FormData) => boolean | string ;
  }
  
  interface ValidationConfig {
    [key: string]: ValidationRules; // Maps form fields to their validation rules
  }
  
  interface ErrorResponse {
    [key: string]: string[]; // Maps form fields to their error messages
  }
  
  const validateField = (
    field: string,
    value: string,
    rules: ValidationRules,
    formData: FormData
  ): string[] => {
    const errors: string[] = [];
  
    if (rules.required && !value) {
      errors.push(`${field} is required. `);
    }
  
    if (rules.email && !/\S+@\S+\.\S+/.test(value)) {
      errors.push(`${field} must be a valid email address. `);
    }
  
    if (rules.phoneNumber && !/^\+?\d{8,11}$/.test(value.replace(/\s/g, ''))) {
      errors.push(`${field} must be a valid phone number. `);
    }
  
    if (rules.passwordConfirmation && formData.password !== value) {
      errors.push(`Passwords do not match. `);
    }
  
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`${field} must be at least ${rules.minLength} characters long. `);
    }
  
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${field} must be no more than ${rules.maxLength} characters long. `);
    }
  
    if (rules.custom) {
      const customError = rules.custom(value, formData);
      if (typeof customError === 'string') {
        errors.push(customError);
      } else if (!customError) {
        errors.push(`${field} is invalid`);
      }
    }
  
    return errors;
  };
  
  const getErrors = (
    formData: FormData,
    validationConfig: ValidationConfig
  ): ErrorResponse => {
    const errorResponse: ErrorResponse = {};
  
    for (const field in validationConfig) {
      if (validationConfig.hasOwnProperty(field)) {
        const rules = validationConfig[field];
        const value = formData[field] || '';
  
        const fieldErrors = validateField(field, value, rules, formData);
  
        if (fieldErrors.length > 0) {
          errorResponse[field] = fieldErrors;
        }
      }
    }
  
    return errorResponse;
  };
  
  export default getErrors;
  