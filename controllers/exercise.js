const asyncHandler = require("express-async-handler");

const { User } = require("../models/userModel");
const { Exercise } = require("../models/exerciseModel");

const createExercise = asyncHandler(async (req, res) => {
  res.json({ message: "Exercise Created" });
});

const getExercise = asyncHandler(async (req, res) => {
  res.json({ message: "Getting Exercise" });
});

module.exports = { createExercise, getExercise };
