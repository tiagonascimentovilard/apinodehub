exports.up = function(knex) {
    return knex.schema.createTable('usuarios', function (table) {
        table.increments('id');
        table.string('login').notNullable();
        table.string('hash1').notNullable();
        table.string('hash2').notNullable();
    })
  };
  
  exports.down = function(knex) {
     //return knex.schema.dropTable('usuarios');
  };
