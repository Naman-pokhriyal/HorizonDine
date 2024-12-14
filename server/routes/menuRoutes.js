const express = require("express");
const { getMenu, addMenuItem } = require("../controllers/menuController");
const upload = require("../middleware/multer");
const router = express.Router();

router.get("/all", getMenu);
router.post("/add", upload.single("image"), addMenuItem);
// router.put("/:itemID/update", updateMenuItem);

module.exports = router;
