

const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse')


exports.register = async(req, res, next) => {
    // res.send("Register Route")
    const {username, email, password} = req.body;

    try{
        const user = await User.create({
            username, 
            email, 
            password
        });
        
        res.status(201).json({
            success: true,
            user,
        });
    }catch(error){
        next(error);
        // res.status(500).json({
        //     success: false,
        //     error: error.message
        // })
    }

}

exports.login = async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password){
        // res.status(400).json({success: false, error: "Please provide email and password"})
        return next(new ErrorResponse("Please provide email and password", 400))
    }
    try{
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return next(new ErrorResponse("Invalid credentials", 401))
        }

        const isMatch = await user.matchPasswords(password);

        if(!isMatch){
            return next(new ErrorResponse("Invalid credentials", 401))
        }

        res.status(200).json({
            success: true,
            token: "tr34f3443fc",
        })

    } catch(error){
        res.status(500).json({success: false, error: error.message});
    }
}


exports.forgotpassword = (req, res, next) => {
    res.send("Forget Password Route")
}

exports.resetpassword = (req, res, next) => {
    res.send("Reset Password Route")
}