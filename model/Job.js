const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  companyId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the employer
  applications: [{ type: Schema.Types.ObjectId, ref: "Application" }],
  isFeatured : {type: Boolean, default: false},
  jobType: String,
  location: { type: String, required: true },
  nature: { type: String, required: true },
  // Add additional fields for job details, such as location, salary, etc.
});

module.exports = mongoose.model('Job', JobSchema);