const asyncHandler = require("express-async-handler");

const { User } = require("../models/userModel");
const { Exercise } = require("../models/exerciseModel");

const createExercise = asyncHandler(async (req, res) => {
  const { _id, duration, date, description } = req.body;

  if (!_id || !description || !duration) {
    res.json({ error: "Fill in Required Feilds" });
  }

  const user = await User.findOne({ _id: _id });
  if (!user) {
    res.json({ error: "User Not Found" });
  }

  console.log("_id: ", _id);
  console.log("username: ", user.username);
  console.log("duration: ", duration);
  console.log("date: ", date);
  console.log("description: ", description);

  const dateObj = date ? new Date(date) : new Date();

  const newExercise = await Exercise.create({
    userId: _id,
    description: description,
    duration: duration,
    date: dateObj,
  });
  await newExercise.save();

  const message = {
    _id: _id,
    username: user.username,
    date: dateObj.toDateString(),
    duration: newExercise.duration,
    description: newExercise.description,
  };

  res.json(message);
});

const getExercise = asyncHandler(async (req, res) => {
  res.json({ message: "Getting Exercise" });
});

module.exports = { createExercise, getExercise };
