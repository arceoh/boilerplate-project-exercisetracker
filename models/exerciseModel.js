const mongoose = require("mongoose");

const exerciseSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, required: false },
  },
  { timestamps: true }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = { Exercise };
