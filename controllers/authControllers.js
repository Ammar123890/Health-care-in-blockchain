const Admin = require("../models/admin");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60;
const { createToken } = require("../utils/createToken");
const handleError = (err) => {
  let errors = { email: "", password: "" };
  if (err.message.includes("Invalid Email.")) {
    errors.email = "Please enter a valid Email.";
  }
  if (err.message.includes("Incorrect Password")) {
    errors.password = "Incorrect password";
  }
  if (err.message.includes("Please enter email")) {
    errors.email = "Please enter email";
  }
  if (err.message.includes("Please enter a valid email")) {
    errors.email = "Please enter a valid email";
  }
  if (err.message.includes("Please enter password")) {
    errors.password = "Please enter password";
  }
  return errors;
};

module.exports.admin_login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.login(email, password);
    const token = createToken(admin._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ admin });
  } catch (err) {
    res.status(400).json({ errors: handleError(err) });
  }
};

module.exports.auth = async (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ msg: "Authentication required. Please login." });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    
    const admin = await Admin.findById(decodedToken.id);
    const patient = await Patient.findById(decodedToken.id);
    const doctor = await Doctor.findById(decodedToken.id);

    if (admin) {
      return res.status(200).json({ msg: "Admin Login Found" });
    } else if (patient) {
      return res.status(200).json({ msg: "Patient Login Found" });
    } else if (doctor) {
      return res.status(200).json({ msg: "Doctor Login Found" });
    } else {
      return res.status(404).json({ msg: "User not found. Proceed to login." });
    }
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Invalid token. Please login again." });
  }
};


module.exports.get_admin = async (req, res) => {
  let admin = req.Admin;
  res.status(200).json({ admin });
};


