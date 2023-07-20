import mongoose from 'mongoose'

const { model, Schema } = mongoose
const orderItemSchema = new Schema({
    orderRow: {
        type: String,
        unique: true
    },
    orderId: {
        type: String,
        set: e => e.toString()
    },
  
   orderType: {
       type: String,
       default: 'SALE',
        enum: ['PURCHASE', 'SALE']
   },
   SKU_UPC: String,
    productRef: {
        type: Schema.Types.ObjectId, ref: 'Product'
    },
    quantity: Number,
    amount: Number,
    discount: Number,
    total: Number,
    Qty: Number,
    status: String

}, {
    timestamps: true
})

export const Orderitem = model('Orderitem', orderItemSchema)