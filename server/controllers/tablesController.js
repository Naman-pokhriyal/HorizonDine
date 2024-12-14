const Table = require("../schema/table");

const getAllTables = async (req, res) => {
  try {
    const allTables = await Table.find();
    res.status(200).json(allTables);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const addTable = async (req, res) => {
  try {
    const { no, capacity } = req.body;
    if (!no || !capacity) {
      return res
        .status(400)
        .json({ error: "Table number and capacity are required." });
    }
    const newTable = new Table({
      no,
      capacity,
    });

    await newTable.save();

    req.app.get("io").emit("tableAdded", newTable);
    res.status(201).json(newTable);
  } catch (error) {
    res.status(500).json({ error: "Failed to add table." });
  }
};

const setStatus = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    table.status = req.body.status;
    await table.save();

    req.app.get("io").emit("tableUpdated", table);

    res.status(200).json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getAllTables, addTable, setStatus };
