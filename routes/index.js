var express = require("express");
var router = express.Router();
const MongooseStudentModel = require('../models/student')

// get home page
router.get('/', ensureAuthenticated, function(req, res) {
    res.render('index');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        MongooseStudentModel.find({}, (err, data) => {
            if (err) res.send(err);
            res.render("index", { 
                title: "List Students",
                jsonData: data
            });
        });
    } else {
        req.flash('error_msg', "You are not logged in");
        res.redirect('/users/login');
    }
}

// list all students
// router.get("/", (req, res, next) => {
//     MongooseStudentModel.find({}, (err, data) => {
//         if (err) res.send(err);
//         res.render("index", { 
//             title: "List Students",
//             jsonData: data
//         });          
//     });
// });

// display create student form
router.get("/create", (req, res, next) => {
    res.render("create", { title: "Add a student" });
});

// create student
router.post("/students", function(req, res, next) {
    var student = req.body;
    if (!student.StartDate) {
        student.StartDate = new Date();
    }

    if (!student.FirstName || !student.LastName
        || !student.School)  {
        res.status(400);
        res.json(
            {"error": "Bad data, could not be inserted into the database."}
        )
    } else {
        let newStudent = new MongooseStudentModel(student);
        newStudent.save((err, data) => {
            if (err) res.send(err);
            res.redirect("/");
        });
    }
});

// display the delete confirmation page
router.get("/delete/:id", (req, res, next) => {
    MongooseStudentModel.findById(req.params.id, (err, data) => {
        if (err) res.send(err);
        var jsonObj = { 
            title: "Delete a student",
            jsonData: data
        };
        res.render("delete",jsonObj);
    });
});

// delete student
router.post("/delete", function(req, res, next) {
    var student = req.body;

    MongooseStudentModel.findOneAndRemove({ _id: student._id }, (err, data) => {
        if (err) res.send(err);
        res.redirect("/");
    });
});

// display edit student form
router.get("/edit/:id", (req, res, next) => {
    MongooseStudentModel.findById(req.params.id, (err, data) => {
        if (err) res.send(err);
        var jsonObj = { 
            title: "Edit a student",
            jsonData: data
        };
        res.render("edit",jsonObj);
    });
});

// edit student
router.post("/edit", function(req, res, next) {
    var student = req.body;
    var changedStudent = {};

    if (student.FirstName) {
        changedStudent.FirstName = student.FirstName;
    }

    if (student.LastName) {
        changedStudent.LastName = student.LastName;
    }

    if (student.School) {
        changedStudent.School = student.School;
    }

    if (student.StartDate) {
        changedStudent.StartDate = new Date(student.StartDate);
    }

    if (!changedStudent) {
        res.status(400);
        res.json(
            {"error": "Bad Data"}
        )        
    } else {
        MongooseStudentModel.findOneAndUpdate({ _id: student._id }, req.body, { new: true }, 
            (err, data) => {
                if (err) res.send(err);
                res.redirect("/");
            }
        );
    }
});

// Generate dummydata
router.get("/dummydata", (req, res, next) => {
    var data = [
        {
        "FirstName":"Sally",
        "LastName":"Baker",
        "School":"Mining",
        "StartDate": new Date("2012-02-20T08:30:00")
        },{
        "FirstName":"Jason",
        "LastName":"Plumber",
        "School":"Engineering",
        "StartDate": new Date("2018-03-17T17:32:00")
        },{
        "FirstName":"Sue",
        "LastName":"Gardner",
        "School":"Political Science",
        "StartDate": new Date("2014-06-20T08:30:00")
    },{
        "FirstName":"Linda",
        "LastName":"Farmer",
        "School":"Agriculture",
        "StartDate": new Date("2014-06-20T08:30:00")
        },{
        "FirstName":"Fred",
        "LastName":"Fisher",
        "School":"Environmental Sciences",
        "StartDate": new Date("2017-10-16T17:32:00")
        }
    ];

    MongooseStudentModel.collection.insert(data, function (err, docs) { 
        if (err){  
            return console.error(err); 
        } else { 
          console.log("Multiple documents inserted to students collection"); 
        } 
    });
    res.redirect("/");
});

module.exports = router;
