const express = require("express");
const router = express.Router();
const Comment = require("../../models/Comment");
const Post = require("../../models/Post");
const { populate } = require("../../models/Category");

router.all("/*", (req, re, next) => {
  req.app.locals.layout = "admin";
  next();
});

router.get("/", (req, res) => {
  Comment.find({ user:  req.user.id })
    .populate("user")
    .lean()
    .then((comments) => {
      res.render("admin/comments", { comments: comments });
    });
});



router.post("/", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.body.id });
    if (req && req.user) {
      const newComment = new Comment({
        user: req.user.id,
        body: req.body.body,
      });
      post.comments.push(newComment);
      await Promise.all([post.save(), newComment.save()]);
      req.flash('success_msg', 'comment was updated successfully')
      res.redirect(`/post/${post._id}`);
    }
  } catch (error) {
    console.error("Error submitting comment:", error);
    res.status(500).send("Internal Server Error");
  }
});




router.delete("/:id", async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    const updatePost = await Post.findOneAndUpdate(
      { comments: req.params.id },
      { $pull: { comments: req.params.id } },
      { new: true }
    );
    res.redirect("/admin/comments");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});



router.post("/approve-comments", async (req, res) => {
  try {
    const result = await Comment.findByIdAndUpdate(req.body.id, {
      $set: { approveComment: req.body.approveComment },
    });
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
