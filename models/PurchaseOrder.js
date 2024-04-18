const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchaseOrderSchema = new Schema({
    quote_id: {
        type: Schema.Types.ObjectId,
        ref: 'Quote',
        required: true,
    },
    order_id: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    amount: {
        type: Double,
        required: true,
    },
});

const PurchaseOrderModel = mongoose.model('PurchaseOrder', PurchaseOrderSchema);

module.exports = PurchaseOrderModel;