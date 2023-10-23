const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['jobSeeker', 'employer', 'admin'], required: true },
    profile: {
      firstName: String,
      lastName: String,
      companyName: String, // For employers
      resumeURL: String, // For job seekers
    },

});
  
  module.exports = mongoose.model('User', UserSchema);