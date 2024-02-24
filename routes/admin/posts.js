const express = require('express')
const router = express.Router()
const Post = require("../../models/Post")


router.all('/*', (req, res, next) => {

    res.app.locals.layout = 'admin';
    next()
});

// install handlebars/allow-prototype-access add lean() bw find and then
router.get('/', (req, res) => {
    Post.find({}).lean().then(posts => {

        res.render('admin/posts', {posts : posts});

    });

});

router.get('/create', (req, res) => {
    res.render('admin/posts/create');
})


router.post('/create', (req, res) => {


//     let allowComments = true;
//     if(req.body.allowComments) {
//         allowComments = true;
//     } else {
//         allowComments = false;
//     }
//   const newPost =  Post({
//         title : req.body.title,
//         status : req.body.status,
//         allowComments : allowComments,
//         body : req.body.body,
//     })

//     newPost.save().then(savedPost => {
//         console.log(savedPost)
//         res.redirect('/admin/posts');
//     }).catch(err => {console.log("could not save", err)

//})
    console.log(req.files)
})


router.get('/edit/:id', (req, res) => {
    Post.findOne({_id: req.params.id}).lean().then(post => {

        res.render('admin/posts/edit', {post : post});

    });

})


router.put('/edit/:id', (req, res) => {

    Post.findOne({_id: req.params.id}).lean()
    .then(post => {
        if(req.body.allowComments) {
            allowComments =true;
        }
        else {
            allowComments = false
        }
        post.title = req.body.title
        post.status = req.body.status
        post.allowComments = req.body.allowComments
        post.body = req.body.body;

        post.save().then(updatedPost => {
            res.render('admin/posts');

        })

    });
})

router.delete('/:id', (req, res) => {
    Post.deleteOne({_id: req.params.id})
    .then(result => {
        res.redirect('/admin/posts')
    })
})

module.exports = router