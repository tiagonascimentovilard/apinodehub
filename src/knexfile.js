
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './Database/db.sqlite'
    },
    migrations: {
      directory: './Database/Migrations'
    },
    useNullAsDefault: true
  },

  staging: {
    client: 'postgres',
    connection: {
      host : 'ec2-18-207-196-209.compute-1.amazonaws.com',
      port : 5432,
      user : 'hublocaldbii',
      password : '87654321',
      database : 'hublocaldb'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgres',
    connection: {
      host : 'ec2-18-207-196-209.compute-1.amazonaws.com',
      port : 5432,
      user : 'hublocaldbii',
      password : '87654321',
      database : 'hublocaldb'
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
