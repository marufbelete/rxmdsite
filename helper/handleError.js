const handleError = (msg, status) => {
  const error = new Error(msg);
  error.statusCode = status;
  throw error;
};

<<<<<<< HEAD
module.exports {
=======
export default {
>>>>>>> e39ae32c8a3f08b103cc73b623744cbe52f9be25
  handleError,
};
