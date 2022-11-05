const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  // セッションをクリア
  req.session = null;
  res.redirect("/");
});

module.exports = router;
