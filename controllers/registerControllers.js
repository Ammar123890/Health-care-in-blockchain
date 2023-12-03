const Patient = require("../models/patient");
const Admin = require("../models/admin");
const { createToken } = require("../utils/createToken");

const maxAge = 3 * 24 * 60 * 60;
const handleError = (err) => {
  let errors = { ...err };

  if (err.code === 11000) {
    errors = { ...errors, adharCard: "That AdharCard is already registered." };
    return errors;
  }

  if (err.message.includes("patient validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      if (properties && properties.path && !properties.path.includes(".")) {
        errors[properties.path] = properties.message;
      }
    });
  }

  return errors;
};



module.exports.patient_register = async (req, res) => {
  const diseases = Object.values(req.body.diseases);
  const {
    name,
    dob,
    mobile,
    email,
    adharCard,
    bloodGroup,
    address,
    password,
    contactPerson,
  } = req.body;

  const healthID = adharCard;
  try {
    const patient = await Patient.create({
      name,
      healthID,
      dob,
      mobile,
      email,
      adharCard,
      bloodGroup,
      address,
      password,
      diseases,
      contactPerson,
    });
    const token = createToken(patient._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ patient });
  } catch (err) {
    const errors = handleError(err);
    res.status(404).json({ errors });
  }
};

module.exports.patient_login = async (req, res) => {
  const { healthID, password } = req.body;
  try {
    const patient = await Patient.login(healthID, password);
    const token = createToken(patient._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ patient });
  } catch (err) {
    const errors = handleError(err);
    res.status(404).json({ errors });
  }
};

module.exports.register_admin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Create the admin
    const admin = await Admin.create({ email, password });

    // Create a token
    const token = createToken(admin._id);

    // Respond with the admin details (excluding the password) and the token
    res.status(201).json({
      admin: {
        email: admin.email,
        id: admin._id
      },
      token
    });
  } catch (err) {
    // If an error occurs, use the handleError function to get the error details
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};
