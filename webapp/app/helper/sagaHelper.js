export const toErrorMessage = (err, fallback) => {
  if (!err) {
    return fallback;
  }
  if (typeof err === 'string') {
    return err;
  }
  if (err.message) {
    return err.message;
  }
  if (err.error) {
    return err.error;
  }
  return fallback;
};
