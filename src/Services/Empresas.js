const connection = require('../Database/connections');
const {salvaResponsavelEmpresa} = require('./Responsaveis');

async function criarEmpresa(empr,res){
    try{

        const empresa = { 
            nome: empr.nome,
            cnpj: empr.cnpj,
            descricao: empr.descricao,
            responsavel_principal_id: empr.responsavel,
            usuario_id: parseInt(empr.usuario_id)
        };
        const idEmpresa = await connection('empresas').insert(empresa).returning('id');
        await salvaResponsavelEmpresa(idEmpresa[0],empr.responsavel);
        res.status(200).json({message: 'Empresa criada!'});

    } catch (err) {
        res.status(500).json({message: 'erro ao criar Empresa!'+error});
    };
};

async function listaEmpresas(usuarioId,res){

    const empresas = await connection('empresas').where('usuario_id', usuarioId);
    res.status(200).json(empresas);

};

module.exports = {criarEmpresa,listaEmpresas};