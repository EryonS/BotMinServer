"use strict";

const config = require("config");
const express = require("express");
const passport = require("passport");
const moment = require("moment");
const mongoose = require("mongoose");
const validator = require("validator");
const Phone = require("awesome-phonenumber");
const missingBackupCode = require("./utils/missingBackupCode");

const User = mongoose.model("User");
const router = express.Router();

module.exports = router;
