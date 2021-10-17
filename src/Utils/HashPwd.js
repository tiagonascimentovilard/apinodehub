const crypto = require("crypto");

function gerarSalt(){
    return  crypto.randomBytes(16).toString('hex');
};
  
function sha512(senha, salt){
    var hash = crypto.createHmac('sha512', salt); 
    hash.update(senha);
    var hash = hash.digest('hex');
    return {salt,hash,};
};
  
function gerarSenhaHash(senha) {
    var salt = gerarSalt(); 
    return sha512(senha, salt); 
};

function validaSenhaHash(senha, hashDB, saltHashDB){
    var hashTentativaLogin = crypto.createHmac('sha512', saltHashDB); 
    hashTentativaLogin.update(senha);
    var hashTentativaLogin = hashTentativaLogin.digest('hex');
  
    if (hashDB == hashTentativaLogin){
      return true;
    }else{
      return false;
    };
  };

  module.exports = {gerarSenhaHash,validaSenhaHash};