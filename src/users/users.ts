import express from "express";

const userRouter = express.Router();

//Обработчик на весь роут users
userRouter.use((req, res, next) => {
  console.log("Обработчик users");
  next();
});

userRouter.post("/login", (req, res) => {
  res.send("login");
});

userRouter.post("/register", (req, res) => {
  console.log("register");
  res.send("register");
});

export { userRouter };
