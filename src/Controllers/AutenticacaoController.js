
 exports.get = (req, res, next) => {
    let login = req.query.login;
    let senha = req.query.senha;
    (async () => {
      const autenticacao = require("../Services/Autenticacao");
      try{
          await autenticacao.validaLoginSenha(login,senha,res);
      } catch (err) {
          res.status(500).json({message: 'Erro ao chamar service Autenticacao! '+err});
      }
    })();
 };
