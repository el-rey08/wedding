const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  qrCode: {
    type: String,
    unique: true
  },
  accessToken: {
    type: String,
    unique: true
  },
  uploads: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Upload'
  }]
}, { 
  timestamps: true 
})
const Event = mongoose.model('event', EventSchema);

module.exports = Event;
