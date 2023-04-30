import express, { Request, Response, NextFunction } from "express";
import { userRouter } from "./users/users.js";

const port = 8000;
const app = express();

// промежуточный обработчик (middleware) всего приложения
app.use((req, res, next) => {
  console.log("Middleware: Время", Date.now());
  next();
});

app.get("/hello", (req, res) => {
  throw new Error("Error!!!(((");
});

// Привяжем роутер к корневому приложению, чтобы получилось users/login и users/register.
app.use("/users", userRouter);

// обработчик ошибки на все приложение
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.message);
  res.status(500).send(err.message);
});

app.listen(port, () => {
  console.log(`Сервер запущен на http//localhost:${port}`);
});
