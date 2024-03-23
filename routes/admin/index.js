const express = require('express');
const Post = require('../../models/Post');
const router = express.Router();
const {faker} = require('@faker-js/faker')

router.all('/*', (req, re, next) => {
    req.app.locals.layout = 'admin'
    next();
})

router.get('/', (req, res) => {
    Post.countDocuments({}).then(postCount => {
        res.render('admin/index', {postCount: postCount})

    })
})


router.post('/generate-fake-posts', (req, res) => {
    for (let i = 0; i < req.body.amount; i++) {
        let post = new Post({
            title: faker.lorem.words(2),
            status: 'public',
            allowComments: faker.datatype.boolean(),
            body: faker.lorem.sentence(),
            slug : faker.name.title()
        });
               
        post.save().then(savedPost => {
            // console.log(savedPost)
            res.redirect('/admin/posts');
        }).catch(err => {console.log("could not save TEST", err)
    
        });
    }
});

module.exports = router;