import { ValidationError } from 'yup'

interface Error {
  [key: string]: string;
}

export function getValidationErrors(error: ValidationError): Error {
  const validationErrors: Error = {};

  error.inner.forEach(error => {
    validationErrors[error.path] = error.message;
  })

  return validationErrors;
}
