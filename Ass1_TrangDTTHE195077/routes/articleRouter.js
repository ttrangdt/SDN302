const express = require("express");
const router = express.Router();
const { readDB, writeDB } = require("../utils");

// Lấy
router.get("/", async (req, res) => {
  const data = await readDB();
  res.status(200).json(data.articles);
});

// Lấy theo id
router.get("/:id", async (req, res) => {
  const db = await readDB();
  const id = parseInt(req.params.id);
  const article = db.articles.find((a) => a.id === id);

  if (article) {
    res.status(200).json(article);
  } else {
    res.status(404).json({ message: "Không tìm thấy" });
  }
});

// Thêm mới
router.post("/", async (req, res) => {
  const db = await readDB();
  const { title, content, author, date } = req.body;

  if (!title || !content || !author || !date) {
    return res.status(400).json({ message: "Thiếu dữ liệu" });
  }
  const newId =
    db.articles.length > 0 ? db.articles[db.articles.length - 1].id + 1 : 1;

  const newArticle = { id: newId, title, content, author, date };

  db.articles.push(newArticle);
  await writeDB(db);
  res.status(201).json(newArticle);
});

// Cập nhật
router.put("/:id", async (req, res) => {
  const db = await readDB();
  const id = parseInt(req.params.id);
  const index = db.articles.findIndex((a) => a.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Không tìm thấy" });
  }

  const { title, content, author, date } = req.body;

  if (!title || !content || !author || !date) {
    return res.status(400).json({ message: "Thiếu dữ liệu" });
  }

  db.articles[index] = { id, title, content, author, date };

  await writeDB(db);
  res.status(200).json(db.articles[index]);
});

// Xóa
router.delete("/:id", async (req, res) => {
  const db = await readDB();
  const id = parseInt(req.params.id);

  const index = db.articles.findIndex((a) => a.id === id);
  if (index !== -1) {
    db.articles.splice(index, 1);
    await writeDB(db);
    res.status(200).json({ message: "Đã xóa" });
  } else {
    res.status(404).json({ message: "Không tìm thấy" });
  }
});

module.exports = router;
