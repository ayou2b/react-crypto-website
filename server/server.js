const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sq = require("./Middleware/database");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["https://react-crypto-website-ur7w.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(express.json());

const userRoutes = require("./Routes/user");

app.use(userRoutes);

sq.sync()
  .then((result) => {
    app.listen(9000);
  })
  .catch((err) => {
    console.log(err);
  });
