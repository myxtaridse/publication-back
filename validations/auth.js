import { body } from "express-validator";

// проверка правильности вхождения при авторизации
export const loginValidator = [
  body("email", "Неверный формат почты").isEmail(), // проверит есть ли почта или нет, она обязательна
  body("password", "Пароль должен состоять минимум из 5 символов").isLength({
    min: 5,
  }), // проверит, чтобы в пароле было не менее 5 символов
];

//проверка есть ли инфа - введена ли она пользователем, почта, имя, аватарка
export const registerValidator = [
  body("email", "Неверный формат почты").isEmail(), // проверит есть ли почта или нет, она обязательна
  body("password", "Пароль должен состоять минимум из 5 символов").isLength({
    min: 5,
  }), // проверит, чтобы в пароле было не менее 5 символов
  body("nickname", "Укажите никнейм").isLength({ min: 3 }),
  body("avatarUrl", "Неверная ссылка на аватарку").optional().isString(), // проверит имеется ли аваитарка, если да проверит ссылку-url
  body("firstName", "Укажите полное имя").optional().isString(),
  body("lastName", "Укажите фамилию").optional().isString(),
  body("url", "Укажите ссылку на другие аккаунты").optional().isString(),
  body("description", "Укажите описание о вашем блоге").optional().isString(),
];

// проверка инфы на создание статьи
export const postCreateValidation = [
  body("title", "Введите заголовок статьи").optional().isString(),
  body("tags", "Неверный формат тэгов (укажите массив)").optional().isString(),
  body("comments", "Неверный формат тэгов (укажите массив)")
    .optional()
    .isString(),
  body("imageUrl", "Неверная ссылка на изображение").isString(),
];
