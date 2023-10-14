const express = require("express");
const app = express();
// const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan")

const userRoute = require("./routes/user.js");
const jobRoute = require("./routes/job.js");
const applicationRoute = require("./routes/application.js");

const authJwt = require('./helper/jwt.js');
const errorHandler = require('./helper/error-handler.js');
const port = process.env.port || 5000;
dotenv.config();

mongoose
  .connect(process.env.mongo_url, {
      useNewUrlParser: true,
      dbName: 'job-board'
  })
  .then(() => console.log("mongo db is connectd successfully!"))
  .catch((err) => {
    console.log(err);
  });
  
//middleware
// app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);
// app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

// //routes
app.use("/api/user", userRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);

app.listen(port, () => {
  console.log("server running on", { port });
});

