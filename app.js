const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Route imports
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const registerRoute = require("./routes/registerRoute");
const doctorRoute = require("./routes/doctorRoute");
const adminRoutes = require("./routes/adminRoutes");
const logoutRoute = require("./routes/logoutRoute");

// Initialize express app
const app = express();
require('dotenv').config();

// Middlewares
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// Database connection
const dbURI = process.env.DATABASE;
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB:", err));

// Routes
app.use(authRoutes);
app.use(registerRoute);
app.use(doctorRoute);
app.use(patientRoutes);
app.use(adminRoutes);
app.use(logoutRoute);

// Root route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Server setup
const port = process.env.PORT ||3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
