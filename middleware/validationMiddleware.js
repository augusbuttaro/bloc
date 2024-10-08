import { body, param, validationResult } from 'express-validator'
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors/customErrors.js'
import mongoose from 'mongoose'
import User from '../models/UserModel.js'
import Note from '../models/NoteModel.js'

const withValidationErrors = (validateValues) =>{
    return [...validateValues,
        (req, res, next)=>{
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map((error) => error.msg).join(', ')
                console.log(errorMessages)
                if(errorMessages.startsWith('No class')){
                    throw new NotFoundError(errorMessages)
                }
                if(errorMessages.startsWith('Not authorized')){
                    throw new UnauthorizedError(errorMessages)
                }
                throw new BadRequestError(errorMessages)
            }
            next()
        }, ]
}

export const validateRegister = withValidationErrors([
    body('name').notEmpty().withMessage('Nombre es obligatorio'),
    body('email')
        .notEmpty()
        .withMessage('Email es obligatorio')
        .isEmail()
        .withMessage('Formato de email incorrecto')
        .custom(async (email)=>{
            const user =  await User.findOne({ email })
            if (user) {
                throw new BadRequestError('El email ingresado ya existe')
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('Contraseña es obligatorio')
        .isLength({ min:8 })
        .withMessage('La contraseña debe tener por lo menos 8 caracteres'),
])

export const validateLogin = withValidationErrors([
    body('email')
        .notEmpty()
        .withMessage('Email es obligatorio')
        .isEmail()
        .withMessage('Formato de email incorrecto'),
    body('password')
        .notEmpty()
        .withMessage('Contraseña es obligatorio')
 ])

 export const validateNote = withValidationErrors([
    body('title').notEmpty().withMessage('Titulo es obligatorio'),
    body('content').notEmpty().withMessage('Contenido es obligatorio'),
])

export const validateIdParam = withValidationErrors([
    param('id')
        .custom( async (value, { req })=>{
            const isValidId =  mongoose.Types.ObjectId.isValid(value)
            if(!isValidId) throw new Error('MongoDB ID incorrecto')
            const noteData = await Note.findById(value)
            if(!noteData) throw new Error(`No class with the id of ${value}`)
            const isOwner = req.user.userId === noteData.createdBy.toString()
            if (!isOwner) throw Error('Not authorized to access this route')
        })
])