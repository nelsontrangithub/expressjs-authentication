var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var cookieParser = require('cookie-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var index = require("./routes");
var students = require("./routes/students");
var users = require('./routes/users');

var dotenv = require('dotenv');
var path = require("path");

var app = express();

// Environment variables
let confPath = path.join(__dirname,'.env' );
dotenv.config({ path: confPath });
var port = process.env.PORT || 3000;
var db_server = process.env.DB_SERVER || "localhost";

mongoose.connect("mongodb://" + db_server + "/school", function (err) {
   if (err) throw err;
   console.log('Successfully connected');
});

// View engine
// var ejsEngine = require("ejs-locals");
// app.engine("ejs", ejsEngine);           // support master pages
// app.set("view engine", "ejs");          // ejs view engine
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// Set static folder
app.use(express.static(path.join(__dirname, "client")));

// express session
app.use(session({
    secret: 'secret',
    saveUnititialized: true,
    resave: true
}));

// passport initialization
app.use(passport.initialize());
app.use(passport.session());

// express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.');
        var root = namespace.shift();
        var formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}));

// connect flash middleware
app.use(flash());

// global vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use("/", index);
app.use("/api", students);
app.use('/users', users);

app.listen(port, function() {
    console.log("Server started on port: " + port);
    console.log("Using mongo database on server: " + db_server);
});
