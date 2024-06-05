const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 10000;

const authRoute = require("./routers/auth")
const postsRoute = require("./routers/posts")
const usersRoute = require("./routers/users")


// expressでjson-setting
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/users", usersRoute);

app.listen(PORT, () =>
  console.log(`server is running on Port http://localhost:${PORT}`));


