const connection = require('../Database/connections');
const {salvaEndereco} = require('./Enderecos');

async function criarLocal(loc,res){
    try{

        const idEndereco = await salvaEndereco(loc);
        const local = {
            nome: loc.nome,
            endereco_id: idEndereco[0] ,
            empresa_id: loc.empresa_id ,
            responsavel_id: loc.responsavel_id ,
            usuario_id: loc.usuario_id  
        };
        const idLocal = await connection('locais').insert(local).returning('id');
        await salvaResponsavelLocal(idLocal[0],loc.responsavel_id)
        res.status(200).json({message: 'Local criado!'});

    } catch (err) {
        res.status(500).json({message: 'erro ao criar Responsável!'+error});
    };
};

async function salvaResponsavelLocal(idLocal,idRespon){

    await connection('responsaveis').where('id', '=', idRespon).update({ local_id: idLocal });

};


async function listaLocais(usuarioId,res){

    const locais = await connection('locais').where('usuario_id', usuarioId);
    res.status(200).json(locais);

};

module.exports = {criarLocal,salvaResponsavelLocal,listaLocais};