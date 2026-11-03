const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    className: { type: String, required: true },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    lecturerName: { type: String, required: true },
    status: { type: String, enum: ["OPEN", "CLOSED"], default: "OPEN" },
    enrollments: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        status: { type: String, default: "enrolled" },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Class", classSchema);
