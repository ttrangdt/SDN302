const express = require("express");
const router = express.Router();
const { readDB, writeDB } = require("../utils");

//Lấy
router.get("/", async (req, res) => {
  const data = await readDB();
  res.status(200).json(data.comments);
});

router.get("/:id", async (req, res) => {
  const db = await readDB();
  const id = parseInt(req.params.id);
  const comment = db.comments.find((c) => c.id === id);

  if (comment) {
    res.status(200).json(comment);
  } else {
    res.status(404).json({ message: "Không tìm thấy" });
  }
});

//Thêm
router.post("/", async (req, res) => {
  const db = await readDB();
  const { articleId, author, content, date } = req.body;

  if (!articleId || !author || !content || !date) {
    return res.status(400).json({ message: "Thiếu dữ liệu" });
  }

  const article = db.articles.find((a) => a.id === parseInt(articleId));
  if (!article) {
    return res.status(404).json({ message: "id không tồn tại" });
  }

  const newId =
    db.comments.length > 0 ? db.comments[db.comments.length - 1].id + 1 : 1;

  const newComment = {
    id: newId,
    articleId: parseInt(articleId),
    author,
    content,
    date,
  };

  db.comments.push(newComment);
  await writeDB(db);
  res.status(201).json(newComment);
});

router.put("/:id", async (req, res) => {
  const db = await readDB();
  const id = parseInt(req.params.id);
  const index = db.comments.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Không tìm thấy" });
  }

  const { articleId, author, content, date } = req.body;

  if (!articleId || !author || !content || !date) {
    return res.status(400).json({ message: "Thiếu dữ liệu" });
  }

  db.comments[index] = {
    id: id,
    articleId: parseInt(articleId),
    author,
    content,
    date,
  };

  await writeDB(db);
  res.status(200).json(db.comments[index]);
});

//Xóa
router.delete("/:id", async (req, res) => {
  const db = await readDB();
  const id = parseInt(req.params.id);

  const index = db.comments.findIndex((c) => c.id === id);
  if (index !== -1) {
    db.comments.splice(index, 1);
    await writeDB(db);
    res.status(200).json({ message: "Đã xóa" });
  } else {
    res.status(404).json({ message: "Không tìm thấy" });
  }
});

module.exports = router;
