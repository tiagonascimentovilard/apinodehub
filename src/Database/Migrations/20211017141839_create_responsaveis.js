
exports.up = function(knex) {
    return knex.schema.createTable('responsaveis', function (table) {
        table.increments('id');
        table.string('nome').notNullable();
        table.string('telefone').notNullable();
        table.integer('endereco_id').notNullable();
        table.integer('empresa_id');
        table.integer('local_id');
    })
};

exports.down = function(knex) {
  
};
