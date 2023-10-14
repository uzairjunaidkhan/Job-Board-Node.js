const express = require("express");
const router = express.Router();
const Job = require("../model/Job");

// POST - Create a new job listing (for employers)
router.post("/create", async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res
        .status(403)
        .json({ message: "Only employers can create job listings" });
    }

    let newJob = new Job(
        {
      title: req.body.title,
      description: req.body.description,
      requirements: req.body.requirements,
      companyId: req.user.userId,
      isFeatured: req.body.isFeatured,
    }
    );
    newJob = await newJob.save();
    return res.status(400).json({ message: "Job listing created successfully", job: newJob});
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Job listing creation failed", error: err });
  }
});

// GET - Get a list of all jobs 
router.get("/list", async (req, res) => {
  try {
    let jod = await Job.find();
    return res.status(200).json({ message: "Job fetch successfully", jods: jod });
  } catch (err) {
    return res.status(400).json({ message: "Failed to fetch jobs.", error: err });
  }
});

// GET - Get a list of my jobs
router.get("/my/list", async (req, res) => {
    // You may need to implement user authentication to fetch the jobs for the currently logged in user
    const companyId = req.user.userId;
  try {
    let jod = await Job.find({ companyId });
    return res.status(200).json({ message: "Job fetch successfully", jods: jod });
  } catch (err) {
    return res.status(400).json({ message: "Failed to fetch jobs.", error: err });
  }
});

// GET - Get details of a specific job
router.get("/single/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found.'" });
    }
    return res.status(200).json({ message: "Job found successfully", job: job });
  } catch (err) {
    return res.status(400).json({ message: "Failed to fetch job", error: err });
  }
});

// PUT - Update a job listing (for employers)
router.put("/update/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    const updateJob = await Job.findByIdAndUpdate(jobId, {
        title: req.body.title,
        description: req.body.description,
        requirements: req.body.requirements,
        companyId: req.user.userId,
        isFeatured: req.body.isFeatured,
      }, { new: true });
    if (!updateJob) {
      return res.status(404).json({ message: "Job not found.'" });
    }
    return res
      .status(400)
      .json({ message: "Job updated successfully", updateJob: updateJob });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Failed to update job listing.", error: error });
  }
});

// DELETE - Delete a job listing (for employers)
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleteJob = await Job.findByIdAndRemove(req.params.id);
    if (!deleteJob) {
      return res.status(400).json({ message: "Job not found." });
    }
    return res.status(400).json({ message: "Job listing deleted" });
  } catch (err) {
    return res.status(400).json({ message: "Failed to delete job.", error: err });
  }
});

module.exports = router;
