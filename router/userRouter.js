const express = require('express')
const { signUp, login } = require('../controller/userController')
const { createEvent } = require('../controller/eventController')
const { uploadFile } = require('../controller/eventController')

const { upload } = require('../utils/multer')
const { validateFileUpload } = require('../utils/validateF ile')

const router = express.Router()

router.post('/signup', upload.single('picture'), signUp)
router.post('/login', login)

router.post('/create-event', createEvent)

router.post('/upload', validateFileUpload, uploadFile)