const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");

const isNonEmptyString = (v) => {
  return typeof v === "string" && v.length > 0;
};

router.get("/", function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);
  res.render("signin", {
    title: "Sign in",
    isAuth: isAuth,
  });
});

router.post("/", async function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);

  const email = req.body.email;
  const password = req.body.password;

  try {
    // バリデーション
    if (
      isNonEmptyString(email) !== true &&
      isNonEmptyString(password) !== true
    ) {
      throw new Error("不正な値");
    }
    const result = await User.findOne({
      attributes: ["id", "name", "password"],
      where: {
        email: email,
      },
    });

    if (result === null) {
      throw new Error("該当ユーザーなし");
    } else if (await bcrypt.compare(password, result.password)) {
      // セッション(Webサーバに保存するデータ)にidとnameを保存
      req.session.userid = result.id;
      req.session.username = result.name;
      res.redirect("/");
    } else {
      throw new Error("パスワード不一致");
    }
  } catch (error) {
    console.error(error);
    res.render("signin", {
      title: "Sign in",
      errorMessage: [error.errorMessage],
      isAuth: isAuth,
    });
  }
});

module.exports = router;
