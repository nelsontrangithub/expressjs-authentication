var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var index = require("./routes");
var students = require("./routes/students");
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
var ejsEngine = require("ejs-locals");
app.engine("ejs", ejsEngine);           // support master pages
app.set("view engine", "ejs");          // ejs view engine

// Set static folder
app.use(express.static(path.join(__dirname, "client")));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use("/", index);
app.use("/api", students);

app.listen(port, function() {
    console.log("Server started on port: " + port);
    console.log("Using mongo database on server: " + db_server);
});
