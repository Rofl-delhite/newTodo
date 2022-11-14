const mongoose = require("mongoose");
const userLocal = require("./userLocalSchema");
const results = await userLocal.find({
  name: "Ayush",
});
await results.forEach(console.dir);
