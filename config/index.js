require('dotenv').config 

const config = {
    database_url: process.env.DATABASE_URL,
    heroku_username: process.env.HEROKU_PG_USERNAME,
    heroku_password: process.env.HEROKU_PG_PASSWORD,
    port: 5000
}

module.exports = config
