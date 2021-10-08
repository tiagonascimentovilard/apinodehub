
 exports.get = (req, res, next) => {
    let uid = req.query.usuario_id;
    (async () => {
      const db = require("../db/db");
      try{
          await db.listaResponsaveis(uid,res);
      } catch (err) {
          res.status(500).json({message: 'erro ao chamar Model DB! '+err});
      }
    })();
 };

 exports.post = (req, res, next) => {
    let responsavel = req.body;
    (async () => {
        const db = require("../db/db");
        try{
            await db.criarResponsavel(responsavel, res);
        } catch (err) {
            console.error(err);
        }
    })();
 };