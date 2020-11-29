const multer = require('multer')
const router = require('../routes/userRoutes');
const Post = require('./../models/postModal');
const getUrl = require('./../utils/getUrl')
const catchErr = (res,err) => {
    return res.status(404).json({
        status: 'fail',
        message: err.message
    })
}


exports.getAllPosts = async(req,res,next) => {
    try {
        const queryObj = {...req.query};
        const excludedFields = ['page','sort','limit','fields']
        // delete the excluded fields
        excludedFields.forEach(el => delete queryObj[el])
        let query =  Post.find(queryObj);

        // if sort exists 
        if(req.query.sort) {
            let sortBy = req.query.sort.split(',').join(' ');
            console.log(sortBy)
            query = query.sort(sortBy)
        }else {
            query = query.sort('-createdAt')
        }

        // if fields exists
        if(req.query.fields) {
            let fieldsObj = req.query.fields.split(',').join(' ')
            query = query.select(fieldsObj)
        }else {
            query = query.select('-__v')
        }

        // pagination
        
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 10;
        const result = (page - 1) * limit
        // console.log(res,limit)
        query = query.skip(result).limit(limit)

        
        const posts = await query;

        res.status(200).json({
            status: 'success',
            results:posts.length ,
            posts
        })
    } catch(err) {
        catchErr(res,err)
    }
}

exports.getPost = async(req,res,next) => {
    try {
        const post = await Post.findById(req.params.id)

        res.status(200).json({
            status: 'success',
            post
        })
    } catch(err) {
        catchErr(res,err)
    }
}

const storage = multer.diskStorage({
    destination: (req,err,cb) => {
        // console.log('photourl filename')
        cb(null,'public/images')
    },
    filename: (req,file,cb) => {
        const fileName = `${Date.now()}-${file.originalname}` ;
        const photoUrl = `${getUrl(req)}/static/images/${fileName}`;
        req.photoUrl = photoUrl;
        cb(null,fileName)
    },
    onError: (err,next) => {
        console.log('multer error')
        return next(new Error('Upload failed'))
    }
})

exports.upload = multer({
    storage: storage
})

exports.createPost = async(req,res,next) => {
    try {
        const {title,description,category,author} = req.body;
        let photo = req.photoUrl;
        const post = await Post.create({
            title,description,photo,category,author
        })

        res.status(200).json({
            status: 'success',
            post
        })
    } catch(err) {
        catchErr(res,err)
    }
}

exports.updatePost = async(req,res,next) => {
    try {
        if(req.body.photo) return next(new Error('Cannot update photo'))
        const post = await Post.findByIdAndUpdate(req.params.id,req.body)

        res.status(200).json({
            status: 'success',
            post
        })
    } catch(err) {
        catchErr(res,err)
    }
}