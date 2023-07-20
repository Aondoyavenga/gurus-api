import mongoose from 'mongoose'

const { model, Schema } = mongoose

const customerSchema = new Schema({
    firstName: {
        type: String,
        min: [3, 'Minimum length is 3'],
        required: [true, 'First name is required'],
    },
    lastName: {
        type: String,
        min: [3, 'Minimum length is 3'],
        required: [true, 'Last name is required']
    },
    phoneNumber: {
        type: String,
        default: 0
    },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Inactive']
    }
   
}, {
    timestamps: true
})

export const Customer = model('Customer', customerSchema)