import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

let TweetSchema = new Schema(
  {
    message: {
      type: String,
      trim: true,
    },

    user: {
      _id: {
        type: ObjectId,
        ref: "User",
      },

      name: {
        type: String,
      },
    },
  },
  { timestamps: true, versionKey: false }
);

let Tweet = mongoose.model("Tweet", TweetSchema);

module.exports = Tweet;
