const express = require("express");
const cors = require("cors");
require("./src/db/mongoos-conn");
const userRouter = require("./src/Router/user-router");
const dietRouter = require("./src/Router/diet-router");
const lunchRouter = require("./src/Router/lunch-router");
const breakfastRouter = require("./src/Router/breakfast-router");
const dinnerRouter = require("./src/Router/dinner-router");
const app = express();
const BASE_URL = process.env.BASE_URL;
const port = process.env.PORT || 3000;

app.use(cors());
// const path = require("path")
// const publicDirectoryPath = path.join(__dirname, './biteCounter')

// app.use(express.static(publicDirectoryPath));

app.use(userRouter);
app.use(dietRouter);
app.use(lunchRouter);
app.use(breakfastRouter);
app.use(dinnerRouter);

app.listen(port, () => {
  console.log(`Server is up on http://${BASE_URL}:${port}`);
});
