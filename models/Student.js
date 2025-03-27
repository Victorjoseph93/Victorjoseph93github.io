const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }
    ],
    attendance: [
        {
            date: { type: Date, default: Date.now },
            status: { type: String, enum: ["Present", "Absent"], default: "Absent" }
        }
    ],
    assignments: [
        {
            course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
            fileUrl: { type: String, required: true }, // URL of submitted assignment
            submittedAt: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model("Student", StudentSchema);

