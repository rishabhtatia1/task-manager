const express = require("express");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const resp = await user.save();
    res.status(201).send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    const resp = await task.save();
    res.status(201).send(task);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
