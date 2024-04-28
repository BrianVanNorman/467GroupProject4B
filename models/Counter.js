const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema({
    _id: String,  // Identifier for the counter
    seq: { type: Number, default: 0 }  // Current sequence number
});

const getNextSequence = async (name) => {
    const result = await Counter.findOneAndUpdate(
        { _id: name },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    console.log("Next sequence for ", name, ": ", result.seq);
    return result;
};

const Counter = mongoose.model('Counter', counterSchema);
module.exports = { Counter, getNextSequence };