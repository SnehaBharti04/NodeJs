const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const { isEmpty, uploadDir } = require("../../helpers/upload-helper");
const fs = require("fs");
const path = require("path");
const flash = require("connect-flash");
const { error } = require("console");

router.all("/*", (req, res, next) => {
  res.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  Post.find({})
    .lean()
    .then((posts) => {
      res.render("admin/posts", { posts: posts });
    });
});

router.get("/create", (req, res) => {
  res.render("admin/posts/create");
});

router.post("/create", (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ message: " Please add title" });
    // if we want to apply validation for length then too we can do that
  }
  if (!req.body.body) {
    errors.push({ message: " Please add description" });
  }
  if (errors.length > 0) {
    res.render("admin/posts/create", {
      errors: errors,
    });
  } else {
    let filename = "Screenshot (22).png";
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No files were uploaded.");
    } else {
      // Process uploaded files
      let file = req.files.file;
      filename = Date.now() + "_" + file.name;
      file.mv("./public/uploads/" + filename, (err) => {
        if (err) throw err;
      });
    }

    let allowComments = true;
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }
    const newPost = Post({
      title: req.body.title,
      status: req.body.status,
      allowComments: allowComments,
      body: req.body.body,
      file: filename,
    });

    newPost.save().then((savedPost) => {
      req.flash('success_msg', 'Post was deleted successfully' + savedPost.title)
            res.redirect("/admin/posts");
        })
        .catch((err) => {
          console.log("could not save", err);
        });
    }
  });



router.get("/edit/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .lean()
    .then((post) => {
      res.render("admin/posts/edit", { post: post });
    });
});



router.put("/edit/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .lean()
    .then((post) => {
      if (req.body.allowComments) {
        allowComments = true;
      } else {
        allowComments = false;
      }
      post.title = req.body.title;
      post.status = req.body.status;
      post.allowComments = req.body.allowComments;
      post.body = req.body.body;

      post.save().then((updatedPost) => {
        res.render("admin/posts");
      });
    });
});



router.delete("/:id", (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(404).send("Post not found");
      }
      fs.unlink(uploadDir + post.file, (err) => {
        if (err) {
          console.log("Error deleting image:", err);
        }
        res.redirect("/admin/posts");
      });
    })
    .catch((err) => {
      console.log("Error:", err);
      res.status(500).send("Internal Server Error");
    });
});

// router.delete("/:id", (req, res) => {
//   Post.findOne({ _id: req.params.id })
//   .then(post => {
//     fs.unlink(uploadDir + post.file, (err) => {
//       post.deleteOne();
//       //req.flash('success-message', 'Post was deleted successfully')
//       res.redirect("/admin/posts");
//     })

// })
//});

module.exports = router;
