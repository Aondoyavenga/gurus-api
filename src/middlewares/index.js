
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js';


export const requireToken = async (req, res, next) => {
    try {

        const { authorization } = req.headers;
        if(!authorization){
            return res.status(401).send({
                error: 'You must be logged in'
            })
        }
        const token = authorization.replace("Bearer ", "");

        const payLoad = jwt.verify(token, `SH455POS`)
       

        const user = await User.findById(payLoad)
            .select({password: 0, __v: 0, updatedAt: 0})
            .populate('store', {__v: 0, updatedAt: 0})

            if(!user) return res.status(401).send({message: 'Unauthorized'})
            req.token = token
            req.user = user;
            
            next()
       
        
    } catch (error) {
        res.status(404).send({message: `Internal Server Error`})
    }
}




