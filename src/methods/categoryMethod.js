import { Category } from "../models/Category.js"

export const getAllCategory = async (req, res) => {
    try {
        const category = await Category.find({status: {$ne: 'Deleted'}}).select({__v: 0, updatedAt: 0})
        .populate('subCategory', {__v: 0, updatedAt: 0, productRef: 0, categoryRef: 0})
        res.status(200).json(category)
    } catch (error) {
        res.status(404).send({message: `${error.message} Internal Server Error`})
    }
}

export const createCategory = async (req, res) => {
    try {
        const {_id, action, name } = req.body

        const newCategory = new Category({name})

        // const exist = await Category.findOne({name})
        // if(exist) return res.status(404).send({message: 'Category Already Exist'})
        const error = newCategory.validateSync()
        if (error && error.message) return res.status(404).send({message: error.message.split(':')[2].split(',')[0]});
        
        switch (action) {
            case 'Delete':
                
                await Category.findByIdAndUpdate(_id, {$set: {status: 'Deleted'}})
                return res.status(201).send({message: `${name} Deleted successful`})
               
            case 'Edit':
                await Category.findByIdAndUpdate({_id}, {name}, {upsert: true})
                return res.status(201).send({message: `${name} ${_id ? 'Edited' : 'created'}  successful`})
            
            default:
                const {createdAt} = await newCategory.save()
                if(!createdAt) return res.status(404).send({message: 'Internal Server Error'})
                return res.status(201).send({message: `${name} ${_id ? 'Edited' : 'created'}  successful`})            
                
        }
       
        
        
    } catch (error) {
        res.status(404).send({message: `Internal Server Error`})
    }
}