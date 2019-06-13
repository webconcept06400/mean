const express = require('express');

const checkAuth = require('../middleware/check-auth');

const extractFile = require('../middleware/file')

const postController = require('../controllers/posts');

const router = express.Router();

router.post('', checkAuth, extractFile, postController.createpost);

router.put('/:id',checkAuth , extractFile, postController.updatePost);

router.get('', postController.getPosts);

router.get('/:id', postController.getPost);

router.delete('/:id', checkAuth, postController.deletePost);

module.exports = router;
