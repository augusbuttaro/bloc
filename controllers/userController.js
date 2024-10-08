import { StatusCodes } from "http-status-codes"
import User from '../models/UserModel.js'
import Note from '../models/NoteModel.js'

export const getCurrentUser = async(req, res) =>{
    const user = await User.findById(req.user.userId)
    const userWithoutPassword = user.toJSON()
    res.status(StatusCodes.OK).json({user: userWithoutPassword})
}