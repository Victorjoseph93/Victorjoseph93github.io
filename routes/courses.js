const express = require("express");
const { authenticateUser } = require("../middleware/authMiddleware"); // ✅ Correct import
const Course = require("../models/Course");

const router = express.Router();

// ✅ Create a course (requires authentication)
router.post("/", authenticateUser, async (req, res) => {
    const { name, teacher } = req.body;

    try {
        const course = new Course({ name, teacher, students: [] });
        await course.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// ✅ Get all courses
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find().populate("teacher").populate("students");
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// ✅ Get paginated courses
router.get("/paginated", async (req, res) => {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;  // Default to page 1
    limit = parseInt(limit) || 10; // Default limit to 10

    try {
        const courses = await Course.find()
            .populate("teacher")
            .populate("students")
            .skip((page - 1) * limit)
            .limit(limit);
        
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router; // ✅ Ensure this line exists!

