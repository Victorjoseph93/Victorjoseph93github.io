const express = require("express");
const auth = require("../middleware/auth");
const Teacher = require("../models/Teacher");

const router = express.Router();

// Get teacher profile
router.get("/me", auth, async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ user: req.user.id }).populate("courses");
        if (!teacher) {
            return res.status(400).json({ msg: "Teacher profile not found" });
        }
        res.json(teacher);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Assign a teacher to a course
router.post("/assign/:courseId", auth, async (req, res) => {
    try {
        let teacher = await Teacher.findOne({ user: req.user.id });
        if (!teacher) {
            teacher = new Teacher({ user: req.user.id, courses: [] });
        }

        if (teacher.courses.includes(req.params.courseId)) {
            return res.status(400).json({ msg: "Already assigned to this course" });
        }

        teacher.courses.push(req.params.courseId);
        await teacher.save();
        res.json(teacher);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
