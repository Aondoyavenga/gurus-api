import mongoose from 'mongoose'

const { model, Schema } = mongoose


const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Product name is required']
    },
    subCategory: [
       {
           default: null,
           type: Schema.Types.ObjectId, ref: 'Subcategory'
       }
    ],
    status: {
        type: String,
        default: 'Active'
    }
}, {
    timestamps: true
})


export const Category = model('Category', categorySchema)
