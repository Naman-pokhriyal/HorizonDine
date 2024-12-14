const express = require("express");
const { getCustomer, addCustomer } = require("../controllers/custController");
const router = express.Router();

router.get("/all", getCustomer);
router.post("/add", addCustomer);

module.exports = router;
