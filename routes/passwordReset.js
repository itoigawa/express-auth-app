const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const User = require("../model/User");
const PasswordReset = require("../model/PasswordReset");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

      const passwordResetUrl =
        "http://localhost:3000/password/setting/" +
        passwordReset.token +
        +"?email=" +
        email;
      //メール情報の作成
      const msg = {
        to: email,
        from: "itoigawakota@gmail.com",
        subject: "【ログイン認証システム】パスワード再発行メール",
        text:
          "以下のURLをクリックしてパスワードを再発行してください。\n\n" +
          passwordResetUrl,
        html: `<h3>以下のURLをクリックしてパスワードを再発行してください。</h3>
			  		${passwordResetUrl}`,
      };
      sgMail.send(msg);
      res.redirect("/signin");
    }
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
