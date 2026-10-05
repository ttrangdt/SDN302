const fs = require("fs").promises;
const path = require("path");

const dbFilePath = path.join(__dirname, "data.json");

const readDB = async () => {
  try {
    const data = await fs.readFile(dbFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Lỗi đọc file:", err);
    return { articles: [], comments: [] };
  }
};

const writeDB = async (data) => {
  try {
    await fs.writeFile(dbFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Lỗi ghi file:", err);
  }
};

module.exports = { readDB, writeDB };

// fs.promises, async/await
