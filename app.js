const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const upload = require("express-fileupload");
const flash = require("connect-flash");
const session = require("express-session");
const {mongoDbURL} = require('./config/database')
const passport = require('passport')

// install handlebars/allow-prototype-access add lean() bw find and then

mongoose
  .connect(mongoDbURL)
  .then((db) => {
    console.log("Mongo Connected");
  })
  .catch((err) => console.log("TESTING Could not connect to database", err));
// middleware
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended : true}))

app.use(express.static(path.join(__dirname, "public")));

const { select, generateDate, paginate } = require("./helpers/handlebars-helpers");

// set view engine
app.engine(
  "handlebars",
  exphbs.engine({ defaultLayout: "home", helpers: { select: select, generateDate: generateDate, paginate: paginate } })
);
app.set("view engine", "handlebars");

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// upload middleware
app.use(upload());

//method override
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "sneha",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());






// local variables using middleware
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.form_errors = req.flash("form_errors");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});



// passport
app.use(passport.initialize());
app.use(passport.session());



//load routes
const home = require("./routes/home/index");
const admin = require("./routes/admin/index");
const posts = require("./routes/admin/posts");
const categories = require('./routes/admin/categories'); 
const comments = require('./routes/admin/comments'); 

//use routes
app.use("/", home);
app.use("/admin", admin);
app.use("/admin/posts", posts);
app.use("/admin/categories", categories);
app.use("/admin/comments", comments);



app.listen("4000", () => {
  console.log("Connected to server ");
});
