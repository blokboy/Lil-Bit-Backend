const router = require('express').Router()
const bcrypt = require('bcryptjs')
const model = require('../../model')
const validator = require('url-validator')

const { findUserAgent } = require('../../utils')

router.delete('/:id', async (req, res) => {
    const { id } = req.params 

    try {
        const success = await model.remove('Resources', id)

        if(success)
            return res.status(200).json({ message: `URL successfully deleted!` })

        return res.status(500).json({ message: `No URL could be found at that ID.` })

    } catch({ message }) {
        return res.status(404).json({ message })
    }
})

router.get('/', async (req, res) => {
    try {
        const urls = await model.get('Resources')

        if(urls)
            return res.status(200).json({ message: `URLs successfully retrieved!`, urls })

        return res.status(500).json({ message: `No URLS could be recovered from the DB.` })
    
    } catch({ message }) {
        return res.status(404).json({ message })
    }
})

router.get('/analytics', async (req, res) => {
    try {
        let hits = 0
        let visitors = 0
        const urls = await model.get('Resources')
        const users = await model.get('Agents')
        const seen = {}
        const browsers = {}

        //Find all the unique top level domains and get a count of their respective subdomains
        for(const url of urls) {
            const split = url.original_url.indexOf('.')
            const topLevelDomain = url.original_url.slice(0, split)

            hits += url.hits 
            visitors += url.visitors 

            if(seen[topLevelDomain]) {
                seen[topLevelDomain] += 1
            } else {
                seen[topLevelDomain] = 1
            }
        }

        //Return data on browsers involved and number of unique users in application
        // How many unique browsers/users interact with our application
        for(const user of users) {
            if(browsers[user.browser]) {
                browsers[user.browser] += 1
            } else {
                browsers[user.browser] = 1
            }
        }

        return res.status(200).json({ hits, visitors, seen, browsers })

    } catch({ message }) {
        return res.status(404).json({ message })
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params 

    try {
        const url = await model.findBy('Resources', { id })

        if(url)
            return res.status(200).json({ message: `URL successfully retrieved!`, url })

        return res.status(500).json({ message: `No URL could be found at that ID.` })

    } catch({ message }) {
        return res.status(404).json({ message })
    }
})

router.get('/analytics/:tag', async (req, res) => {
    const { tag } = req.params 

    try {
        const redirect_url = `http://lilbit.now.sh/${tag}`

        const found = await model.findBy('Resources', { redirect_url })

        if(found) 
            return res.status(200).json({ message: `Analytics successfully retrieved!`, found })

        return res.status(500).json({ message: `There was no Lil Bit found at that address.` })

    } catch({ message }) {
        return res.status(404).json({ message })
    }
})

router.post('/create', async (req, res) => {
    try {
        let { original_url, redirect_url } = req.body 
        const user = { useragent: JSON.stringify(req.useragent), browser: req.useragent.browser, os: req.useragent.os, platform: req.useragent.platform }
        const agents = await model.findAllBy('Agents', { browser: req.useragent.browser, os: req.useragent.os, platform: req.useragent.platform })
        const agent = await findUserAgent(user, agents) 
        
        // This is how we find the user without storing any of their personal information
        if(!agent)
            await model.add('Agents', { ...user, useragent: bcrypt.hashSync(user.useragent) })

        if(original_url == redirect_url && !validator(redirect_url)) //the custom URL (redirect_url) can't already be a url
            return res.status(400).json({ message: `The URL and custom URL cannot be the same.` })

        // The original URL needs to go through a logical tree to get parsed and manicured
        original_url = validator(original_url)
        if(original_url) {
            if(original_url.slice(0, 5) == 'https') {
                if(original_url.slice(8, 12) == 'www.') {
                    original_url = original_url.slice(12)
                } else {
                    original_url = original_url.slice(8)
                }
            } else {
                if(original_url.slice(7, 11) == 'www.') {
                    original_url = original_url.slice(11)
                } else {
                    original_url = original_url.slice(7)
                }
            }
        } else {
            return res.status(404).json({ message: `You've entered an invalid URL. Make sure it starts with 'http(s)://'` })
        }

        const found = await model.findBy('Resources', { original_url })

        if(found && !redirect_url)
            return res.status(200).json(found.redirect_url)
        
        const hash = bcrypt.hashSync(original_url)
        let shortlink = `http://lilbit.now.sh/` + hash.slice(10, 16)
        
        if(!redirect_url) {
            // When we have a successful short link with no custom URL
            const [ resource_id ] = await model.add('Resources', { original_url, redirect_url: shortlink })
            if(resource_id)
                return res.status(201).json({ message: `New Lil Bit successfully created!`, shortlink })

            return res.status(500).json({ message: `There was an error trying to add a new Lil Bit.` })
        }
            

        redirect_url = `http://lilbit.now.sh/` + redirect_url
        const isCustomURLTaken = await model.findBy('Resources', { redirect_url })
        if(isCustomURLTaken)
            return res.status(404).json({ message: `That custom URL is already taken!` })

        const [ resource_id ] = await model.add('Resources', { original_url, redirect_url })
        if(resource_id)
            return res.status(201).json({ message: `New Lil Bit successfully created!`, redirect_url })
        
        return res.status(500).json({ message: `There was an error trying to add a new Lil Bit.` })

    } catch({ message }) {
        return res.status(404).json({ message })
    }
})

router.post('/redirect', async (req, res) => {
    const { redirect_url } = req.body 
    const user = { useragent: JSON.stringify(req.useragent), browser: req.useragent.browser, os: req.useragent.os, platform: req.useragent.platform }
    const agents = await model.findAllBy('Agents', { browser: req.useragent.browser, os: req.useragent.os, platform: req.useragent.platform })
    const agent = await findUserAgent(user, agents)

    try {
        const found = await model.findBy('Resources', { redirect_url })

        if(found) {
            const hits = found.hits += 1
            if(!agent) {
                const visitors = found.visitors += 1
                await model.update('Resources', found.id, { hits, visitors })
            } else {
                await model.update('Resources', found.id, { hits })
            }
        } else {
            return res.status(500).json({ message: `There was no Lil Bit URL found!` })
        }

        const URL = `http://${found.original_url}`
        return res.status(200).json(URL)
        
    } catch({ message }) {
        return res.status(404).json({ message })
    }
})

module.exports = router