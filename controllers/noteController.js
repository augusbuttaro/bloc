import Note from '../models/NoteModel.js'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import day from 'dayjs'

export const getAllNotes = async (req,res)=>{
    const { search, sort, archivadas, filter } = req.query
    const queryObject = {
        createdBy:req.user.userId,
        isArchived: archivadas
    }
    if(search){
        queryObject.$or = [{ title: { $regex:search, $options:'i' } }]
    }
    if (filter) {
        queryObject.noteCategories = { $in: [filter] }
    }
    const sortOptions = {
        'Mas reciente':'-createdAt',
        'Mas antiguo':'createdAt',
        'A-Z':'title',
        'Z-A':'-title',
    }
    const sortKey = sortOptions[sort] || sortOptions.newest

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 6
    const skip = (page-1) * limit

    const notes = await Note.find(queryObject).sort(sortKey).skip(skip).limit(limit)
    const allNotes = await Note.find({ createdBy: req.user.userId })

    const totalNotes = await Note.countDocuments(queryObject)
    const totalArchived = await Note.countDocuments({ ...queryObject, isArchived: true })
    const totalUnarchived = await Note.countDocuments({ ...queryObject, isArchived: false })

    const numOfPages = Math.ceil(totalNotes/limit)
    res.status(StatusCodes.OK).json({totalNotes, totalArchived, totalUnarchived, numOfPages, currentPage:page, notes, allNotes})
}

export const addNote = async (req,res)=>{
    req.body.createdBy = req.user.userId
    const noteData = await Note.create(req.body)
    res.status(StatusCodes.CREATED).json({noteData})
}

export const getSingleNote = async (req,res)=>{
    const noteData = await Note.findById(req.params.id)
    res.status(StatusCodes.OK).json({noteData})
}

export const editNote = async (req,res)=>{
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {new:true})
    res.status(StatusCodes.OK).json({updatedNote})
}

export const deleteNote = async (req, res)=>{
    const deletedNote = await Note.findByIdAndDelete(req.params.id)
    res.status(StatusCodes.OK).json({deletedNote})
}

