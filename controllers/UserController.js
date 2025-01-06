import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

import UserModel from "../models/User.js";

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден", // при неверной авторизации не нужно писать развернуто ее причину
        // лишь "неверно введен логин/пароль"
        //играет роль при попытке взлома б/д
        // не уточнять, где ошибки, оставить поверхностную ошибку
        // чтобы было не ясно, какие пароли есть, логины, исхдя из этого подбирать верный вариант
      });
    }
    // если правильная авторизация проверить сходятся ли пароли веденый пользователем и в базе данных
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPass) {
      // оповестить пользователя
      return res.status(401).json({
        message: "Неверный логин или пароль :(",
      });
    }
    // если все верно -> создаем новый токен
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123", //ключ для шифрования
      //срок жизни токена
      {
        expiresIn: "30d", // перестанет быть валидным через 30 дней
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      // в user хранится больше инфы, чем о самом доке, хранятся методы, свойства в самом MongoDB
      ...userData, // получаем инфу о пользователе по doc, исключаем hash - шифрованный пароль
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось авторизоваться:(",
    });
  }
};

export const register = async (req, res) => {
  // при создании, регистрации, необходимо получить имя пользователя, почту

  try {
    //получение всех ошибок при запросе
    const errors = validationResult(req);
    // если не пусты ошибки, они есть, тогда вернет статут 400, вернет все ошибки для анализа
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    // шифрование пароля
    const password = req.body.password;
    // алгоритм шифрования пароля
    const salt = await bcrypt.genSalt(10);
    // шифрование открытого пароля
    const hash = await bcrypt.hash(password, salt);

    // подготовка документа на создание пользователя
    const doc = new UserModel({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
      nickname: req.body.nickname,
      posts: req.body.posts,
      url: req.body.url,
      subscribers: req.body.subscribers,
      subscribed: req.body.subscribed,
      description: req.body.description,
    });

    // создание самого пользователя в MongoDB
    const user = await doc.save(); // сохранение документов на создание пользователя в базе данных

    //зашифровать токен айди, чтобы потом понимать авторизован ли пользователь
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123", //ключ для шифрования
      //срок жизни токена
      {
        expiresIn: "30d", // перестанет быть валидным через 30 дней
      }
    );

    // Исключаем из объекта user._doc passwordHash -> новый объект ...userData
    const { passwordHash, ...userData } = user._doc;

    res.json({
      // в user хранится больше инфы, чем о самом доке, хранятся методы, свойства в самом MongoDB
      ...userData, // получаем инфу о пользователе по doc, исключаем hash - шифрованный пароль
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться:(",
    });
  }
};

export const changeMyAcc = async (req, res) => {
  try {
    // найти инфу об айди
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    } else {
      await UserModel.updateOne(
        { _id: user },
        {
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          avatarUrl: req.body.avatarUrl,
          passwordHash: req.body.password,
          nickname: req.body.nickname,
          posts: req.body.posts,
          url: req.body.url,
          //subscribers: req.body.subscribers,
          subscribed: req.body.subscribed,
          description: req.body.description,
        }
      );
    }

    const { passwordHash, ...userData } = user._doc;
    return res.json(userData);
  } catch (err) {
    console.log("err", err);
    res.status(505).json({
      message: "Произошла ошибка",
    });
  }
};

export const subscribersUser = async (req, res) => {
  try {
    const userId = req.params.id;

    await UserModel.updateOne(
      { _id: userId },
      {
        subscribers: req.body.subscribers,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log("err", err);
    res.status(505).json({
      message: "Произошла ошибка",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    // найти инфу об айди
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const { passwordHash, ...userData } = user._doc;
    return res.json(userData);
  } catch (err) {
    console.log("err", err);
    // res.status(505).json({
    //   message: "Произошла ошибка",
    // });
  }
};

export const getUser = async (req, res) => {
  try {
    // найти инфу об айди
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    const { passwordHash, ...userData } = user._doc;
    return res.json(userData);
  } catch (err) {
    console.log("err", err);
    res.status(505).json({
      message: "Произошла ошибка",
    });
  }
};

export const getUserAll = async (req, res) => {
  try {
    // найти инфу об айди
    const users = await UserModel.find().exec();
    res.json(users);

    // const userId = req.params.id;
    // const user = await UserModel.findById(userId);
    // if (!user) {
    //   return res.status(404).json({
    //     message: "Пользователь не найден",
    //   });
    // }
    // const { passwordHash, ...userData } = user._doc;
    // return res.json(userData);
  } catch (err) {
    console.log("err", err);
    res.status(505).json({
      message: "Произошла ошибка",
    });
  }
};

export default {
  register,
  login,
  getMe,
  changeMyAcc,
  getUser,
  subscribersUser,
  getUserAll,
};
