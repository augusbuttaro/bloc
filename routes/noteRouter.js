import { Router } from 'express'
import { validateNote, validateIdParam } from '../middleware/validationMiddleware.js'

const router = Router()

import {getAllNotes, getSingleNote, editNote, addNote, deleteNote} from '../controllers/noteController.js'

router.route('/').get(getAllNotes).post(validateNote, addNote)
router.route('/:id').get(validateIdParam, getSingleNote).patch(validateNote, validateIdParam, editNote).delete(validateIdParam, deleteNote)

export default router 