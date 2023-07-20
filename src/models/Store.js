import mongoose from 'mongoose'

const { model, Schema } = mongoose


const storeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Store name is required']
    },
    users: [
       {
           default: null,
           type: Schema.Types.ObjectId, ref: 'user'
       }
    ],
    status: {
        type: String,
        default: 'Active'
    }
}, {
    timestamps: true
})


export const Store = model('store', storeSchema)
