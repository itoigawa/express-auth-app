const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: false });

const isNonEmptyString = (v) => {
  return typeof v === "string" && v.length > 0;
};

router.get("/", csrfProtection, function (req, res, next) {
  res.render("signup", {
    title: "Sign up",
    csrfToken: req.csrfToken(),
  });
});

router.post("/", csrfProtection, async function (req, res, next) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const repassword = req.body.repassword;

  try {
    // バリデーション
    if (
      isNonEmptyString(name) !== true &&
      isNonEmptyString(email) !== true &&
      isNonEmptyString(password) !== true
    ) {
      throw new Error("不正な値");
    }
    if (password !== repassword)
      throw new Error("パスワードと確認パスワード不一致");
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザーをDBに登録
    await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });

    res.redirect("/signin");
  } catch (error) {
    console.error("ユーザー登録失敗", error);
    res.render("signup", {
      title: "Sign up",
      errorMessage: [error.errorMessage],
    });
  }
});

module.exports = router;
