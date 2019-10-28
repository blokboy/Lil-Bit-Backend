const express = require('express')
const configureMiddleware = require('./middleware')

const app = express() 
configureMiddleware(app)

app.get('/', async (req, res) => {
    res.status(200).json({ message: `[Route] --> ${req.url} <-- Welcome to the Lil Bit API!` })
})

module.exports = app 