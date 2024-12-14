const Menu = require("../schema/menu");

const getMenu = async (req, res) => {
  try {
    const menu = await Menu.find();
    res.status(200).json(menu);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

const addMenuItem = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    const newMenuItem = new Menu({
      name,
      price,
      description,
      category,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : `/uploads/defaultMenuImg.png`,
    });
    await newMenuItem.save();

    req.app.get("io").emit("menuItemAdded", newMenuItem);
    res.status(200).json(newMenuItem);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getMenu, addMenuItem };
