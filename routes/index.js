const router = require('express').Router()
const urlAPI = require('./resources')
const agentAPI = require('./agents')

router.use('/resources', urlAPI)
router.use('/agents', agentAPI)

router.get('/', async (req, res) => {
    try {
        return res.status(200).json({ message: `[Route] --> ${req.url} <-- Welcome to the Lil Bit API!`})
    } catch({ message }) {
        return res.status(404).json({ message })
    }
})

module.exports = router
