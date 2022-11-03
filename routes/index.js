const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);

  if (isAuth) {
    res.render("index", {
      title: "top page",
      isAuth: isAuth,
      username: req.session.username,
    });
  } else {
    res.redirect("/signin");
  }
});

router.use("/signup", require("./signup"));
router.use("/signin", require("./signin"));
router.use("/logout", require("./logout"));
router.use("/password/reset", require("./passwordReset"));
module.exports = router;
