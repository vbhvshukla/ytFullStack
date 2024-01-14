// Made a general utility to add try catch async await.

//Approach 2

const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {});
  };
};

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
