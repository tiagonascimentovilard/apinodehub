
 exports.get = (req, res, next) => {
    console.log(JSON.stringify(req.query));
    let login = req.query.login;
    let senha = req.query.senha;
    (async () => {
      const db = require("../db/db");
      try{
          await db.validaSenhaHash(login,senha,res);
      } catch (err) {
          res.status(500).json({message: 'erro ao chamar Model DB! '+err});
      }
    })();
 };

 exports.post = (req, res, next) => {

    let login = req.body.login;
    let senha = req.body.senha;

    (async () => {
        const db = require("../db/db");
        try{
            await db.criarUsuario(login,senha, res);
           
        } catch (err) {
            console.error(err);
        }
    })();
 };
