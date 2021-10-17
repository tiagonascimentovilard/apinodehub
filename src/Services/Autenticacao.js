const connection = require('../Database/connections');
const { validaSenhaHash } = require('../Utils/HashPwd');


async function validaLoginSenha(login,senha,res){

  const loginReq = login.toLowerCase();
  const loginValidacao = await connection('usuarios').where('login', loginReq);

  if(loginValidacao.length > 0){

    const senhaValidacao = validaSenhaHash(senha, loginValidacao[0].hash1, loginValidacao[0].hash2);
    
    if (senhaValidacao){
      
      const jwt = require('jsonwebtoken');
      const idUsuario = loginValidacao[0].id;
      const token = jwt.sign({ idUsuario }, process.env.SECRET, {
        //expiresIn: 3600 // expires in 1hs
        expiresIn: 720 // expires in 20min
      });
      res.json({ auth: true, token: token, userid: idUsuario, login: login});

    }else{
      res.status(403).json({message: 'Senha inválida!'});
    };

  }else{
    res.status(403).json({message: "Usuário não cadastrado!"});
  };

};
  
module.exports = {validaLoginSenha};