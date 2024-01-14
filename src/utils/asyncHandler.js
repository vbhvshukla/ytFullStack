// Made a general utility to add try catch async await.

//Approach 2

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      console.log("Error Async Handler : ",err);
    });
  };
};

export {asyncHandler}
//Approach 1 higher order function passing a function in a function
// const asyncHandler = (function) => async (req,res,next) => {
//     try {
//         await function(req,res,next);

//     } catch (error) {
//         res.status(err.code || 500).json(
//             {
//                 success : false,
//                 message : err.message
//             }
//         )
//     }
// }
