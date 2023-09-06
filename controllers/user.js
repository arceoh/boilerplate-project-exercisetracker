const asyncHandler = require("express-async-handler");

const { User } = require("../models/userModel");

const createUser = asyncHandler(async (req, res) => {
  const { username } = req.body;

  if (!username) {
    res.status(400);
    throw new Error("Username is required");
  }

  const existingUser = await User.findOne({ username: username });

  if (existingUser) {
    res.json({ username: existingUser.username, _id: existingUser._id });
  } else {
    // Create new user
    const newUser = await User.create({
      username: username,
    });
    await newUser.save();
    res.json({ username: newUser.username, _id: newUser._id });
  }
});

const getUser = asyncHandler(async (req, res) => {
  res.json({ message: "Getting User" });
});

module.exports = { createUser, getUser };
