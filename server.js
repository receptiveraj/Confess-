const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// In-memory database
const messages = [];

// API Endpoints
app.post("/api/messages", upload.single("file"), (req, res) => {
  const { name, message } = req.body;
  const file = req.file ? `/uploads/${req.file.filename}` : null;

  const newMessage = { name, message, file };
  messages.push(newMessage);

  res.status(201).json({ message: "Message posted successfully", newMessage });
});

app.get("/api/messages", (req, res) => {
  res.json(messages);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});