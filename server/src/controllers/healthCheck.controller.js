import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/AsyncHandler.js";

 const healthCheckController = asyncHandler(async (req, res) => {
    const response = new ApiResponse(
      200,
      null,
      "Server is up and running",
    );
    return res.status(response.statusCode).json(response);
});
export default healthCheckController;