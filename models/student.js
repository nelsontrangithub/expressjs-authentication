// grab the things we need
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
const studentSchema = new Schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    School: {
        type: String,
        required: true},
    StartDate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("Student", studentSchema);
