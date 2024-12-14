const express = require("express");
const {
  getAllTables,
  addTable,
  setStatus,
} = require("../controllers/tablesController");
const router = express.Router();

router.get("/all", getAllTables);
router.post("/add", addTable);
router.post("/:id/status", setStatus);

module.exports = router;
