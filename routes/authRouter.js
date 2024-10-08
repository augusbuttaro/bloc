import { Router } from "express"
const router = Router()
import { login, register, logout } from '../controllers/authController.js'
import { validateRegister, validateLogin } from "../middleware/validationMiddleware.js"

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.post('/logout', logout)

export default router