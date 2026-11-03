const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Class = require("../models/Class");
const Attendance = require("../models/Attendance");
const { verifyToken } = require("../middlewares/auth");

// =========================================================================
// REQUIREMENT 2: GET /api/classes/:classId/students?status=enrolled
// (cũng hỗ trợ /student theo tiêu đề đề bài)
// =========================================================================
router.get(
  ["/:classId/students", "/:classId/student"],
  verifyToken,
  async (req, res) => {
    try {
      const { classId } = req.params;

      // Đề bài yêu cầu: If classId is not a valid ObjectId, return HTTP 400
      if (!mongoose.Types.ObjectId.isValid(classId)) {
        return res.status(400).json({ message: "Invalid classId format" });
      }

      const statusQuery = (req.query.status || "enrolled").toLowerCase();
      if (statusQuery !== "enrolled" && statusQuery !== "dropped") {
        return res
          .status(400)
          .json({ message: "Status must be enrolled or dropped" });
      }

      const classObj = await Class.findById(classId).populate(
        "enrollments.studentId",
      );
      if (!classObj) {
        return res.status(404).json({ message: "Class not found" });
      }

      const matchedStudents = classObj.enrollments
        .filter(
          (e) =>
            e.status && e.status.toLowerCase() === statusQuery && e.studentId,
        )
        .map((e) => ({
          studentId: e.studentId._id,
          studentCode: e.studentId.studentCode,
          fullName: e.studentId.fullName,
          email: e.studentId.email,
        }));

      return res.status(200).json(matchedStudents);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
);

// =========================================================================
// REQUIREMENT 3: GET /api/classes/:classId/attendance-summary
// =========================================================================
router.get("/:classId/attendance-summary", verifyToken, async (req, res) => {
  try {
    const { classId } = req.params;

    // Đề bài yêu cầu: return HTTP 300 if the ObjectId is invalid
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(300).json({ message: "Invalid classId format" });
    }

    const classObj = await Class.findById(classId).populate(
      "enrollments.studentId",
    );
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Chỉ tính thống kê cho sinh viên có status là ENROLLED
    const enrolledMembers = classObj.enrollments.filter(
      (e) => e.status && e.status.toLowerCase() === "enrolled" && e.studentId,
    );

    const summary = [];

    for (const item of enrolledMembers) {
      const student = item.studentId;

      const records = await Attendance.find({
        classId: classObj._id,
        studentId: student._id,
      });

      const totalSessions = records.length;
      const present = records.filter(
        (r) => r.status && r.status.toUpperCase() === "PRESENT",
      ).length;
      const absent = records.filter(
        (r) => r.status && r.status.toUpperCase() === "ABSENT",
      ).length;

      let attendanceRate = 0;
      let warning = true;

      if (totalSessions > 0) {
        // formula: present / totalSessions * 100, làm tròn 1 chữ số thập phân
        attendanceRate = Number(((present / totalSessions) * 100).toFixed(1));
        warning = attendanceRate < 80;
      }

      summary.push({
        studentId: student._id,
        studentCode: student.studentCode,
        fullName: student.fullName,
        totalSessions,
        present,
        absent,
        attendanceRate,
        warning,
      });
    }

    return res.status(200).json(summary);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// =========================================================================
// REQUIREMENT 5: POST /api/classes/:classId/attendances (Upsert nhiều bản ghi)
// (Theo mục 3.3, verifyToken chỉ áp dụng cho 3 endpoint GET; nên POST không bắt buộc token)
// =========================================================================
router.post("/:classId/attendances", async (req, res) => {
  try {
    const { classId } = req.params;
    const { date, records } = req.body || {};

    // 1. Kiểm tra classId
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ message: "Invalid classId format" });
    }

    const classObj = await Class.findById(classId);
    if (!classObj) {
      return res.status(404).json({ message: "Class not found" });
    }

    // 2. Kiểm tra date: bắt buộc, hợp lệ và không nằm trong tương lai
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }
    const attendanceDate = new Date(date);
    if (isNaN(attendanceDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    if (attendanceDate > new Date()) {
      return res.status(400).json({ message: "Date cannot be in the future" });
    }

    // 3. records phải là mảng không rỗng
    if (!Array.isArray(records) || records.length === 0) {
      return res
        .status(400)
        .json({ message: "Records must be a non-empty array" });
    }

    // 4. Lấy danh sách ID sinh viên enrolled hiện có trong lớp
    const enrolledStudentIds = classObj.enrollments
      .filter(
        (e) => e.status && e.status.toLowerCase() === "enrolled" && e.studentId,
      )
      .map((e) => e.studentId.toString());

    // 5. Kiểm tra request phải chứa đủ tất cả sinh viên enrolled và không trùng lặp
    const requestStudentIds = records.map((r) =>
      r && r.studentId ? r.studentId.toString() : "",
    );
    const requestStudentIdSet = new Set(requestStudentIds);

    if (
      requestStudentIdSet.size !== enrolledStudentIds.length ||
      records.length !== enrolledStudentIds.length ||
      !enrolledStudentIds.every((id) => requestStudentIdSet.has(id))
    ) {
      return res.status(400).json({
        message:
          "Attendance records must include all currently enrolled students of this class",
      });
    }

    // 6. Kiểm tra từng record
    for (const item of records) {
      if (
        !item.studentId ||
        !mongoose.Types.ObjectId.isValid(item.studentId) ||
        !enrolledStudentIds.includes(item.studentId.toString())
      ) {
        return res.status(400).json({
          message: `Student ${item.studentId} is invalid or not enrolled in this class`,
        });
      }
      if (!item.status || !["PRESENT", "ABSENT"].includes(item.status)) {
        return res
          .status(400)
          .json({ message: "Status must be either PRESENT or ABSENT" });
      }
    }

    // 7. Thực hiện Upsert với ObjectId chuẩn
    const bulkOps = records.map((item) => ({
      updateOne: {
        filter: {
          classId: classObj._id,
          studentId: new mongoose.Types.ObjectId(item.studentId),
          date: attendanceDate,
        },
        update: {
          $set: { status: item.status },
        },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(bulkOps);

    return res
      .status(200)
      .json({ message: "Attendance records processed successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
