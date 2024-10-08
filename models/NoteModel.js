import mongoose from "mongoose"

const NoteSchema = new mongoose.Schema({
    title: String,
    content: String,
    noteCategories:[String],
    isArchived: {
        type: Boolean,
        default: false
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User'
      }
}, {timestamps:true})

export default mongoose.model('Note', NoteSchema)