import {asyncHandler} from "../utils/asyncHandler.js";

//Method : Register User

const registerUser = asyncHandler( async (req,res) => {
    res.status(200).json({
        message:"ok"
    })
})

export {registerUser}