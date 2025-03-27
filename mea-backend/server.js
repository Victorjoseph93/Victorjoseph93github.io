// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load environment variables

// Initialize Express app
const app = express();

// Middleware to handle JSON requests
app.use(express.json());
app.use(cors());

// Default Route
app.get("/", (req, res) => {
    res.send("Welcome to the M.E.A Backend API");
});

// Get MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("❌  MONGO_URI is not defined. Check your .env file.");
    process.exit(1);
}

// Connect to MongoDB (REMOVE deprecated options)
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅  Connected to MongoDB"))
    .catch(err => {
        console.error("❌  MongoDB connection error:", err);
        process.exit(1);
    });

// Set the port
const PORT = process.env.PORT || 9000;

// Check if the port is free before starting the server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
app.use("/api/auth", require("./routes/auth"))
app.use("/api/students", require("./routes/students"));
app.use("/api/teachers", require("./routes/teachers"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/assignments", require("./routes/assignments"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/auth", require("./routes/auth"));
const redis = require("redis");
const client = redis.createClient();

client.on("error", (err) => console.error("Redis Error:", err));
client.connect();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 10  // Maintain up to 10 connections
}).then(() => console.log("MongoDB Connected"))
.catch(err => console.error("DB Connection Error:", err));
const userRole = localStorage.getItem("role"); // Retrieve role from local storage

// Hide admin-only features if the user is not an admin
if (userRole !== "admin") {
    document.getElementById("adminPanel").style.display = "none";
}

// Hide teacher-only features if the user is not a teacher
if (userRole !== "teacher" && userRole !== "admin") {
    document.getElementById("teacherFeatures").style.display = "none";
}
async function updateNotificationCount() {
    const token = localStorage.getItem("token");
    const response = await fetch("/notifications/my-notifications", {
        headers: { "Authorization": token }
    });
    const notifications = await response.json();
    const unreadCount = notifications.filter(n => !n.read).length;

    document.getElementById("notification-badge").innerText = unreadCount || "";
}

// Run function when page loads
updateNotificationCount();
<li><a href="notifications.html">Notifications <span id="notification-badge"></span></a></li>
const io = require("socket.io")(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendNotification", async ({ recipientId, message }) => {
        const notification = new Notification({ sender: socket.userId, recipient: recipientId, message });
        await notification.save();

        io.to(recipientId).emit("newNotification", notification);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, index: true }, // Adding index
});
Optimize Database Queries
Use .select() to only fetch necessary fields.
	const user = await User.findById(req.user._id).select("name email");
const redis = require("redis");
const client = redis.createClient();

async function getCachedData(key, fetchFunction) {
    const cached = await client.get(key);
    if (cached) return JSON.parse(cached);

    const data = await fetchFunction();
    await client.set(key, JSON.stringify(data), { EX: 3600 }); // Cache for 1 hour
    return data;
}

