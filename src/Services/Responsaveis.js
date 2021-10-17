const connection = require('../Database/connections');
const {salvaEndereco} = require('./Enderecos');

async function criarResponsavel(resp,res){
    try{

        const idEndereco = await salvaEndereco(resp);
        const responsavel = {
            nome: resp.nome,
            telefone: resp.telefone,
            endereco_id: idEndereco[0] 
        };
        await connection('responsaveis').insert(responsavel);
        res.status(200).json({message: 'Responsável criado!'});

    } catch (err) {
        res.status(500).json({message: 'erro ao criar Responsável!'+error});
    };
};

async function salvaResponsavelEmpresa(idEmpr,idRespon){

    await connection('responsaveis').where('id', '=', idRespon).update({ empresa_id: idEmpr });

};

async function listaResponsaveis(usuarioId,res){
try{
    
    const responsaveis = await connection('responsaveis')
    .innerJoin('enderecos', 'enderecos.id', 'responsaveis.endereco_id')
    .where('enderecos.usuario_id', usuarioId).select('responsaveis.*');
    res.status(200).json(responsaveis);

} catch (err) {
    res.status(500).json({message: 'erro ao criar Responsável!'+error});
};

};

module.exports = {criarResponsavel,salvaResponsavelEmpresa,listaResponsaveis};