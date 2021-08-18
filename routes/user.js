const mongoose = require("mongoose");
const router = require("express").Router();
const User = require("../models/user");
const passport = require("passport");
const { genPassword, validPassword, issueJWT } = require("../helper/utils");

// TODO
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.status(200).json({
      success: true,
      msg: "You are now authorized to see protected route",
    });
  }
);

// TODO
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(401).json({ success: false, msg: "User doesnot exists" });
    }
    const isValid = validPassword(req.body.password, user.hash, user.salt);
    if (isValid) {
      const { token, expiresIn } = issueJWT(user);
      res.status(200).json({ success: true.hash, token, expiresIn });
    }
    next();
  } catch (err) {
    next(err);
  }
});

// TODO
router.post("/register", (req, res, next) => {
  const { salt, hash } = genPassword(req.body.password);

  const newUser = new User({
    username: req.body.username,
    hash,
    salt,
  });
  newUser
    .save()
    .then((user) => {
      const jwt = issueJWT(user);
      res.json({
        success: true,
        user,
        token: jwt.token,
        expiresIn: jwt.expiresIn,
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
