

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
        
        sendToken(user, 201, res);
    }catch(error){
        next(error);
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

        sendToken(user, 200, res);

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

const sendToken = (user, statusCode, res) => {
    //Generating token for user model
    const token = user.getSignedToken();
    res.status(statusCode).json({success: true, token})
}