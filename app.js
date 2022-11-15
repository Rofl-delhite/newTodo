const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const keys = require("./config/keys");
const users = require("./models/users");
const tasks = require("./models/tasks");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", router);

router.get("/", (req, res) => {
  res.send("signup/login");
});
router.get("/login", (req, res) => {
  res.send("login");
});
router.post("/tasks/create", (req, res) => {
  let { task, description, assignedTo } = req.body;
  let id = Math.ceil(Math.random() * 10);
  tasks({
    task,
    description,
    assignedTo,
    id,
  }).save();
  res.send("task saved successfully");
});
router.delete("/tasks/delete", async (req, res) => {
  let { id } = req.body;
  await tasks.deleteOne({ id });
  res.send("delete successfull");
});
router.put("/tasks/update", async (req, res) => {
  let { task, description, assignedTo, id } = req.body;
  let result = await tasks.updateOne(
    { id },
    {
      $set: {
        task,
        description,
        assignedTo,
        id,
      },
    }
  );
  res.send(result);
});
router.get("/tasks", (req, res) => {
  tasks.find(
    {
      assignedTo: req.query.user,
    },
    (err, data) => {
      if (err) throw err;
      if (data) {
        res.send(data);
      }
    }
  );
});
router.post("/submit", (req, res) => {
  let { name, email, password } = req.body;
  users.findOne({ email: email }, (err, data) => {
    if (err) throw err;
    if (!data) {
      users({
        name,
        email,
        password,
      }).save();
      res.status(201).json({ message: "user saved" });
    } else {
      res.status(422).json({ error: "email already exists" });
    }
  });
});
router.get("/log-in", (req, res) => {
  let { email, password } = req.query;
  users.findOne({ email: email }, (err, data) => {
    if (err) throw err;
    if (data.password === password) {
      res.redirect("/tasks?user=" + email);
    } else {
      res.redirect("/login");
    }
  });
});
router.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  next(err);
});
router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});
mongoose.connect(keys.mongoURI);
app.listen(3000, () => {
  console.log("http://localhost:3000");
});
