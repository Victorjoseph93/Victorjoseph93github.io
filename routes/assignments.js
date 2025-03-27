const express = require("express");
const auth = require("../middleware/auth");
const Student = require("../models/Student");
const Course = require("../models/Course");

const router = express.Router();

// Submit an assignment
router.post("/submit/:courseId", auth, async (req, res) => {
    const { fileUrl } = req.body;

    if (!fileUrl) {
        return res.status(400).json({ msg: "Assignment file is required" });
    }

    try {
        let student = await Student.findOne({ user: req.user.id });

        if (!student) {
            return res.status(400).json({ msg: "Student profile not found" });
        }

        let course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ msg: "Course not found" });
        }

        // Save the submission under both student and course
        student.assignments.push({ course: req.params.courseId, fileUrl });
        course.assignments.forEach((assignment) => {
            assignment.submissions.push({ student: student._id, fileUrl });
        });

        await student.save();
        await course.save();

        res.json({ msg: "Assignment submitted successfully", student });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Teacher views all submissions for a course
router.get("/submissions/:courseId", auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate("assignments.submissions.student");

        if (!course) {
            return res.status(404).json({ msg: "Course not found" });
        }

        res.json(course.assignments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
