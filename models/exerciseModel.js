const mongoose = require("mongoose");

const exerciseSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: String,
    duration: Number,
    date: Date,
  },
  { timestamps: true }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = { Exercise };
