import mongoose from "mongoose";

//модель пользователя

// В схеме будут все параметры пользователя
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    description: {
      type: String,
    },
    subscribed: {
      required: true,
      type: Array,
      default: [],
    },
    subscribers: {
      required: true,
      type: Array,
      default: [],
    },
    url: {
      type: String,
    },
    posts: {
      required: true,
      type: Array,
      default: [],
    },
    nickname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
  },
  {
    // дата создания
    timestamps: true,
  }
);

//отправка нашей схемы
export default mongoose.model("User", UserSchema);
