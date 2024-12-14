const express = require("express");
const {
  getAllOrders,
  addOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/ordersController");
const router = express.Router();

router.get("/all", getAllOrders);
router.post("/add", addOrder);
router.put("/:id/update", updateOrder);
router.delete("/:id/delete", deleteOrder);

module.exports = router;
