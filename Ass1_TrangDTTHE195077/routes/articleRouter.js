const express = require("express");
const router = express.Router();
const { readDB, writeDB } = require("../utils");

// router.get("/", (req, res) => {
//   res.status(200).json(articles);
// });

// Lấy tất cả
router.get("/", (req, res) => {
  const data = readDB();
  res.status(200).json(data.articles);
});

router.get("/:id", (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const article = db.articles.find((a) => a.id === id);
  if (article) {
    res.status(200).json(article);
  } else {
    res.status(404).json({ message: "Không tìm thấy" });
  }
});

// Thêm
router.post("/", (req, res) => {
  const db = readDB();
  const newId =
    db.articles.length > 0 ? db.articles[db.articles.length - 1].id + 1 : 1;
  const newA = { id: newId, ...req.body };
  //   db.articles.push(newA);
  //   writeDB(db);
  //   res.status(201).json(newA);
  if (newA) {
    db.articles.push(newA);
    writeDB(db);
    res.status(201).json(newA);
  } else {
    res.status(400).json({ message: "Thieu du lieu" });
  }
});

// Cập nhật
router.put("/:id", (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const index = db.articles.findIndex((a) => a.id === id);
  if (index !== -1) {
    db.articles[index] = { ...db.articles[index], ...req.body };
    writeDB(db);
    res.status(200).json(db.articles[index]);
  } else {
    res.status(404).json({ message: "Không tìm thấy" });
  }
});

// Xóa
router.delete("/:id", (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const index = db.articles.findIndex((u) => u.id === id);
  if (index !== -1) {
    db.articles.splice(index, 1);
    writeDB(db);
    res.status(200).json({ message: "Đã xóa" });
  } else {
    res.status(404).json({ message: "Không tìm thấy" });
  }
});
// router.delete("/:id", (req, res) => {
//   const db = readDB();
//   const id = parseInt(req.params.id);
//   db.articles = db.articles || [];

//   const index = db.articles.findIndex((a) => a.id === id);
//   if (index !== -1) {
//     db.articles.splice(index, 1);
//     writeDB(db);
//     res.status(200).json({ message: "Đã xóa" });
//   } else {
//     res.status(404).json({ message: "Không tìm thấy" });
//   }
// });

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { readDB, writeDB } = require("../utils");

// // Lấy tất cả bài viết
// router.get("/", (req, res) => {
//   const data = readDB();
//   res.status(200).json(data.articles || []);
// });

// // Lấy bài viết theo ID
// router.get("/:id", (req, res) => {
//   const db = readDB();
//   const id = parseInt(req.params.id);
//   const article = (db.articles || []).find((a) => a.id === id);

//   if (article) {
//     res.status(200).json(article);
//   } else {
//     res.status(404).json({ message: "Không tìm thấy" });
//   }
// });

// // Thêm bài viết mới
// router.post("/", (req, res) => {
//   const db = readDB();

//   if (
//     !req.body.title ||
//     !req.body.content ||
//     !req.body.author ||
//     !req.body.date
//   ) {
//     return res.status(400).json({ message: "Thiếu dữ liệu" });
//   }

//   const newId =
//     db.articles.length > 0 ? db.articles[db.articles.length - 1].id + 1 : 1;
//   const newArticle = { id: newId, ...req.body };

//   db.articles.push(newArticle);
//   writeDB(db);
//   res.status(201).json(newArticle);
// });

// // Cập nhật bài viết
// router.put("/:id", (req, res) => {
//   const db = readDB();
//   const id = parseInt(req.params.id);
//   db.articles = db.articles || [];

//   const index = db.articles.findIndex((a) => a.id === id);
//   if (index !== -1) {
//     db.articles[index] = { ...db.articles[index], ...req.body };
//     writeDB(db);
//     res.status(200).json(db.articles[index]);
//   } else {
//     res.status(404).json({ message: "Không tìm thấy" });
//   }
// });

// // Xóa bài viết
// router.delete("/:id", (req, res) => {
//   const db = readDB();
//   const id = parseInt(req.params.id);
//   db.articles = db.articles || [];

//   const index = db.articles.findIndex((a) => a.id === id);
//   if (index !== -1) {
//     db.articles.splice(index, 1);
//     writeDB(db);
//     res.status(200).json({ message: "Đã xóa" });
//   } else {
//     res.status(404).json({ message: "Không tìm thấy" });
//   }
// });

// module.exports = router;
