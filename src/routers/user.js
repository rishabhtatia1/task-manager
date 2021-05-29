const router = require("express").Router();
const User = require("../models/user");

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.get("/users/:id", async (req, res) => {
  const _id = req?.params?.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));
  const _id = req?.params?.id;
  if (!isValid) {
    return res.status(400).send({ error: "Invalid Updates" });
  }
  try {
    const user = await User.findByIdAndUpdate(_id, req?.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.delete("/users/:id", async (req, res) => {
  const _id = req?.params?.id;
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const resp = await user.save();
    res.status(201).send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = router;
