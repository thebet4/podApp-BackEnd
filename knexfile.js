// Update with your config settings.
require('dotenv').config();

module.exports = {

  development: {
    client: 'pg',
    connection: process.env.DB_URL,
    migrations: {
      directory: './src/data/migrations',
    },
    seeds: { directory: './src/data/seeds' },
  },

  staging: {
    client: 'pg',
    connection: process.env.DB_URL,
    migrations: {
      directory: './src/data/migrations',
    },
    seeds: { directory: './src/data/seeds' },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
