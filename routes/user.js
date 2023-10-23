const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

router.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists", error: err });
    }

    const hashPassword = await bcrypt.hashSync(req.body.password, 10);

    let newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      role: req.body.role,
      profile: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        companyName:
          req.body.role === "employer" ? req.body.companyName : undefined,
        resumeURL:
          req.body.role === "jobSeeker" ? req.body.resumeURL : undefined,
      },
    });
    const savedUser = await newUser.save();
    res
      .status(200)
      .json(savedUser);
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const key = process.env.key;
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exists", error: err });
    }

    const isPasswordValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, key, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .json({ message: "Login successful", token: token, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
});

router.get("/list", async (req, res) => {
  try {
    let user = await User.find();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "failed", error: err });
  }
});

router.get("/single/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id).select("-passwordHash");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "failed", error: err });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    if (req.user.userId !== req.params.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this profile" });
    }

    const existingUser = await User.findById(req.params.id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.username) {
      existingUser.username = req.body.username;
    }
    if (req.body.email) {
      existingUser.email = req.body.email;
    }
    if (req.body.firstName) {
      existingUser.profile.firstName = req.body.firstName;
    }
    if (req.body.lastName) {
      existingUser.profile.lastName = req.body.lastName;
    }

    const updatedUser = await existingUser.save();

    res
      .status(200)
      .json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Profile update failed", error: err });
  }
});

router.delete("/delete/:id",async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.userId !== req.params.id) {
      return res.status(403).json({ message: "You are not authorized to delete this user" });
    }

    const deletedUser = await User.findByIdAndRemove(req.params.id);

    if(!deletedUser){
       return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(deletedUser);

  } catch (err) {
    return res.status(400).json({ message: 'User deletion failed', error: err });
  }
});

module.exports = router;
