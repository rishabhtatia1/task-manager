const router = require("express").Router();
const auth = require("../middleware/auth");
const Task = require("../models/task");

router.get("/tasks", auth, async (req, res) => {
  try {
    await req.user.populate("tasks").execPopulate();
    res.send(req.user.tasks);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req?.params?.id;
  try {
    const task = await Task.findOne({ _id, owner: req?.user?._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));
  const _id = req?.params?.id;
  if (!isValid) {
    return res.status(400).send({ error: "Invalid Updates" });
  }
  try {
    const task = await Task.findOne({ _id, owner: req?.user?._id });
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req?.params?.id;
  try {
    const task = await Task.findOneAndDelete({ _id, owner: req?.user?._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.post("/tasks", auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, owner: req.user._id });
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = router;
