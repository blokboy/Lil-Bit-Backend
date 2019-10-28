const router = require('express').Router()
const model = require('../../model')

router.get('/', async (req, res) => {
    try {
        const agents = await model.get('Agents')

        if(agents) 
            return res.status(200).json({ message: `Agents successfully retrieved!`, agents })

        return res.status(500).json({ message: `No Agents could be retrieved from DB!` })
        
    } catch({ message }) {
        return res.status(404).json({ message })
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params 

    try {
        const agent = await model.findBy('Agents', { id })

        if(agent) 
            return res.status(200).json({ message: `Agent successfully retrieved!`, agent })

        return res.status(500).json({ message: `No Agent could be found at that ID.` })

    } catch({ message }) {
        return res.status(404).json({ message })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params 

    try {   
        const success = await model.remove('Agents', id)

        if(success)
            return res.status(200).json({ message: `Agent successfully deleted!` })

        return res.status(500).json({ message: `No Agent could be found at that ID.` })
    } catch({ message }) {
        return res.status(404).json({ message })
    }
})

module.exports = router