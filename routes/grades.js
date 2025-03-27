class GradeManager {
    constructor() {
        this.grades = [];
    }

    addGrade(studentId, subject, grade) {
        this.grades.push({ studentId, subject, grade });
    }

    updateGrade(studentId, subject, newGrade) {
        const gradeEntry = this.grades.find(g => g.studentId === studentId && g.subject === subject);
        if (gradeEntry) {
            gradeEntry.grade = newGrade;
        } else {
            console.log("Grade not found.");
        }
    }

    getGrades(studentId) {
        return this.grades.filter(g => g.studentId === studentId);
    }

    calculateAverage(studentId) {
        const studentGrades = this.getGrades(studentId);
        if (studentGrades.length === 0) return 0;
        
        const total = studentGrades.reduce((sum, g) => sum + g.grade, 0);
        return (total / studentGrades.length).toFixed(2);
    }
}

// Example Usage
const gradeManager = new GradeManager();
gradeManager.addGrade(1, "Math", 90);
gradeManager.addGrade(1, "Science", 85);
gradeManager.updateGrade(1, "Math", 95);
console.log(gradeManager.getGrades(1));
console.log("Average:", gradeManager.calculateAverage(1));
const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

router.post("/submit", authenticateUser, authorizeRoles("teacher", "admin"), async (req, res) => {
    try {
        // Grade submission logic here...
        res.json({ message: "Grade submitted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error submitting grade" });
    }
});

module.exports = router;
router.get("/my-grades", authenticateUser, authorizeRoles("student"), async (req, res) => {
    try {
        const grades = await Grade.find({ studentId: req.user._id });
        res.json(grades);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving grades" });
    }
});

