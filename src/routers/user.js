const router = require("express").Router();
const multer = require("multer");
const sharp = require("sharp");
const { sendWelcomeMail } = require("../emails/account");
const auth = require("../middleware/auth");
const User = require("../models/user");

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));
  const _id = req?.params?.id;
  if (!isValid) {
    return res.status(400).send({ error: "Invalid Updates" });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    req.user.remove();
    res.send(req.user);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    // sendWelcomeMail(user.email, user.name)
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req?.body?.email,
      req?.body?.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png )/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

router.get("/users/:id/avatar", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user?.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch {
    res.status(404).send();
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req?.file?.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

module.exports = router;
