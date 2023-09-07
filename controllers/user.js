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
  const { _id, description, duration, date } = req.body;

  const userId = req.params._id;

  const uID = userId ? userId : _id;

  if (!description || !duration) {
    console.log("All Fields are Required");
    console.log("req.body", req.body);
    console.log("userID: ", _id);
    console.log("description: ", description);
    console.log("duration: ", duration);
    console.log("date: ", date);
    res.json({ error: "Required feilds must be filled in." });
  }

  const user = await User.findOne({ _id: uID });

  if (!user) {
    res.json({
      message: "User Not Found",
      error: "User Not Found - user.js",
    });
  }

  const dateObj = date ? new Date(date) : new Date();

  const newExercise = await Exercise.create({
    userId: user._id,
    description: description,
    duration: duration,
    date: dateObj,
  });
  await newExercise.save();

  const message = {
    _id: user._id,
    username: user.username,
    date: dateObj.toDateString(),
    duration: newExercise.duration,
    description: newExercise.description,
  };

  res.json(message);
});

// /:_id/exercise/logs?
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

  const exercises = await Exercise.find(searchFilters)
    .select("-createdAt -updatedAt -__v -_id -userId")
    .limit(limitResults);

  if (!exercises) {
    res.json({ error: "No Exercises Found" });
  }

  const formattedExercises = exercises.map((exercise) => ({
    ...exercise.toObject(), // Convert to plain object
    date: exercise.date.toDateString(), // Format the date field
  }));

  const message = {
    _id: user._id,
    username: user.username,
    count: exercises.length,
    log: formattedExercises,
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
