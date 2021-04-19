import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { IUser } from "../models/user";

const router = express.Router();
const User = mongoose.model("User");

router.post("/login/sign-up", (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  };

  const userdb = new User(user).save();

  if (userdb) {
    return res.status(200).json({ message: "sign-up-success" });
  } else {
    return res.status(500).send({ message: "sign-up-failed" });
  }
});

router.post("/login/sign-in", (req, res) => {
  return User.findOne({ email: req.body.email }, (err: any, user: IUser) => {
    if (err || !user) {
      return res.status(500).json({ message: "user_not_found" });
    }

    const same = bcrypt.compareSync(req.body.password, user.password);

    if (same) {
      const jwt = setToken(user);
      return res.status(200).json(jwt);
    } else {
      return res.status(500).json({ message: "wrong_credentials" });
    }
  });
});

export function setToken(user: IUser) {
  // TODO Token expire
  return jsonwebtoken.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    "SECRET_TOKEN",
    {
      algorithm: "HS256",
      issuer: "BOTMIND_API",
    }
  );
}

module.exports = router;
