export function extractErrorMessage(error) {
  // API error with response
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // API error with data.error
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  // Axios error message
  if (error?.message) {
    return error.message;
  }

  // Fallback
  return 'An error occurred. Please try again.';
}

/* Check if error is a network error */
export function isNetworkError(error) {
  return !error?.response;
}

/* Check if error is unauthorized (401)*/
export function isUnauthorizedError(error) {
  return error?.response?.status === 401;
}

/* Check if error is forbidden (403)*/
export function isForbiddenError(error) {
  return error?.response?.status === 403;
}

/* Check if error is not found (404)*/
export function isNotFoundError(error) {
  return error?.response?.status === 404;
}


/* Check if error is validation error (400)*/
export function isValidationError(error) {
  return error?.response?.status === 400;
}

/* Get user-friendly message based on error type*/
export function getErrorMessage(error) {
  if (isNetworkError(error)) {
    return 'Network error. Please check your connection.';
  }

  if (isUnauthorizedError(error)) {
    return 'Your session expired. Please sign in again.';
  }

  if (isForbiddenError(error)) {
    return 'You do not have permission to perform this action.';
  }

  if (isNotFoundError(error)) {
    return 'The requested resource was not found.';
  }

  return extractErrorMessage(error);
}
