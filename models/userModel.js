// models/Upload.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  
    userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  picture: {
    type: String
   
  }
 
}, { 
  timestamps: true 
});

const userModel = mongoose.model('upload', userSchema);

module.exports = userModel;
