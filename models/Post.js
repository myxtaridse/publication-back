import mongoose from "mongoose";

//модель пользователя

// В схеме будут все параметры пользователя
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    tags: {
      type: Array,
      default: [], //если не будет ничего из тегов -> вернется пустой массив
    },
    comments: {
      type: Array,
      default: [], //если не будет ничего из тегов -> вернется пустой массив
    },
    viewsCount: {
      //просмотры статьи
      type: Number,
      default: 0, //если не будет просмотров -> 0
    },
    likes: {
      //просмотры статьи
      type: Array,
      default: [], //если не будет просмотров -> 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // получние айди пользователя из б/д
      ref: "User",
      required: true,
    },
    imageUrl: {
      required: true,
      type: String,
    },
  },
  {
    // дата создания
    timestamps: true,
  }
);

//отправка нашей схемы
export default mongoose.model("Post", PostSchema);
