require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Get routes to the variabel
const router = require("./src/routes");

const app = express();

const port = 5000;

app.use(express.json());
app.use(cors());

// static folder uploads
app.use("/uploads", express.static("uploads"));

// Add endpoint grouping and router
app.use("/api/v1/", router);

app.listen(port, () => console.log(`Listening on http://localhost:${port}!`));
