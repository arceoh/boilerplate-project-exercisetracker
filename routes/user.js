const express = require("express");
const router = express.Router();

const {
  createUser,
  getUser,
  getAllUser,
  addUserExcercise,
  getUserExercises,
} = require("../controllers/user.js");

router.post("/", createUser);
router.get("/", getAllUser);
router.get("/:id", getUser);

router.post("/:_id/exercises", addUserExcercise);
router.get("/:_id/logs", getUserExercises);

module.exports = router;
