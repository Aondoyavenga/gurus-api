import mongoose from 'mongoose'

const { model, Schema } = mongoose

const vendorSchema = new Schema({
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
    phoneNumber: String,
   
}, {
    timestamps: true
})

export const Vendor = model('Vendor', vendorSchema)