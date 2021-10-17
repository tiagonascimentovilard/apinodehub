
exports.up = function(knex) {
    return knex.schema.createTable('empresas', function (table) {
        table.increments('id');
        table.string('nome').notNullable();
        table.string('cnpj').notNullable();
        table.string('descricao');
        table.integer('responsavel_principal_id');
        table.integer('usuario_id').notNullable();
    })
};

exports.down = function(knex) {
  
};
