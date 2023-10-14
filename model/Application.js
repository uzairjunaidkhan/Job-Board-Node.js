const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobApplicationSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  applicantId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the job seeker
  resumeURL: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  // Add additional fields for application details and employer feedback
});

module.exports = mongoose.model('Application', JobApplicationSchema);