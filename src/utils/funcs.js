/**
 * Parse error object and return error message depending on the environment
 * @param {*} err
 * @returns {string} Error message
 */
const parseError = (err) => {
  if (!err) return 'Unknown error';
  if (!(err instanceof Error) && typeof err === 'string') return err;

  if (process.env.NODE_ENV === 'development') {
    return err.stack;
  } else {
    return err.message;
  }
};

module.exports = {
  parseError,
};
