const express = require("express");
const auth = require("../middleware/auth");
const Course = require("../models/Course");

const router = express.Router();

// Create a course
router.post("/", auth, async (req, res) => {
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

// Get all courses
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find().populate("teacher").populate("students");
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
router.get("/", async (req, res) => {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;  // Default to page 1
    limit = parseInt(limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit;

    const courses = await Course.find().skip(skip).limit(limit);
    res.json({ page, limit, courses });
});
router.get("/", async (req, res) => {
    let cachedCourses = await client.get("courses");

    if (cachedCourses) {
        return res.json(JSON.parse(cachedCourses));  // Serve from cache
    }

    const courses = await Course.find();
    await client.set("courses", JSON.stringify(courses), { EX: 300 }); // Cache for 5 minutes
    res.json(courses);
});
router.post("/create", authenticateUser, authorizeRoles("admin"), async (req, res) => {
    try {
        // Course creation logic...
        res.json({ message: "Course created successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error creating course" });
    }
});

