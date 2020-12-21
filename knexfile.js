// Update with your config settings.
require('dotenv').config();

module.exports = {

  development: {
    client: 'postgresql',
    connection: process.env.DB_URL,
    migrations: {
      directory: './src/data/migrations',
    },
    seeds: { directory: './src/data/seeds' },
    pool: {
      min: 0,
      max: 15
    },
  
  },

  staging: {
    client: 'postgresql',
    connection: process.env.DB_URL,
    migrations: {
      directory: './src/data/migrations',
    },
    seeds: { directory: './src/data/seeds' },
    pool: {
      min: 0,
      max: 15
    },
  
  },

  production: {
    client: 'postgresql',
    connection: process.env.DB_URL,
    migrations: {
      directory: './src/data/migrations',
    },
    seeds: { directory: './src/data/seeds' },
    pool: {
      min: 0,
      max: 15
    },
  
  }

};
