const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Student = require("../models/Student");
const Class = require("../models/Class");
const Subject = require("../models/Subject");
const Attendance = require("../models/Attendance");
const { verifyToken } = require("../middlewares/auth");

// GET /api/students/:studentId/attendances
router.get("/:studentId/attendances", verifyToken, async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid studentId format" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Lấy tất cả bản ghi điểm danh qua mọi lớp, sắp xếp ngày mới nhất lên đầu
    const records = await Attendance.find({ studentId })
      .sort({ date: -1 })
      .populate({
        path: "classId",
        populate: { path: "subjectId" },
      });

    const history = records.map((r) => ({
      className: r.classId ? r.classId.className : null,
      subjectName:
        r.classId && r.classId.subjectId ? r.classId.subjectId.name : null,
      date: r.date,
      status: r.status,
    }));

    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
