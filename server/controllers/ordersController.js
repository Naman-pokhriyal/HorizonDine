const mongoose = require("mongoose");
const Order = require("../schema/order");

const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find().populate("tableID");
    res.status(200).json(allOrders);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

const addOrder = async (req, res) => {
  try {
    const { tableId, customerId, itemIDs, status, startTime } = req.body;

    const formattedItems = itemIDs.map((item) => ({
      itemID: new mongoose.Types.ObjectId(item.itemID),
      quantity: item.quantity,
    }));

    const newOrder = new Order({
      itemIDs: formattedItems,
      status,
      tableID: new mongoose.Types.ObjectId(tableId),
      custID: new mongoose.Types.ObjectId(customerId),
      startTime: new Date(startTime)
    });

    await newOrder.save();

    const populatedOrder = await Order.findById(newOrder._id)
      .populate('tableID')
      .populate('custID');
      
    req.app.get("io").emit("orderCreated", populatedOrder);

    res.status(200).json(populatedOrder);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ err: err.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
};

module.exports = { getAllOrders, addOrder, updateOrder, deleteOrder };
