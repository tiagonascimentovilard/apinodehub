
exports.up = function(knex) {
    return knex.schema.createTable('locais', function (table) {
        table.increments('id');
        table.string('nome').notNullable();
        table.integer('endereco_id').notNullable();
        table.integer('empresa_id').notNullable();
        table.integer('responsavel_id').notNullable();
        table.integer('usuario_id').notNullable();
    })
};

exports.down = function(knex) {
  
};
