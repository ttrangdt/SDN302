const fs = require("fs");
const path = require("path");

const dbFilePath = path.join(__dirname, "data.json");

const readDB = () => {
  try {
    const data = fs.readFileSync(dbFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Lỗi đọc file:", err);
    return { articles: [], comments: [] };
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Lỗi ghi file:", err);
  }
};

module.exports = { readDB, writeDB };

// fs.promises, async/await
