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

  console.log("dateObj: ", dateObj);

  const newExercise = await Exercise.create({
    userId: userID,
    description: description,
    duration: duration,
    date: dateObj,
  });
  await newExercise.save();

  // Format response
  const newDate = new Date(dateObj);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formattedDate = `${weekdays[newDate.getUTCDay()]} ${
    months[newDate.getUTCMonth()]
  } ${newDate.getUTCDate()} ${newDate.getUTCFullYear()}`;

  const message = {
    _id: userID,
    username: user.username,
    date: formattedDate,
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
