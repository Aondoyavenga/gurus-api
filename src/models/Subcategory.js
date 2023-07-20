import mongoose from 'mongoose'

const { model, Schema } = mongoose


const subCategorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required']
    },
    categoryRef: {
        type: Schema.Types.ObjectId, ref: 'Category'
    },
    productRef: [{
        default: null,
        type: Schema.Types.ObjectId, ref: 'Product'
    }]
}, {
    timestamps: true
})

export const Subcategory = model('Subcategory', subCategorySchema)
