const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// Register Route
router.post(
    "/register",
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
        check("role", "Role must be either 'student' or 'teacher'").isIn(["student", "teacher"])
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, role } = req.body;

        try {
            // Check if user already exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: "User already exists" });
            }

            // Create new user instance
            user = new User({ name, email, password, role });

            // Hash password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            // Save user to database
            await user.save();

            // Generate JWT token
            const payload = { user: { id: user.id, role: user.role } };
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });

        } catch (err) {
            console.error("❌ Server Error:", err.message);
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;
