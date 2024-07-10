const Counter = require('../models/counterModel'); 

const getNextOrderId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "orderId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const orderId = `FK${String(counter.seq).padStart(3, '0')}`;
  return orderId;
};

module.exports = {
  getNextOrderId,
};
