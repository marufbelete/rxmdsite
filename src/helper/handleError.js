const handleError = (msg, status) => {
  const error = new Error(msg);
  error.statusCode = status;
  throw error;
};

module.exports = {
  handleError,
};
