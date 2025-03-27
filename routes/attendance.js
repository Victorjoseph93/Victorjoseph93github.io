const express = require("express");
const auth = require("../middleware/auth");
const Student = require("../models/Student");

const router = express.Router();

// Student marks their own attendance
router.post("/mark", auth, async (req, res) => {
    try {
        let student = await Student.findOne({ user: req.user.id });

        if (!student) {
            return res.status(400).json({ msg: "Student profile not found" });
        }

        // Mark attendance for today
        student.attendance.push({ date: new Date(), status: "Present" });
        await student.save();

        res.json({ msg: "Attendance marked successfully", student });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Get attendance for a specific student
router.get("/:studentId", auth, async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId).populate("user");

        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }

        res.json(student.attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;

