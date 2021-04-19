import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

mongoose.connect("mongodb://localhost:27017/db", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

const db = mongoose.connection;
db.on("error", (err) => {
  console.log("Error connecting to DB");
});

const app = express();
const PORT = 1000;

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// * Use middleware
const authMiddleware = require("./middleware/auth-middleware");
app.use(authMiddleware);

// * Importe models
require("./models/user");
require("./models/tweet");

// * Use routes
const login = require("./routes/login");
const tweet = require("./routes/tweet");

app.use(login);
app.use(tweet);

// * Launch serveur when DB is connected
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
  });
});