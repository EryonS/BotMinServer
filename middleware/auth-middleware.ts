import express from "express";
import jsonwebtoken from "jsonwebtoken";

const router = express.Router();

router.use("/tweet", (req: any, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(500).send();
  }

  const decoded: any = jsonwebtoken.verify(token, "SECRET_TOKEN", {
    issuer: "BOTMIND_API",
  });

  if (decoded) {
    req.user = {
      _id: decoded._id,
      name: decoded.name,
      email: decoded.email,
    };
    next();
  } else {
    return res.status(500).send();
  }
});

module.exports = router;
