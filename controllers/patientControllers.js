const Patient = require("../models/patient");

module.exports.preview_prescription = async (req, res) => {
  const id = req.params.id;
  const healthID = req.patient.healthID;
  try {
    const patient = await Patient.findOne({ healthID });
    const prescription = patient.prescriptions.filter((pres) => pres._id == id);
    res.status(200).json({ prescription });
  } catch (err) {
    res.status(404).json({ error: "Something went wrong..." });
  }
};

module.exports.get_patient = async (req, res) => {
  let patient = req.patient;
  res.status(200).json({ patient });
};


module.exports.login_patient = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password)
  try {
    const patient = await Patient.findByCredentials(email, password);
    const token = await patient.generateAuthToken();
    res.status(200).json({ patient, token });
  } catch (err) {
    res.status(400).json({ err });
  }
}