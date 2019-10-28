const config = require('../config')
const pg = require('pg')
pg.defaults.ssl = true

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/dev.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './migrations',
      tableName: 'migrations'
    },
    seeds: { 
      directory: './seeds' 
    } 
  },

  production: {
    client: "pg",
    connection: {
      database: config.database_url,
      user: config.heroku_username,
      password: config.heroku_password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./data/migrations"
    },
    useNullAsDefault: true
  }
};
