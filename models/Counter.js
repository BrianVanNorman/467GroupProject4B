const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema({
    _id: String,  // the name of the model
    seq: { type: Number, default: 0 }  // last value used
  });

  function getNextSequence(name) {
    return Counter.findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    ).exec();
  }
  
  
  const Counter = mongoose.model('Counter', counterSchema);
  module.exports = Counter;