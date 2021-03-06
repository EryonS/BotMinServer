import express from "express";
import mongoose from "mongoose";

const router = express.Router();
const User = mongoose.model("User");
const Tweet = mongoose.model("Tweet");

router.get("/tweet/latest", (req: any, res) => {
  Tweet.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .then((tweets) => {
      return res.send(tweets);
    });
});

router.get("/tweet/getMoreTweets/:skip", async (req: any, res) => {
  if (!req.params.skip) {
    return res.status(500).json({ message: "loading_failed" });
  }
  const tweets = await Tweet.find({})
    .sort({ createdAt: -1 })
    .skip(+req.params.skip)
    .limit(10);

  if (!tweets.length) {
    return res.json({ message: "stop" });
  }

  return res.json({ tweets });
});

router.post("/tweet/publish-tweet", (req: any, res) => {
  const tweet = {
    message: req.body.message,
    user: {
      _id: req.user._id,
      name: req.user.name,
    },
  };

  new Tweet(tweet)
    .save()
    .then((tweet) => {
      return res.send(tweet);
    })
    .catch((err) => {
      return res.status(500).send();
    });
});

router.put("/tweet/update-tweet", async (req: any, res) => {
  if (!req.body._id || !req.body.message) {
    return res.status(500).send();
  }

  const tweet = await Tweet.findOne({
    _id: req.body._id,
    "user._id": req.user._id.toString(),
  });

  if (!tweet) {
    return res.status(500).json({ message: "unauthorized" });
  }

  const newTweet = await Tweet.findOneAndUpdate(
    { _id: req.body._id },
    { message: req.body.message },
    { new: true }
  );

  return res.status(200).json(newTweet);
});

router.delete("/tweet/delete-tweet/:tweet_id", async (req: any, res) => {
  const tweet = await Tweet.findOne({
    _id: req.params.tweet_id,
    "user._id": req.user._id.toString(),
  });

  if (!tweet) {
    return res.status(500).json({ message: "unauthorized" });
  }

  Tweet.findOneAndDelete({ _id: req.params.tweet_id })
    .then(() => {
      return res.status(200).json({ message: "tweet_deleted" });
    })
    .catch((err) => {
      return res.status(500).send();
    });
});

router.delete("/tweet/delete-account/:evenData", (req: any, res) => {
  User.deleteOne({ _id: req.user._id }).exec();

  if (req.params.evenData === "true") {
    Tweet.deleteMany({ "user._id": req.user._id }).exec();
  }

  return res.send();
});

module.exports = router;
