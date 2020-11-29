const express = require('express');
const postController = require('./../controllers/postController');
const authController = require('./../controllers/authController');
const router = express.Router();
// console.log(postController)
router.route('/')
    .get(postController.getAllPosts)
router.post('/',
    authController.protectRoutes,
    postController.upload.single('file'),
    postController.createPost)

router.route('/:id').patch(authController.protectRoutes,postController.updatePost).get(postController.getPost)
module.exports = router;