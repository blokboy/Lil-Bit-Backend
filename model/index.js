const db = require('knex')(require('../data/knexfile').production)

const get = async (tbl) => {
    return await db(tbl)
}

const findBy = async (tbl, filter) => {
    return await db(tbl).where(filter).first()
}

const findAllBy = async (tbl, filter) => {
    return await db(tbl).where(filter)
}

const add = async (tbl, data) => {
    return await db(tbl).insert(data)
}

const remove = async (tbl, id) => {
    return await db(tbl).where({ id }).del()
}

const update = async (tbl, id, data) => {
    return await db(tbl).where({ id }).update(data)
}

module.exports = {
    get,
    findBy,
    findAllBy,
    add,
    remove,
    update
}
