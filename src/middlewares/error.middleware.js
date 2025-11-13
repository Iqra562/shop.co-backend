import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err); 

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code:err.code,
      errors: err.errors || [],
    });
  }  

  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong",
    errors: [],
  });
};
 