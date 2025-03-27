const express = require("express");
const { authenticateUser } = require("../middleware/authMiddleware"); //  Correct import
const Student = require("../models/Student");

const router = express.Router();

// Correct usage of `authenticateUser`
router.get("/me", authenticateUser, async (req, res) => {
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

module.exports = router;

