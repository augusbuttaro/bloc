import 'express-async-errors'
import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import morgan from 'morgan' 
const app= express()
import mongoose from 'mongoose'
import authRouter from './routes/authRouter.js'
import noteRouter from './routes/noteRouter.js'
import userRouter from './routes/userRouter.js'
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js'
import { authenticateUser } from './middleware/authMiddleware.js'
import cookieParser from 'cookie-parser'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.resolve(__dirname, './client/dist')))
app.use(cookieParser())
console.log(__dirname)
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.json())

<<<<<<< HEAD
app.get('/api/v1/test', (req, res) => {
    res.json({ msg: 'test route' });
  });

=======
>>>>>>> eef831d0d8798e44659102bc078356a130f0595b
app.use('/api/v1/notes',authenticateUser, noteRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users',authenticateUser, userRouter)

app.get('*', (req,res)=>{
    res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'))
})

app.use('*', (req, res)=>{
    res.status(404).json({ msg:'not found' })
})

app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

try {
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(port, ()=>{
        console.log('Server running')
    })
} catch (error) {
    console.log(error)
    process.exit(1)
}
