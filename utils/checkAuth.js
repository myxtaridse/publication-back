import jwt from "jsonwebtoken";

export default (req, res, next) => {
  // обычная функция
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");
  // удалили из строчки токена Bearer - вспомогательное слово

  if (token) {
    try {
      // если токен есть нужно расщифровать его, передаем токен и его ключ для расшифровки
      const decoded = jwt.verify(token, "secret123");
      req.userId = decoded._id;
      //если произойдет расшифровка и сохранится в userId -> OK, переходит к след функции
      next();
    } catch (err) {
      return res.status(403).json({
        // добавили return, поскольку идет два запроса, после return след запрос не будет выполняться
        message: "Нет доступа",
      });
    }
  } else {
    return res.status(403).json({
      // добавили return, поскольку идет два запроса, после return след запрос не будет выполняться
      message: "Нет доступа",
    });
  }

  //return res.send(token);
};
