import express from "express";
import { router } from "./routes/router.js";
import session from "express-session";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.set("etag", "weak"); // Default is weak ETags

// Session Middleware
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.get("/", (req, res) => {
  if (req.session.user) {
    res.render("Dash", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});

// Middleware to parse URL-encoded data (for form submissions)
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON (if needed for APIs)

app.use(express.json());

app.use(express.static("public"));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Home route
app.use("/", router);

// Start the server
app.listen(PORT, () => {
  console.log(`LuxeNest app is running on http://localhost:${PORT} ✔️`);
});
