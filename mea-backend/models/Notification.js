const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Grade Update", "Assignment Due", "Attendance Alert", "Announcement"],
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Notification", NotificationSchema);
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Teacher/Admin who sent the notification
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Student/Admin receiving the notification
    message: { type: String, required: true },
    dateSent: { type: Date, default: Date.now },
    read: { type: Boolean, default: false } // Mark as read/unread
});

module.exports = mongoose.model("Notification", NotificationSchema);
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

// Send a notification (Only teachers and admins)
router.post("/send", authenticateUser, authorizeRoles("teacher", "admin"), async (req, res) => {
    const { recipientId, message } = req.body;

    try {
        const notification = new Notification({ sender: req.user._id, recipient: recipientId, message });
        await notification.save();
        res.json({ message: "Notification sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error sending notification" });
    }
});

// Get notifications for the logged-in user
router.get("/my-notifications", authenticateUser, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id }).sort({ dateSent: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
});

// Mark notification as read
router.put("/mark-as-read/:id", authenticateUser, async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error updating notification" });
    }
});

module.exports = router;
<script src="/socket.io/socket.io.js"></script>
<script>
    const socket = io();

    socket.on("newNotification", (notification) => {
        alert(`New Notification: ${notification.message}`);
        fetchNotifications(); // Refresh notifications
    });
</script>

