const multer = require('multer');
const jwt = require('jsonwebtoken')
const User = require('./../models/userModal')

const getUrl = require('./../utils/getUrl')

const catchErr = (res,err) => {
    return res.status(404).json({
        status: 'fail',
        message: err.message
    })
}

const storage = multer.diskStorage({
    destination: (req,err,cb) => {
        cb(null,'public/images')
    },
    filename: (req,file,cb) => {
        const fileName = `${Date.now()}-${file.originalname}` ;
        const photoUrl = `${getUrl(req)}/static/images/${fileName}`;
        req.photoUrl = photoUrl;
        cb(null,fileName)
    },
    onError: (err,next) => {
        return next(new Error('Upload failed'))
    }
})

exports.upload = multer({
    storage: storage
})

exports.updateProfile = async (req,res,next) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id,{photo: req.photoUrl});
        
        res.json({
            status: 'success',
            data: 'uploaded'
        })

    } catch(err) {
        catchErr(res,err)
    }
}

exports.getUser = async(req,res,next) => {
    try {
        const userId = jwt.verify(req.params.id,process.env.JWT_SECRET_KEY)
        const user = await User.findById(userId.id)

        res.status(200).json({
            status: 'success',
            user
        })
    } catch(err) {
        catchErr(res,err)
    }
}

exports.updateUser = async(req,res,next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id,req.body);

        res.status(200).json({
            status: 'success',
            user
        })
    } catch(err) {
        catchErr(res,err)
    }
}