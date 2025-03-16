const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Подключение к MongoDB
mongoose.connect("mongodb://localhost:27017/gamehub", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Модель пользователя
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

// Модель отзыва
const ReviewSchema = new mongoose.Schema({
  username: String,
  text: String,
});

const Review = mongoose.model("Review", ReviewSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Регистрация
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Заполните все поля" });
  }

  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).json({ message: "Пользователь уже существует" });
  }

  const user = new User({ username, password });
  await user.save();

  res.status(201).json({ message: "Регистрация прошла успешно" });
});

// Авторизация
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Заполните все поля" });
  }

  const user = await User.findOne({ username, password });
  if (!user) {
    return res.status(400).json({ message: "Неверное имя пользователя или пароль" });
  }

  res.status(200).json({ message: "Авторизация прошла успешно", user });
});

// Добавление отзыва
app.post("/reviews", async (req, res) => {
  const { username, text } = req.body;

  if (!username || !text) {
    return res.status(400).json({ message: "Заполните все поля" });
  }

  const review = new Review({ username, text });
  await review.save();

  res.status(201).json({ message: "Отзыв добавлен" });
});

// Получение отзывов
app.get("/reviews", async (req, res) => {
  const reviews = await Review.find();
  res.status(200).json(reviews);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});