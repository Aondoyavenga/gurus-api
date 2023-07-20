import { Subcategory } from "../models/Subcategory.js"
import { Category } from "../models/Category.js"


export const getAllSubcategory = async (req,res) => {
    try {
        const categories = await Subcategory.find({})
        .select({__v: 0, updateAt: 0})
        res.send(categories)
    } catch (error) {
        res.status(404).send({message: `${error.message} Internal Server Error`})
    }
}

export const createSubcategory = async (req, res) => {
    try {
        const { name, categoryRef } = req.body

        const newCategory = new Subcategory({name, categoryRef})
        const exist = await Subcategory.findOne({name})
        if(exist) return res.status(404).send({message: 'Category Already Exist'})

        const error = newCategory.validateSync()
        if (error && error.message) return res.status(404).send({message: error.message.split(':')[2].split(',')[0]});
        
        const CATEGORY = await Category.findByIdAndUpdate(categoryRef, {$addToSet: {subCategory: newCategory?._id}})
        
        const {createdAt} = await newCategory.save()
        if(!createdAt) return res.status(404).send({message: 'Internal Server Error'})
        res.status(201).send({message: `${name} created successful`})
    } catch (error) {
        console.log(error)
        res.status(404).send({message: `${error.message} Internal Server Error`})
    }

}