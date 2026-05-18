// routes/doctors.js — Public Doctor Routes
const express          = require("express");
const router           = express.Router();
const doctorController = require("../controllers/doctorController");

router.get("/",    doctorController.getAllDoctors);
router.get("/:id", doctorController.getDoctorDetail);

module.exports = router;
