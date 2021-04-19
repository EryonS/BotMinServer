import mongoose from "mongoose";

const Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      unique: true,
    },

    password: {
      type: String,
      trim: true,
    },
  },
  { timestamps: false, versionKey: false }
);

let User = mongoose.model("User", UserSchema);

module.exports = User;

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
}
