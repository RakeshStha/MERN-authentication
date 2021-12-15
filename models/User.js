const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const bcrypt = require('bcryptjs/dist/bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"]
    },
    email: {
        type: String,
        required: [true, "Please providea email"],
        unique: true,
        match:[
            /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
            "Please provide a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false //password won't be send back - features
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

//middleare of mongoose
UserSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        //won't rehash direct save(package= bcryptjs)
        next()
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

UserSchema.methods.matchPasswords = async function(password){
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function(){
    return jwt.sign({ 
        id: this._id},
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRE,});
};


UserSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

    return resetToken;

}

const User = mongoose.model("User", UserSchema);

module.exports = User;