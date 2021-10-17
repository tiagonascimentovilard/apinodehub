const connection = require('../Database/connections');

async function salvaEndereco(ender){
    try {

        const endereco = {
            cep: ender.cep,
            logradouro: ender.logradouro,
            numero: ender.numero,
            bairro: ender.bairro,
            municipio: ender.municipio,
            uf: ender.uf,
            usuario_id: ender.usuario_id
        };
        return await connection('enderecos').insert(endereco).returning('id');

    } catch (err) {
        console.log(err.stack);
    };
  };

  module.exports = {salvaEndereco};