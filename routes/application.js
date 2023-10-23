const express = require("express");
const router = express.Router();
const Application = require("../model/Application");

// POST - Submit a job application (job seeker)
router.post("/create/:jobId", async (req, res) => {

  try {
    let application = new Application({ 
      jobId: req.params.jobId,
      applicantId: req.body.applicantId,
      resumeURL: req.body.resumeURL
    });
    application = await application.save();
    res.status(200).json(application);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to submit job application.", error: err });
  }
});

// GET - Get a list of job applications for a (employee)
router.get("/emp/list/:jobId", async (req, res) => {
  // You may need to implement user authentication to fetch the jobs for the currently logged in user
  const jobId =  req.params.jobId;
  try {
  const jod = await Application.find({ jobId });
  return res.status(200).json(jod);
} catch (err) {
  return res.status(400).json({ message: "Failed to fetch jobs!", error: err });
}
});

// GET - Get a list of job applications for a user (job seeker)
router.get("/my/list", async (req, res) => {
  // You may need to implement user authentication to fetch the applications for the currently logged in user
  const applicantId = req.user.userId;
  try {
    const applications = await Application.find({ applicantId });
    res
      .status(200)
      .json(applications);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch job applications.", error: err });
  }
});

// GET - Get a list of job applications (admin)
router.get("/list", async (req, res) => {
  // You may need to implement user authentication to fetch the applications for the currently logged in user
  try {
    const applications = await Application.find();
    res
      .status(200)
      .json(applications);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch job applications.", error: err });
  }
});

// GET - Get details of a specific job application
router.get("/single/:id", async (req, res) => {
  //Get details of a specific job application
  const applicantionId = req.params.id;
  try {
    const application = await Application.findById(applicantionId);
    if (!application) {
      return res.status(404).json({ error: "Job application not found." });
    }
    res
      .status(200)
      .json(application);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch job application.", error: err });
  }
});

// PUT - Update the status of a job application (for employers)
router.put("/update/:id", async (req, res) => {
  const applicationId = req.params.id;

  try {
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status: req.body.status },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: "Job application not found." });
    }
    res.status(200).json( application );
  } catch (err) {
    res.status(500).json({ message: "Failed to update job application status.", error: err });
  }
});

// DELETE - Delete a job application (job seeker)
router.delete("/delete/:id", async (req, res) => {
  const applicationId = req.params.id;
  try {
    const application = await Application.findByIdAndRemove(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Job application not found." });
    }
    res.status(200).json( application );
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete job application.", error: err });
  }
});

module.exports = router;
