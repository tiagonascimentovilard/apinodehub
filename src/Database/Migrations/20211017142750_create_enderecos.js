
exports.up = function(knex) {
    return knex.schema.createTable('enderecos', function (table) {
        table.increments('id');
        table.string('cep').notNullable();
        table.string('logradouro').notNullable();
        table.string('numero');
        table.string('bairro').notNullable();
        table.string('municipio').notNullable();
        table.string('uf').notNullable();
        table.integer('usuario_id').notNullable();
    })
};

exports.down = function(knex) {
  
};
