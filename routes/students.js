var express = require("express");
var router = express.Router();

const MongooseStudentModel = require('../models/student')

router.get('/students', (req, res) => {
    MongooseStudentModel.find({}, (err, data) => {
        if (err) res.send(err);
        res.json(data);
    });
});

// get single student
router.get("/students/:id", function(req, res, next) {
    MongooseStudentModel.findById(req.params.id, (err, data) => {
        if (err) res.send(err);
        res.json(data);
    });
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
            res.json(data);
        });
    }
});

// delete student
router.delete("/students/:id", function(req, res, next) {
    MongooseStudentModel.findOneAndRemove({ _id: req.params.id }, (err, data) => {
        if (err) res.send(err);
        res.json({ message: 'Successfully deleted student!'});
    });
});

// edit student
router.put("/students/:id", function(req, res, next) {
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
        changedStudent.StartDate = student.StartDate;
    }

    if (!changedStudent) {
        res.status(400);
        res.json({"error": "Bad Data"})        
    } else {
        MongooseStudentModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, 
            (err, data) => {
                if (err) res.send(err);
                res.json(data);
            }
        );
    }
});

module.exports = router;
