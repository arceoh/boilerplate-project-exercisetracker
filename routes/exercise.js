const express = require("express");
const router = express.Router();

const { createExercise, getExercise } = require("../controllers/exercise.js");

router.post("/", createExercise);
router.get("/:id", getExercise);

module.exports = router;
