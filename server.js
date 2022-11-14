const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userLocal = require("./userLocalSchema");
const tasks = require("./taskSchema");
const keys = require("./keys");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/login.html"));
});
app.post("/tasks/create", (req, res) => {
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
app.delete("/tasks/delete", async (req, res) => {
  let { id } = req.body;
  await tasks.deleteOne({ id });
  res.send("delete successfull");
});
app.put("/tasks/update", async (req, res) => {
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
app.get("/tasks", (req, res) => {
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
app.post("/submit", (req, res) => {
  let { name, email, password } = req.body;
  userLocal.findOne({ email: email }, (err, data) => {
    if (err) throw err;
    if (!data) {
      userLocal({
        name,
        email,
        password,
      }).save();
      res.redirect("/login");
    } else {
      res.redirect("/login");
    }
  });
});
app.get("/log-in", (req, res) => {
  let { email, password } = req.query;
  userLocal.findOne({ email: email }, (err, data) => {
    if (err) throw err;
    if (data.password === password) {
      res.redirect("/tasks?user=" + email);
    } else {
      res.redirect("/login");
    }
  });
});

mongoose.connect(keys.mongoURI);
app.listen(3000, () => {
  console.log("http://localhost:3000");
});
