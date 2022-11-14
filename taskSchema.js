const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  task: String,
  description: String,
  assignedTo: String,
  id: Number,
});
module.exports = new mongoose.model("task", taskSchema);
