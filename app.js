const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const app = express();

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// View engine
app.set("view engine", "ejs");

// Database connection
const dbURI =
  "mongodb+srv://Aman:14924@nodeexpressprojects.jgwcq.mongodb.net/jwtbasics?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(3000, () => console.log("Server running on port 3000"))
  )
  .catch((err) => console.log("Database connection error:", err));

// Routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);
