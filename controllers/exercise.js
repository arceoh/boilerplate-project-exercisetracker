const asyncHandler = require("express-async-handler");

const { User } = require("../models/userModel");
const { Exercise } = require("../models/exerciseModel");

const createExercise = asyncHandler(async (req, res) => {
  const { _id, duration, date, description } = req.body;

  const userId = req.params.id;

  if (!description || !duration) {
    res.json({ error: "Fill in Required Feilds" });
  }

  const uID = userId ? userId : _id;

  const user = await User.findOne({ _id: uID });
  if (!user) {
    res.json({ id: uID, error: "User Not Found" });
  }

  console.log("_id: ", user._id);
  console.log("username: ", user.username);
  console.log("duration: ", duration);
  console.log("date: ", date);
  console.log("description: ", description);

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

const getExercise = asyncHandler(async (req, res) => {
  res.json({ message: "Getting Exercise" });
});

module.exports = { createExercise, getExercise };
