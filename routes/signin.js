const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");

const isNonEmptyString = (v) => {
  return typeof v === "string" && v.length > 0;
};

router.get("/", function (req, res, next) {
  res.render("signin", {
    title: "Sign in",
  });
});

router.post("/", async function (req, res, next) {
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
      attributes: ["password"],
      where: {
        email: email,
      },
    });

    if (result.length === null) {
      throw new Error("該当ユーザーなし");
    } else if (await bcrypt.compare(password, result.password)) {
      res.redirect("/");
    } else {
      throw new Error("パスワード不一致");
    }
  } catch (error) {
    console.error(error);
    res.render("signin", {
      title: "Sign in",
      errorMessage: [error.errorMessage],
    });
  }
});

module.exports = router;
