const User = require("../Model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const secretKey = require("../Middleware/secretKey");

const { validationResult } = require("express-validator");

exports.signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate input data
    const errors = await validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(401).json({ errorMessage: errors.array()[0].msg });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
      return res.status(400).json({
        errorMessage: "Email already in use. Please try another email.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    await User.create({ name: name, email: email, password: hashedPassword });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errorMessage: errors.array()[0].msg });
    }

    // Find user by email
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(401).json({ errorMessage: "User not found" });
    }

    // Check if password is correct
    const doPasswordsMatch = await bcrypt.compare(password, user.password);
    if (!doPasswordsMatch) {
      return res.status(401).json({ errorMessage: "Incorrect password" });
    }

    // Create and send JWT token
    const token = jwt.sign({ userId: user.id }, secretKey, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "User logged in", token: token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Failed to log in" });
  }
};

exports.addMyFavCoin = async (req, res, next) => {
  try {
    const { coinId, coinName, coinIcon, coinPrice, coinMarketCap, coin24h } =
      req.body;

    const userId = req.userData.userId;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(401).json({ errorMessage: "User Not Found" });
    }

    let favoriteCoins = user.getDataValue("favoriteCoins");

    if (favoriteCoins) {
      favoriteCoins = JSON.parse(favoriteCoins);
    } else {
      favoriteCoins = [];
    }

    favoriteCoins.push({
      uuid: coinId,
      name: coinName,
      price: coinPrice,
      iconUrl: coinIcon,
      marketCap: coinMarketCap,
      change: coin24h,
    });

    user.setDataValue("favoriteCoins", JSON.stringify(favoriteCoins));

    await user.save();

    res.status(200).json({ message: "Coin Added" });
  } catch (err) {
    console.error("Error adding coin:", err);
    res.status(500).json({ error: "Failed to add coin" });
  }
};

exports.getUserFavCoins = async (req, res, next) => {
  try {
    const userId = req.userData.userId;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(401).json({ errorMessage: "User Not Found" });
    }

    res.status(200).json({ coins: user.favoriteCoins });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteCoinFromFav = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    const coinId = req.params.coinId;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(401).json({ errorMessage: "User Not Found" });
    }

    let favoriteCoins = JSON.parse(user.getDataValue("favoriteCoins"));

    favoriteCoins = favoriteCoins.filter((coin) => coin.coinId !== coinId);

    user.setDataValue("favoriteCoins", JSON.stringify(favoriteCoins));

    await user.save();

    res.status(200).json({ message: "Coin deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
};
