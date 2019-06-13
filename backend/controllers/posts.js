const Post = require('../models/post');

exports.createpost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title : req.body.title,
    content : req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save()
    .then(createdPost => {
      res.status(201).json({
        message : 'Post added successfully',
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    })
    .catch(error => {
      res.statuts(500).json({
        message: "Post creation failed"
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({_id: req.params.id, creator: req.userData.userId }, post).then(result => {
    if( result.n > 0 ){
      res.status(200).json({message: 'Update Succesful'});
    }
    else{
      res.status(401).json({message: 'User not athorized'});
    }

  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update post!"
    });
  });
};


exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if( pageSize && currentPage){
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    }).then(count => {
      res.status(200).json({
        message: "Posts fetched Successfully!",
        posts: fetchedPosts,
        maxPosts: count
      })
    })
    .catch( error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post =>{
    if(post){
      res.status(200).json(post);
    }
    else{
      res.status(404).json({message: 'Post Not Found'});
    }
  })
  .catch( error => {
    res.status(500).json({
      message: "Fetching posts failed!"
    });
  });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id : req.params.id, creator: req.userData.userId })
    .then( result => {
      if( result.n > 0 ){
        res.status(200).json({ message : "Post Deleted"});
      }
      else{
        res.status(401).json({ message : "User not authorized"});
      }
    })
    .catch( err => {
      res.status(500).json({ message : "Fetching posts failed!"});
    })
};
