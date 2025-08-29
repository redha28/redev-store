// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (minimum 8 characters, at least one letter and one number)
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

// Required field validation
export const isRequired = (value) => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined && value !== "";
};

// Minimum length validation
export const minLength = (value, min) => {
  if (typeof value === "string") {
    return value.trim().length >= min;
  }
  return false;
};

// Maximum length validation
export const maxLength = (value, max) => {
  if (typeof value === "string") {
    return value.trim().length <= max;
  }
  return false;
};

// Number validation
export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

// Positive number validation
export const isPositiveNumber = (value) => {
  return isNumber(value) && parseFloat(value) > 0;
};

// Integer validation
export const isInteger = (value) => {
  return Number.isInteger(parseFloat(value));
};

// Product code validation (alphanumeric with dashes and underscores)
export const isValidProductCode = (code) => {
  const codeRegex = /^[A-Za-z0-9_-]+$/;
  return codeRegex.test(code);
};

// Form validation helper
export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const value = formData[field];
    const fieldRules = rules[field];

    fieldRules.forEach((rule) => {
      if (typeof rule === "function") {
        const result = rule(value);
        if (result !== true) {
          if (!errors[field]) errors[field] = [];
          errors[field].push(result);
        }
      } else if (typeof rule === "object") {
        const { validator, message } = rule;
        const result = validator(value);
        if (!result) {
          if (!errors[field]) errors[field] = [];
          errors[field].push(message);
        }
      }
    });
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Common validation rules
export const validationRules = {
  required: (message = "This field is required") => ({
    validator: isRequired,
    message,
  }),

  email: (message = "Please enter a valid email address") => ({
    validator: isValidEmail,
    message,
  }),

  password: (message = "Password must be at least 8 characters with letters and numbers") => ({
    validator: isValidPassword,
    message,
  }),

  minLength: (min, message) => ({
    validator: (value) => minLength(value, min),
    message: message || `Minimum ${min} characters required`,
  }),

  maxLength: (max, message) => ({
    validator: (value) => maxLength(value, max),
    message: message || `Maximum ${max} characters allowed`,
  }),

  number: (message = "Please enter a valid number") => ({
    validator: isNumber,
    message,
  }),

  positiveNumber: (message = "Please enter a positive number") => ({
    validator: isPositiveNumber,
    message,
  }),

  integer: (message = "Please enter a whole number") => ({
    validator: isInteger,
    message,
  }),

  productCode: (
    message = "Product code can only contain letters, numbers, dashes and underscores"
  ) => ({
    validator: isValidProductCode,
    message,
  }),
};
