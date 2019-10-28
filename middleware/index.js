const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const useragent = require('express-useragent')

const routes = require('../routes')

const configureMiddleware = app => {
    app.use(helmet())
    app.use(logger('combined'))
    app.use(cors())
    app.use(express.json())
    app.use(useragent.express())
    app.use('/api', routes) 
}

module.exports = configureMiddleware
