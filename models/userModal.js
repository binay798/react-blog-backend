const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true,'Must provide Fullname']
    },
    username: {
        type: String,
        required: [true,'Must provide a username'],
        unique: true

    },
    email: {
        type: String,
        required: [true,'Must provide a valid email'],
        unique: true
    },
    photo: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    mobile: Number,
    password: {
        type: String,
        required: [true,'Provide a password'],
        minlength: 6,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true,'Must provide confirm Password'],
        minlength: 6,
        validate: {
            validator: function(el) {
                return el === this.password
            },
            message: 'Password is not same'
        }
    },
    age: Number,
    passwordResetToken: String,
    passwordResetExpires: Date
})

// Hash password
userSchema.pre('save',async function(next) {
    if(!this.isModified('password')) return next();
    const hashed = await bcrypt.hash(this.password,12);
    this.password = hashed;
    this.confirmPassword = undefined;
    next()

})


// Compare password
userSchema.methods.comparePassword = async function(candidatePassword,userPassword) {
    const decodedPassword = await bcrypt.compare(candidatePassword,userPassword)
    return decodedPassword
}

// Create password reset token
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + (10 * 60 * 1000);
    return resetToken
}





const User = new mongoose.model('User',userSchema)

module.exports = User;