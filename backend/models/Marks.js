
const mongoose = require("mongoose");

const marksSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    studentName: {
        type: String,
        required: true
    },

    subject: {
        type: String,
        required: true
    },

    exam: {
        type: String,
        required: true
    },

    marksObtained: {
        type: Number,
        required: true,
        min: 0
    },

    totalMarks: {
        type: Number,
        required: true,
        min: 1
    },

    date: {
        type: String,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Marks", marksSchema);
