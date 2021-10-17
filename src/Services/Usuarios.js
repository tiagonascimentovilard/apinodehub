const connection = require('../Database/connections');
const { gerarSenhaHash } = require('../Utils/HashPwd');

async function criarUsuario(login,senha,res){
  try{

    const senhaHash = gerarSenhaHash(senha);
    const loginLC = login.toLowerCase();
    await connection('usuarios').insert({login:loginLC ,hash1:senhaHash.hash ,hash2:senhaHash.salt });
    res.status(200).json({message: 'Usuário criado!'});

  } catch (err) {
    res.status(500).json({message: 'erro ao criar usuário!'+error});
  };
};

module.exports = {criarUsuario};