const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/Category");

router.all("/*", (req, re, next) => {
  req.app.locals.layout = "home";
  next();
});

router.get("/", (req, res) => {
  Post.find({})
    .lean()
    .then((posts) => {
      Category.find({}).then(categories => {
        res.render("home/index", { posts: posts, categories:categories });

      })
    });
});

router.get("/post/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .lean()
    .then((post) => {
      Category.find({}).lean().then((categories) => {
      res.render("home/post", { post: post , categories: categories});
      })
    });
});

router.get("/about", (req, res) => {
  res.render("home/about");
});

router.get("/login", (req, res) => {
  res.render("home/login");
});

router.get("/register", (req, res) => {
  res.render("home/register");
});

module.exports = router;
