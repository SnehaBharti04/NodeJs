const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const User = require("../../models/User");
const Category = require("../../models/Category");
const bcrypt = require("bcryptjs");

router.all("/*", (req, re, next) => {
  req.app.locals.layout = "home";
  next();
});

router.get("/about", (req, res) => {
  res.render("home/about");
});

router.post("/login", (req, res) => {
  res.send("home/login");
});


router.get("/login", (req, res) => {
  res.render("home/login");
});


router.get("/register", (req, res) => {
  res.render("home/register");
});

router.post("/register", (req, res) => {
  let errors = [];
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    //  passwordConfirm: req.body.passwordConfirm,
  });

  if (!req.body.firstName) {
    errors.push({ message: " Please add firstName" });
    // if we want to apply validation for length then too we can do that
  }
  if (!req.body.lastName) {
    errors.push({ message: " Please add lastName" });
  }
  if (!req.body.email) {
    errors.push({ message: " Please add email" });
  }
  if (!req.body.password) {
    errors.push({ message: " Please add Password" });
  }
  if (!req.body.passwordConfirm) {
    errors.push({ message: " Please add Password" });
  }
  if (!req.body.password !== !req.body.passwordConfirm) {
    errors.push({ message: "Passwords field don't match" });
  }

  if (errors.length > 0) {
    res.render("home/register", {
      errors: errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });
  } else {
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save().then((savedUser) => {
              req.flash("success_msg", " your are successful");
              res.redirect("/login");
            });
          });
        });
      }
      else {
         req.flash('error_msg', "email exist already plz login")
         res.redirect('/login')
      }
    });
  }
});

router.get("/", (req, res) => {
  Post.find({})
    .lean()
    .then((posts) => {
      Category.find({}).then((categories) => {
        res.render("home/index", { posts: posts, categories: categories });
      });
    });
});

router.get("/post/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .lean()
    .then((post) => {
      Category.find({})
        .lean()
        .then((categories) => {
          res.render("home/post", { post: post, categories: categories });
        });
    });
});

module.exports = router;
