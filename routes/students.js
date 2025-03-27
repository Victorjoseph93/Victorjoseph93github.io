const express = require("express");
const auth = require("../middleware/auth");
const Student = require("../models/Student");
const User = require("../models/User");

const router = express.Router();

// Get student profile
router.get("/me", auth, async (req, res) => {
    try {
        const student = await Student.findOne({ user: req.user.id }).populate("courses");

        if (!student) {
            return res.status(400).json({ msg: "Student profile not found" });
        }

        res.json(student);
    } catch (err) {
        console.error("Error fetching student profile:", err.message);
        res.status(500).send("Server Error");
    }
});

// Enroll in a course
router.post("/enroll/:courseId", auth, async (req, res) => {
    try {
        let student = await Student.findOne({ user: req.user.id });

        // Create a student profile if it doesn't exist
        if (!student) {
            student = new Student({ user: req.user.id, courses: [] });
        }

        // Check if student is already enrolled
        if (student.courses.includes(req.params.courseId)) {
            return res.status(400).json({ msg: "Already enrolled in this course" });
        }

        // Enroll the student
        student.courses.push(req.params.courseId);
        await student.save();

        res.json({ msg: "Enrollment successful", student });
    } catch (err) {
        console.error("Error enrolling student:", err.message);
        res.status(500).send("Server Error");
    }
});

// ✅ Export the router
module.exports = router;
