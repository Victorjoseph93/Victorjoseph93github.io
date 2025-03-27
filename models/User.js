const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true }, // Indexed
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher", "admin"], required: true, index: true }, // Indexed
    createdAt: { type: Date, default: Date.now }
});

// Export the model correctly
module.exports = mongoose.model("User", UserSchema);
