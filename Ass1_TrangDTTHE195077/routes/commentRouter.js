const express = require("express");
const router = express.Router();
const { readDB, writeDB } = require("../utils");

router.get("/", (req, res) => {
  const db = readDB();
  const comments = db.comments || [];
  const { articleId } = req.query;

  if (articleId) {
    const filtered = comments.filter(
      (c) => c.articleId === parseInt(articleId),
    );
    return res.status(200).json(filtered);
  }

  res.status(200).json(comments);
});

// 2. Lấy chi tiết comment theo id
router.get("/:id", (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const comment = (db.comments || []).find((c) => c.id === id);

  if (comment) {
    res.status(200).json(comment);
  } else {
    res.status(404).json({ message: "Không tìm thấy comment" });
  }
});

// 3. Thêm comment mới
router.post("/", (req, res) => {
  const db = readDB();
  db.comments = db.comments || [];
  db.articles = db.articles || [];

  const { articleId, author, content } = req.body;

  if (!articleId || !author || !content) {
    return res.status(400).json({
      message: "Thiếu dữ liệu bắt buộc: articleId, author, content",
    });
  }

  const articleExists = db.articles.some((a) => a.id === parseInt(articleId));
  if (!articleExists) {
    return res.status(404).json({
      message: `Không tìm thấy bài viết có id ${articleId}`,
    });
  }

  const maxId = db.comments.reduce((max, c) => (c.id > max ? c.id : max), 0);
  const newComment = {
    id: maxId + 1,
    articleId: parseInt(articleId),
    author,
    content,
    date: req.body.date || new Date().toISOString().split("T")[0],
  };

  db.comments.push(newComment);
  writeDB(db);

  res.status(201).json(newComment);
});

// 4. Cập nhật comment theo id
router.put("/:id", (req, res) => {
  const db = readDB();
  db.comments = db.comments || [];
  const id = parseInt(req.params.id);

  const index = db.comments.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Không tìm thấy comment" });
  }

  db.comments[index] = {
    ...db.comments[index],
    ...req.body,
    id: id,
    articleId: req.body.articleId
      ? parseInt(req.body.articleId)
      : db.comments[index].articleId,
  };

  writeDB(db);
  res.status(200).json(db.comments[index]);
});

// 5. Xóa comment theo id
router.delete("/:id", (req, res) => {
  const db = readDB();
  db.comments = db.comments || [];
  const id = parseInt(req.params.id);

  const index = db.comments.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Không tìm thấy comment" });
  }

  const deletedComment = db.comments.splice(index, 1);
  writeDB(db);

  res.status(200).json({
    message: "Đã xóa comment thành công",
    comment: deletedComment[0],
  });
});

module.exports = router;
