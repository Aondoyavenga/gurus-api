import mongoose from 'mongoose'

const { model, Schema } = mongoose

const userSchema = new Schema({
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
    email: String,
    password: String,
    role: {
        
        trainee: {
            type: Boolean,
            default: false
        },
        staff: {
            type: Boolean,
            default: false
        },
        manager: {
            type: Boolean,
            default: false
        }
    },
    store: {

        type: Schema.Types.ObjectId, ref: 'store'
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

export const User = model('User', userSchema)