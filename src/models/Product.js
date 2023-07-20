import mongoose from 'mongoose'
const { model, Schema } = mongoose
const productSchema = new Schema({
    SKU_UPC: {
        type: String,
        required: [true, 'SKU/UPC is required']
    },
    productName: {
        type: String,
        required: [true, 'Product name is required']
    },
    category: {
        type: Schema.Types.ObjectId, ref: 'Category'
    },
    subCategory: {
        type: Schema.Types.ObjectId, ref: 'Subcategory'
    },
    purchasePrice: Number,
    salesPrice: Number,
    bulkPrice: Number,
    discount:{
        type: Number,
        default: 0
    }, 
    quantity: {
        type: Number,
        default: 0
    },
    increaseRate: {
        type: Number,
        default: 0 
    },
    status: {
        type: String,
        default: 'Active'
    }
}, {
    timestamps:true
})

productSchema.methods.updateQty = async function(id, type, qty) {
   
    const product = await Product.findById(id)
    const quantity = product.quantity

    const newQty = type == 'SALE' ? parseInt(quantity) - parseInt(qty) : parseInt(quantity)+parseInt(qty)
    
   return this.model('Product').findByIdAndUpdate(id, {$set: {quantity: newQty}})
}

export const Product = model('Product', productSchema)
