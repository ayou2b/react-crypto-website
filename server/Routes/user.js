const express = require("express");
const userControllers = require("../Controllers/user");

const { check } = require("express-validator");

const isAuth = require("../Middleware/isAuth");

const router = express.Router();

router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Please Enter A valid Email!"),
    check("password")
      .isAlphanumeric()
      .isLength({ min: 8 })
      .withMessage("Password should be at least 8 characters"),
  ],
  userControllers.signUp
);

router.post("/login", userControllers.login);

router.post("/add-coin", isAuth, userControllers.addMyFavCoin);

router.get("/get-user-coins", isAuth, userControllers.getUserFavCoins);

router.post(
  "/delete-coin-from-fav/:coinId",
  isAuth,
  userControllers.deleteCoinFromFav
);

module.exports = router;
