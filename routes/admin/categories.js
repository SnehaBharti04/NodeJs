const express = require('express');
const Category = require('../../models/Category');
const router = express.Router();

router.all('/*', (req, re, next) => {
    req.app.locals.layout = 'admin'
    next();
})

router.get('/', (req, res) => {
    Category.find({}).lean().then((categories) => {
        res.render('admin/categories/index', {categories: categories})

    })
})


router.post('/create', (req, res) => {
    const newCategory = Category({
        name : req.body.name
    })
    newCategory.save().then(savedCategory => {
        console.log("Saved Category in db", savedCategory)
        res.redirect('/admin/categories')
    }).catch((err) => {
        console.log("Error occ ", err)
    })
})

module.exports = router;