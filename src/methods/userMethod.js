import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from "../models/User.js"
import { Store } from '../models/Store.js'
const saltRounds = 10

export const authenticated = async(req, res) =>{
    try {
        const {role, _id, email, firstName, lastName, phoneNumber, createdAt, token} = req.user
        return res.send({
            role, _id, email, 
            firstName, lastName, phoneNumber, createdAt, token
        })
    } catch (error) {
        res.status(404).send({message: `${error.message} Internal Server Error`})
    }
}

export const getAllUsers = async(req, res) =>{
    try {
        const users = await User.find({}).select({__v: 0, password: 0, updatedAt: 0})
        res.status(200).json(users)
    } catch (error) {
        res.status(404).send({message: `${error.message} Internal Server Error`})
    }
}

export const userLogIn = async(req, res) => {
    try {
        const {userName, password} = req.body

        const user = await User.findOne({email: userName}).select({__v: 0, updatedAt: 0})
        if(user?.status == false) return res.status(404).send({message: `User has been disabled, contact administrator`})
        if(!user) return res.status(404).send({message: `Invalid User Name Or Password`})
        
        const match = await bcrypt.compare(password, user?.password)
      
        if(!match) return res.status(404).send({message: `Invalid User Name Or Password`})
        const token = jwt.sign(`${user._id}`, `SH455POS` )
        const data = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user?.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            token
        };
        res.send(data)
    } catch (error) {
        console.log(error)
        res.status(404).send({message: `Internal Server Error4`})
    }
}

export const createUser = async(req, res) => {
    try {
        // return console.log(req.body)
        const { email, firstName, lastName, phoneNumber, password, role, store, status } = req.body
        const exist = await User.findOne({email})
        // if(exist) return res.status(404).send({message: 'Category Already Exist'})
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPwd = bcrypt.hashSync(password, salt);
    
        const newUser = new User({email, firstName, lastName, phoneNumber, password: hashPwd, role, store})
        const error = newUser.validateSync()
        if (error && error.message) return res.status(404).send({message: error.message.split(':')[2].split(',')[0]});
    
        const {updatedAt} = await User.findOneAndUpdate({email}, {email, firstName, lastName, phoneNumber, password:hashPwd, role, store, status}, {upsert: true})
        if(!updatedAt) return res.status(404).send({message: 'Internal Server Error'})
        await Store.findByIdAndUpdate(store, {$addToSet:{users: newUser?._id}})
        res.status(201).send({message: `${firstName} ${lastName} created successful`})
    } catch (error) {
        res.status(404).send({message: `${error?.message} Internal Server Error`})
    }
}