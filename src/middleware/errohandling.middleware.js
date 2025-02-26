exports.errorHandler = (err, req, res, next) => {
  // console.log(err)
  // console.log(err.response.body)
  console.log("error middleware")
  !!err.statusCode ? err.statusCode : (err.statusCode = 500);
  return res.status(err.statusCode).json({
    message: err.statusCode === 500 ? "Unknown Error Occured" : err.message,
    status: false,
  });
};
