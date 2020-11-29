const express = require('express');
const User = require('./../models/userModal')
const authController = require('./../controllers/authController');
const userController =require('./../controllers/userController')
const router = express.Router();


// test get user
const getUser = async(req,res) => {
    const user = await User.find();
    res.json({
        status:'success',
        user
    })
}

router.get('/',authController.protectRoutes,getUser)
router.get('/getUser/:id',userController.getUser)
router.post('/updateUser/:id',authController.protectRoutes,userController.updateUser)

router.post('/signup',authController.signup)
router.post('/login',authController.login);
router.post('/loginThroughToken',authController.loginThroughToken)
router.post('/forgotPassword',authController.forgotPassword)
router.post('/resetPassword/:token',authController.resetPassword)

// Change profile photo
router.post('/changeProfilePic',
    authController.protectRoutes,
    userController.upload.single('file'),
    userController.updateProfile)

// Change password

// Edit profile



module.exports = router