const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Connect mongoose
mongoose.connect('mongodb://localhost:27017/funny_db', {useNewUrlParser: true})
mongoose.set('useCreateIndex', true)

// Routes
const pictureRoutes = require("./picture/routes");
const gifRoutes = require("./gif/routes");
const gameRoutes = require("./game/routes");
const videoRoutes = require("./video/routes");

// Middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())

// Api handling
app.use("/picture", pictureRoutes);
app.use("/gif", gifRoutes);
app.use("/game", gameRoutes);
app.use("/video", videoRoutes);

// Error handling
app.use((req, res, next) => {
  let error = new Error("not found");
  error.status = 404;
  next(error);
})
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

