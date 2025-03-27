const express = require("express");
const { authenticateUser } = require("../middleware/authMiddleware"); // ✅ Correct import
const Notification = require("../models/Notification");

const router = express.Router();

// ✅ Get all notifications for a user
router.get("/", authenticateUser, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        console.error("Error fetching notifications:", err.message);
        res.status(500).send("Server Error");
    }
});

// ✅ Mark a notification as read
router.put("/read/:id", authenticateUser, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ msg: "Notification not found" });
        }

        notification.isRead = true; // ✅ Fixed property name (was `read`, should be `isRead`)
        await notification.save();
        res.json({ msg: "Notification marked as read" });
    } catch (err) {
        console.error("Error updating notification:", err.message);
        res.status(500).send("Server Error");
    }
});

// ✅ Create a new notification
router.post("/", authenticateUser, async (req, res) => {
    const { message } = req.body;

    try {
        const newNotification = new Notification({
            user: req.user.id,
            message,
            isRead: false,
        });

        await newNotification.save();
        res.json(newNotification);
    } catch (err) {
        console.error("Error creating notification:", err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;

