const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/Category");
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
    .populate('category')
    .lean()
    .then((posts) => {
      res.render("admin/posts", { posts: posts });
    });
});

router.get("/create", (req, res) => {
  Category.find({})
    .lean()
    .then((categories) => {
      res.render("admin/posts/create", { categories: categories });
    });
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
      file = req.files.file;
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
      category: req.body.category,
      file: filename,
    });

    newPost
      .save()
      .then((savedPost) => {
        req.flash(
          "success_msg",
          `Post ${savedPost.title} is Created successfully`
        );
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
      Category.find({})
        .lean()
        .then((categories) => {
          res.render("admin/posts/edit", {
            post: post,
            categories: categories,
          });
        });
    });
});

router.put("/edit/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (!post) {
        // Handle case where post is not found
        return res.status(404).send("Post not found");
      }

      // Update post fields
      post.title = req.body.title;
      post.status = req.body.status;
      post.allowComments = req.body.allowComments === "on"; // Convert to boolean
      post.body = req.body.body;
      post.category = req.body.category;

      let filename = "Screenshot (22).png";

      if (!req.files || Object.keys(req.files).length === 0) {
        console.log("No files were uploaded.");
      } else {
        // Process uploaded files
        const file = req.files.upload;
        filename = Date.now() + "_" + file.name;
        post.file = filename;
        file.mv("./public/uploads/" + filename, (err) => {
          if (err) throw err;
        });
      }

      // Save the updated post
      return post.save();
    })
    .then((updatedPost) => {
      req.flash("success_msg", "Post is successfully updated");
      res.redirect("/admin/posts");
    })
    .catch((error) => {
      console.error(error);
      req.flash("error_msg", "Failed to update post");
      res.redirect("/admin/posts");
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
        req.flash("success_msg", "Post was successfully deleted");
        res.redirect("/admin/posts");
      });
    })
    .catch((err) => {
      console.log("Error:", err);
      res.status(500).send("Internal Server Error");
    });
});

module.exports = router;
