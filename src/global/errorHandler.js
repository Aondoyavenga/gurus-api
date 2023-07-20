import { AppError } from './AppError.js'

export const ErrorHandler = (error, req, res, next) => {

    if(error instanceof AppError) {
        return res.status(error.statusCode).json({
            errorCode: error.errorCode,
            message: error.message
        })
    }

   if(error.code === 11000){
        return res.status(400).json({
            errorCode: error.code,
            message: 'Duplicate value'
        })
    }

    return res.status( error.message?.includes('jwt') ? 401 : 500).json({message: error.message?.includes('jwt') ? 'Session expired' :  error.message})
}
