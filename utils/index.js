const bcrypt = require('bcryptjs')

const findUserAgent = async (user, agents) => {
    for(const agent of agents) {
        const success = bcrypt.compareSync(user.useragent, agent.useragent)
        if(success) {
            return agent 
        } 
    }
    return null
}

module.exports = {
    findUserAgent
}
