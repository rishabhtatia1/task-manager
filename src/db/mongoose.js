const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((resp) => console.log("Connected to db"))
  .catch((err) => console.log(err));
