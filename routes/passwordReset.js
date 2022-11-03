const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const User = require("../model/User");
const PasswordReset = require("../model/PasswordReset");

const isNonEmptyString = (v) => {
  return typeof v === "string" && v.length > 0;
};

router.get("/", function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);

  res.render("passwordReset", {
    title: "Password reset",
    isAuth: isAuth,
  });
});

router.post("/", async function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);

  const email = req.body.email;

  try {
    // バリデーション
    if (isNonEmptyString(email) !== true) {
      throw new Error("不正な値");
    }
    // ユーザーが存在するか
    const result = await User.findOne({
      attributes: ["id"],
      where: {
        email: email,
      },
    });

    if (result === null) {
      throw new Error("該当ユーザーなし");
    } else {
      const [passwordReset, isCreated] = await PasswordReset.upsert({
        email: email,
        token: uuidv4(),
      });
      if (passwordReset.token?.length !== 36) {
        if (isCreated) {
          throw new Error("トークン作成失敗");
        } else {
          throw new Error("トークン更新失敗");
        }
      }
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
