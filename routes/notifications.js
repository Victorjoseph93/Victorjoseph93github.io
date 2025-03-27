const express = require("express");
const auth = require("../middleware/auth");
const Notification = require("../models/Notification");

const router = express.Router();

// Get all notifications for a user
router.get("/", auth, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Mark a notification as read
router.put("/read/:id", auth, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ msg: "Notification not found" });
        }

        notification.read = true;
        await notification.save();
        res.json({ msg: "Notification marked as read" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Create a new notification (e.g., for grade updates, assignments, attendance)
router.post("/", auth, async (req, res) => {
    const { user, message, type } = req.body;

    try {
        const notification = new Notification({ user, message, type });
        await notification.save();
        res.json(notification);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;

