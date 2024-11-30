const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
   title: {
      type: String,
      require: true
   },
   description: {
      type: String,
      require: true
   },
   status: {
      type: String,
      default:'todo'
   }
}, { timestamps: true })

const Task = mongoose.model("Task", TaskSchema)
module.exports = Task;