
 
 exports.get = (req, res, next) => {
    let uid = req.query.usuario_id;
    (async () => {
      const db = require("../db/db");
      try{
          await db.listaLocais(uid,res);
      } catch (err) {
          res.status(500).json({message: 'erro ao chamar Model DB! '+err});
      }
    })();
 };

 exports.put = (req, res, next) => {
    let rid = req.body.params.responsavel_id;
    let lid = req.body.params.local_id;
    (async () => {
      const db = require("../db/db");
      try{
          await db.salvaResponsavelLocal(lid,rid).then((resp) => {
            res.status(200).json({message: 'incluído!'});
          });
      } catch (err) {
          res.status(500).json({message: 'erro ao chamar Model DB! '+err});
      }
    })();
 };

 exports.post = (req, res, next) => {
    let local = req.body;
    (async () => {
        const db = require("../db/db");
        try{
            await db.criarLocal(local, res);
        } catch (err) {
            console.error(err);
        }
    })();
 };
