const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/User");
const PasswordReset = require("../model/PasswordReset");

const isNonEmptyString = (v) => {
  return typeof v === "string" && v.length > 0;
};

const now = new Date();
const before30min_unix = now.getTime() - 1800000; //ミリ秒なので(900秒*1000)
const before30min = new Date(before30min_unix);

router.get("/", async function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);
  const tokenAndEmail = req.originalUrl.split("/password/setting/")[1];

  const [token, email] = tokenAndEmail.split("?email=");

  try {
    const result = await PasswordReset.findOne({
      attributes: ["email", "token", "updated_at"],
      where: {
        email: decodeURIComponent(email),
        token: token,
      },
    });

    if (result === null)
      throw new Error("該当するメールアドレスとトークンなし");

    if (result.updated_at < before30min)
      throw new Error("パスワード再設定メール送信から30分経過");

    res.render("passwordSetting", {
      title: "Password setting",
      email: decodeURIComponent(email),
      originalUrl: req.originalUrl,
    });
  } catch (error) {
    console.error(error);
    res.render("passwordReset", {
      title: "Password reset",
      errorMessage: [error.errorMessage],
      isAuth: isAuth,
    });
  }
});

router.post("/", async function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);

  const email = req.body.email;
  const password = req.body.password;
  const repassword = req.body.repassword;

  try {
    if (password !== repassword)
      throw new Error("パスワードと確認パスワード不一致");
    if (password)
      if (
        isNonEmptyString(email) !== true ||
        isNonEmptyString(password) !== true
      ) {
        // バリデーション
        throw new Error("不正な値");
      }
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await User.upsert({
      email: email,
      password: hashedPassword,
    });

    if (user.id?.length !== 36) {
      throw new Error("ユーザー更新失敗");
    }

    res.redirect("/signin");
  } catch (error) {
    console.error(error);
    res.render("passwordReset", {
      title: "Password reset",
      errorMessage: [error.errorMessage],
      isAuth: isAuth,
    });
  }
});

module.exports = router;
