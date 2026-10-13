const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: true,
      minlength: 10,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    //tự động tạo 2 field createdAt và updatedAt
    //createdAt: khi tạo mới customer
    timestamps: true,
  },
);
const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
