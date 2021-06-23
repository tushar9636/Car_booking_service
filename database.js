var knex = require('knex');

module.exports = knex({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'test'
    }
});