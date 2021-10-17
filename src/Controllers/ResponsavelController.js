exports.put = (req, res, next) => {
    let rid = req.body.params.responsavel_id;
    let eid = req.body.params.empresa_id;
    (async () => {
      const serv = require("../Services/Responsaveis");
      try{
          await serv.salvaResponsavelEmpresa(eid,rid).then((resp) => {
            res.status(200).json({message: 'incluído!'});
          });
      } catch (err) {
          res.status(500).json({message: 'erro ao chamar Model DB! '+err});
      }
    })();
};

exports.get = (req, res, next) => {
    let uid = req.query.usuario_id;
    (async () => {
      const serv = require("../Services/Responsaveis");
      try{
          await serv.listaResponsaveis(uid,res);
      } catch (err) {
          res.status(500).json({message: 'erro ao chamar Model DB! '+err});
      }
    })();
};

 exports.post = (req, res, next) => {
    let responsavel = req.body;
    (async () => {
        const serv = require("../Services/Responsaveis");
        try{
            await serv.criarResponsavel(responsavel, res);
        } catch (err) {
            console.error(err);
        }
    })();
 };
