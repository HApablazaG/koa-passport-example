import hasValues from 'has-values';

// Check if value is empty.
function isEmpty (value) {
  return value === null || !hasValues(value);
}

const validationFunctions = {};

/**
 * Validate the login form data.
 *
 * @param {object} payload - the HTTP body message.
 * @returns {object} The result of validation. Object contains a boolean validation result, errors tips, and a global message.
 */
validationFunctions.loginForm = payload => {
  let formError = {};
  let isValid = true;
  let message = '';

  if (payload) {
    if (isEmpty(payload.username)) {
      formError.username = 'You must enter the username.';
      isValid = false;
    }

    if (isEmpty(payload.password)) {
      formError.password = 'You must enter a password.';
      isValid = false;
    }

    if (!isValid) {
      message = 'Check for form errors.';
    }
  } else {
    isValid = false;
    message = 'Error receiving form data.';
  }

  return { isValid, message, formError };
};

export default validationFunctions;
