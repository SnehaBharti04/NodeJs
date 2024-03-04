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



router.get('/edit/:id', (req, res) => {
    Category.findOne({_id: req.params.id}).lean().then((category) => {
        res.render('admin/categories/edit', {category: category})

    })
})



router.put('/edit/:id', (req, res) => {
    Category.findOne({_id: req.params.id}).then((category) => {
        category.name = req.body.name;
        category.save().then(savedCategory => {
            res.redirect('/admin/categories')

        })
    })
})


router.delete("/:id", (req, res) => {
    Category.findByIdAndDelete({_id: req.params.id})
      .then((category) => {
        res.redirect("/admin/categories");
      })
    })

// router.delete("/:id", (req, res) => {
//     Category.remove({_id: req.params.id})
//       .then((result) => {
//         res.redirect("/admin/categories");
//       }).catch(err => {
//         console.log(err)
//       })
//     })


module.exports = router;