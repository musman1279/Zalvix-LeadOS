// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     Promise.resolve(fn(req, res, next)).catch(next);
//   };
// };

// export default catchAsync;

const catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.error("===== ERROR =====");
      console.error(err);
      console.error(err.stack);
      next(err);
    }
  };
};

export default catchAsync;