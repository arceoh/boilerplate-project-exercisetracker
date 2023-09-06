const asyncHandler = require("express-async-handler");

const { User } = require("../models/userModel");
const { Exercise } = require("../models/exerciseModel");

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

const addUserExcercise = asyncHandler(async (req, res) => {
  const { userID, description, duration, date } = req.body;

  if (!userID || !description || !duration) {
    res.json({ error: "All Fields are Required" });
  }

  const user = await User.findOne({ _id: userID });

  if (!user) {
    res.json({ error: "User Not Found" });
  }

  const dateObj = date ? new Date(date) : new Date();

  const newExercise = await Exercise.create({
    userId: userID,
    description: description,
    duration: duration,
    date: dateObj,
  });
  await newExercise.save();

  // Format response
  const originalDateStr = dateObj;
  const originalDate = new Date(originalDateStr);

  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const formattedDate = originalDate.toLocaleDateString(undefined, options);

  const message = {
    _id: user._id,
    username: user.username,
    date: formattedDate,
    duration: newExercise.duration,
    description: newExercise.description,
  };

  res.json(message);
});

const getUserExercises = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params._id });

  const { limit, to, from } = req.query; // Extract query parameters
  console.log("Limit: ", limit);
  console.log("to: ", to);
  console.log("from: ", from);

  const limitResults = limit ? parseInt(limit) : 10000;

  const searchFilters = {
    userId: req.params._id,
  };

  if (from) {
    searchFilters.date = { $gte: new Date(from) };
  }
  if (to) {
    if (searchFilters.date) {
      searchFilters.date.$lte = new Date(to);
    } else {
      searchFilters.date = { $lte: new Date(to) };
    }
  }

  const excercises = await Exercise.find(searchFilters).limit(limitResults);

  if (!excercises) {
    res.json({ error: "No Excercises Found" });
  }

  const message = {
    _id: user._id,
    username: user.username,
    count: excercises.length,
    log: excercises,
  };

  res.json(message);
});

const getUser = asyncHandler(async (req, res) => {
  res.json({ message: "Getting User" });
});

const getAllUser = asyncHandler(async (req, res) => {
  const user = await User.find({});
  res.json(user);
});

module.exports = {
  createUser,
  getUser,
  getAllUser,
  addUserExcercise,
  getUserExercises,
};
