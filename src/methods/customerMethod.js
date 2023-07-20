import { Customer } from "../models/Customer.js"

export const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({status: 'Active'}).select({__v: 0, password: 0, updatedAt: 0})
        res.status(200).json(customers)
    } catch (error) {
        res.status(404).send({message: `${error.message} Internal Server Error`})
    }
}

export const createCustomer = async (req, res) => {
    try {
        const {_id, action, firstName, lastName, phoneNumber } = req.body
        
    
        switch (action) {
            case 'Edit':
                console.log(req.body)
                await Customer.findByIdAndUpdate(_id, {$set: {firstName, lastName, phoneNumber}})
                return res.status(201).send({message: `${firstName} ${lastName} update successful`})
               
            case 'Delete':
                await Customer.findByIdAndUpdate(_id, {$set: {status: 'Inactive'}})
                return res.status(201).send({message: `${firstName} ${lastName} Deleted successful`})
               
            default:
                const exist = await Customer.findOne({firstName})
                if(exist) return res.status(404).send({message: 'Customer Already Exist'})
                
                const newUser = new Customer({firstName, lastName, phoneNumber })
                const error = newUser.validateSync()
                if (error && error.message) return res.status(404).send({message: error.message.split(':')[2].split(',')[0]});
                const {createdAt} = await newUser.save()
                if(!createdAt) return res.status(404).send({message: 'Internal Server Error'})
                return res.status(201).send({message: `${firstName} ${lastName} created successful`})
        }
    } catch (error) {
        res.status(404).send({message: `${error.message} Internal Server Error`})
    }
}