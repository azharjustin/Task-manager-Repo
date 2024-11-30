const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
   first_name: {
      type: String,
      require:true
   },
   last_name: {
      type: String,
      require: true
   },
   email: {
      type: String,
      require: true,
      unique: true,
   },
   password: {
      type: String,
      require: true
   }
}, { timestamps: true })

const User = mongoose.model('User', UserSchema);
module.exports = User;