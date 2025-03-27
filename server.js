// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const redis = require("redis");
require("dotenv").config(); // Load environment variables

// Initialize Express app
const app = express();
const server = http.createServer(app); // Required for socket.io

// Middleware
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

// Connect to MongoDB (Ensuring a single connection)
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅  Connected to MongoDB"))
    .catch(err => {
        console.error("❌  MongoDB connection error:", err);
        process.exit(1);
    });

// Redis Client
const redisClient = redis.createClient();
redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient.connect();

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/students", require("./routes/students"));
app.use("/api/teachers", require("./routes/teachers"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/assignments", require("./routes/assignments"));
app.use("/api/notifications", require("./routes/notifications"));

// Socket.io Setup
const io = socketIo(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendNotification", async ({ recipientId, message }) => {
        // Save notification to DB (assuming Notification model exists)
        const Notification = require("./models/Notification");
        const notification = new Notification({ sender: socket.userId, recipient: recipientId, message });
        await notification.save();

        io.to(recipientId).emit("newNotification", notification);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Port Configuration
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
