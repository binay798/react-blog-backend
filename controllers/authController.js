const User = require('./../models/userModal');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const sendEmail = require('./../utils/email');
const getUrl = require('./../utils/getUrl')

const createJwt = (id) => {
    return jwt.sign({ id },process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}
const catchErr = (res,err) => {
    res.status(404).json({
        status: 'fail',
        message: err.message
    })
}

exports.signup = async(req,res,next) => {
    try {
        const { fullname, username, email, password, confirmPassword } = req.body;
        console.log(req.body)
        // Create User
        const user = await User.create({
          fullname,
          username,
          email,
          password,
          confirmPassword  
        })

        const token = createJwt(user._id)
        
        res.status(200).json({
            status: 'success',
            token
        })
    } catch(err) {
        catchErr(res,err)
    }
}

exports.login = async (req,res,next) => {
    try {
        const { email, password } = req.body;
        // Get user based on email
        const user = await User.findOne({ email }).select('+password');
        if(!user) return next(new Error('Invalid email or password'))

        const isPasswordCorrect = await user.comparePassword(password,user.password);

        if(!isPasswordCorrect) return next(new Error('Invalid email or password'))
        delete user.password;

        const token = createJwt(user._id)

        
        res.status(200).json({
            status: 'success',
            token,
            user
        })
    } catch(err) {
        catchErr(res,err)
    }
}

exports.loginThroughToken = async (req,res,next) => {
    try {
        const token = req.headers.authorization;
        if(!token || !token.startsWith('Bearer')) return next(new Error('Invalid token'))
        const decodeToken = jwt.verify(token.split(' ')[1],process.env.JWT_SECRET_KEY)

        const user = await User.findById(decodeToken.id)
        res.json({
            status: 'success',
            user
        })
    } catch(err) {
        catchErr(res,err)
    }
}


exports.protectRoutes = async(req,res,next) => {
    try {
        // Check the token
        if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
            return next(new Error('User not logged in'))
        }

        const token = req.headers.authorization.split(' ')[1];
        // Verify the token
        const verify = jwt.verify(token,process.env.JWT_SECRET_KEY)

        

        // Check the existence of the user
        const user = await User.findById(verify.id)

        if(!user) return next(new Error('Invalid token'))
        req.user = user;
        
        
        next()
    } catch(err) {
        catchErr(res,err);
    }
}

// Forgot password
exports.forgotPassword = async (req,res,next) => {
    try {
        // Get email
        const { email } = req.body;
        if(!email) return next(new Error('Please provide a valid email'))

        // Check existence of user
        const user = await User.findOne({email})
        if(!user) return next(new Error('Invalid email'))
        
        // Create password reset token and it's expiration time
        const resetToken = user.createPasswordResetToken()

        await user.save({ validateBeforeSave:false })

        const resetUrl = `${getUrl(req)}/accounts/resetPassword/${resetToken}`
        const message = `Forgot your password? click this url ${resetUrl}`
        // send through email
       try {
            await sendEmail({email: email,message: message})
       } catch(err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave:false })

            catchErr(res,err);
       }
        
        res.status(200).json({
            status: 'success',
            data: 'Email sent'
        })
    } catch(err) {
        

        catchErr(res,err);
    }
}

// Reset password

exports.resetPassword = async (req,res,next) => {
    try {
        const { password, confirmPassword } = req.body;
        if(!password || !confirmPassword) return next(new Error('Please provide valid password'))
        const token = req.params.token;
        
        // Check hashed token
        const hashToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({ passwordResetToken: hashToken,passwordResetExpires: {$gt: Date.now()}})
        if(!user) return next(new Error('User not found'))
        user.password = password;
        user.confirmPassword = confirmPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.save()

        const jwtToken = createJwt(user._id)

        res.status(200).json({
            status: 'success',
            jwtToken
        })

    } catch(err) {
        catchErr(res,err)
    }
}

