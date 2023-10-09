const express = require("express");
const mainRoute = require("./routes");
const cors = require("cors");
const { cacheData } = require("./repository");
require("dotenv").config();

const app = express();
const port = process.env.port || 2000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes imported
app.use(mainRoute);

app.listen(port, () => {
  console.log(`Server is Running On http://localhost:${port}`);
});
