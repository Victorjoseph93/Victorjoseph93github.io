const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher"
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
        }
    ],
    assignments: [
        {
            title: String,
            description: String,
            dueDate: Date,
            submissions: [
                {
                    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
                    fileUrl: { type: String },
                    submittedAt: { type: Date, default: Date.now }
                }
            ]
        }
    ]
});

module.exports = mongoose.model("Course", CourseSchema);

