import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import fs from "fs";

import {
  registerValidator,
  loginValidator,
  postCreateValidation,
} from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import UserController from "./controllers/UserController.js";
import PostControler from "./controllers/PostController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

const uri =
  "mongodb+srv://ksssenia2001:wwwwww@cluster000.sus71bi.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster000";

// const url = process.env.MONGODB_URI;

mongoose
  .connect(process.env.MONGODB_URI || uri)
  .then(() => console.log("DB okkkk"))
  .catch((error) => console.log("error", error));

const app = express();

//хранилище для всех картинок
const storage = multer.diskStorage({
  //путь куда будем сохранять все картинки
  destination: (_, __, cb) => {
    // не получает ошибок и сохраняет все картинки в папку uploads -> функция объясняет какой путь необходимо использовать
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    // + Вытаскиваем из файла оригинальное название
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }); // объясняем multer что у него есть хранилище

//необходимо научить запрос формату json
//данная функция позволит читать запросы
// в терминале нам поступило сообщение о введенных при авторизации в json-формате логин с паролем
//{ "email": "example@mail.ru", "password": "123456" }
// express смог прочитать, что хранится в запросе
app.use(express.json());

// cors обычно ставит блокировки для передачи домена,
// мы связали два локалхоста, что 3000 запрашивает с 4444 посты
app.use(cors());

// если придет любой запрос на uploads,
// тогда с помощью функции static из библиотеки express -> есть ли в папке uploads
// то что я передаю
app.use("/uploads", express.static("uploads"));

//Запросы

// Авторизация, необходимо понять есть ли пользователь в б/д
app.post(
  "/auth/login",
  loginValidator,
  handleValidationErrors,
  UserController.login
);

// запрос при переходе на данной ссылке, для начала выполнится условие registerValidator, затем будет выполняться функция
app.post(
  "/auth/register",
  registerValidator,
  handleValidationErrors,
  UserController.register
);

// app.get("/", (req, res) => {
//   res.send("Hel5555lo"); //req - запрос, res - ответ
// });

// app.post("/auth/login", (req, res) => {
//   console.log(req.body);
//   //когда придет запрос -> сгенерировать токен в sign() передается инфа для шифровки
//   const token = jwt.sign(
//     {
//       //шифровка данного объекта
//       email: req.body.email,
//       fullName: "Вася Пупкин",
//     },
//     //обязательно сделать данный ключ
//     "515656"
//   );

//   res.json({
//     succes: true,
//     token,
//   });
// });

//

//получение инфы о пользователе

app.get("/auth/me", checkAuth, UserController.getMe);

app.get("/user/:id", checkAuth, UserController.getUser);

app.get("/users", checkAuth, UserController.getUserAll);

app.post("/upload", upload.single("image"), (req, res) => {
  // вернет картинку по сохраненному пути
  return res.json({
    url: `/uploads/${req.file.originalname}`, //если все ОК -> вернет изображение из хранилища
  });
});

// Для различных действий с постами - CRUD
app.get("/posts", PostControler.getAll);
// app.get("/posts/:id", PostControler.getPostsByUser);

app.get("/tags", PostControler.getTags);
app.get("/posts/:id", PostControler.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostControler.create
);
app.delete("/posts/:id", checkAuth, PostControler.remove);

app.patch(
  "/posts/:id",
  checkAuth,
  handleValidationErrors,
  PostControler.update
);
app.patch(
  "/user/me",
  checkAuth,
  handleValidationErrors,
  UserController.changeMyAcc
);
app.patch(
  "/user/:id",
  checkAuth,
  handleValidationErrors,
  UserController.subscribersUser
);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Good");
});
