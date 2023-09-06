const asyncHandler = require("express-async-handler");

const { User } = require("../models/userModel");

const createUser = asyncHandler(async (req, res) => {
  res.json({ message: "User Created" });
});

const getUser = asyncHandler(async (req, res) => {
  res.json({ message: "Getting User" });
});

module.exports = { createUser, getUser };
