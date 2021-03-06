import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";

// mongoose.connect("mongodb://localhost:27017/db", {
//   useCreateIndex: true,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: true,
// });

mongoose.connect(
  "mongodb+srv://mongo-admin:mongoPass14789@cluster0.hi9br.mongodb.net/db?retryWrites=true&w=majority",
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  }
);

const db = mongoose.connection;
db.on("error", (err) => {
  console.log("Error connecting to DB");
});

const app = express();
const PORT = process.env.PORT || 8080;

const allowList = [
  "https://botmind-app.herokuapp.com",
  "http://localhost:4200",
];

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (origin && allowList.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("NOT ALLOWED"));
    },
  })
);
app.use(helmet());
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
