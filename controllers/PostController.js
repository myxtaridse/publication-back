// Различные действия со статьями в блоге

import PostModel from "../models/Post.js";
import UserModel from "../models/User.js";

export const getAll = async (req, res) => {
  //получение всех статей
  try {
    const posts = await PostModel.find()
      .populate({
        path: "user",
        select: [
          "nickname",
          "avatarUrl",
          "url",
          "description",
          "firstName",
          "lastName",
          "posts",
        ],
      }) //получние инфы о пользователе, опубликовавший статью
      .exec();
    res.json(posts);
  } catch (err) {
    console.log("err");
    res.status(500).json({
      message: "Не удалось получить статьи :(",
    });
  }
};

export const getTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(30).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat() //возвращает сложенный массив, когда в общем массиве много нескольких массивов, возвращает один полноценный
      //п-р, const sampleArr = [1, 2, [3, [4, 5, 6], 7], 8]; -> в array: [1, 2, 3, 4, 5, 6, 7, 8]
      .slice(0, 30);
    res.json(tags);
  } catch (err) {
    console.log("err");
    res.status(500).json({
      message: "Не удалось получить статьи :(",
    });
  }
};

export const getOne = async (req, res) => {
  //получение всех статей
  try {
    //необходимо знать айди статьи
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: "after" }
    )
      .populate({ path: "user", select: ["nickname", "avatarUrl"] }) //получние инфы о пользователе, опубликовавший статью
      .exec()
      .then((doc) => {
        if (!doc) {
          console.log("err");
          return res.status(404).json({
            message: "Не удалось найти статью :(",
          });
        }
        res.json(doc);
      })
      .catch((err) => {
        if (err) {
          console.log("err");
          return res.status(500).json({
            message: "Не удалось получить статью :(",
          });
        }
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Не удалось получить статьи :(",
    });
  }
};

export const update = async (req, res) => {
  //получение всех статей
  try {
    //необходимо знать айди статьи
    const postId = req.params.id;

    await PostModel.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags?.split(","),
        user: req.body.user,
        comments: req.body.comments,
        likes: req.body.likes,
      }
    );
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Не удалось обновить статьи :(",
    });
  }
};

export const remove = async (req, res) => {
  //получение всех статей
  try {
    //необходимо знать айди статьи
    const postId = req.params.id;
    PostModel.findOneAndDelete({ _id: postId })
      .then((doc) => {
        if (!doc) {
          console.log("err");
          return res.status(404).json({
            message: "Не удалось найти статью :(",
          });
        }
        res.json({
          success: true,
        });
      })
      .catch((err) => {
        if (err) {
          console.log("err");
          return res.status(500).json({
            message: "Не удалось удалить статью :(",
          });
        }
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Не удалось получить статью :(",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags?.split(","),
      user: req.userId,
    });
    const post = await doc.save();
    res.json(post);
    console.log(post);
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      message: "Не удалось создать пост :(",
    });
  }
};

export default {
  getAll,
  getTags,
  getOne,
  create,
  update,
  remove,
};
