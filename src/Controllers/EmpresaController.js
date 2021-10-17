
 
 exports.get = (req, res, next) => {
    let uid = req.query.usuario_id;
    (async () => {
      const serv = require("../Services/Empresas");
      try{
          await serv.listaEmpresas(uid,res);
      } catch (err) {
          res.status(500).json({message: 'erro ao chamar Model DB! '+err});
      }
    })();
 };

 exports.post = (req, res, next) => {
    let empresa = req.body;
    (async () => {
        const serv = require("../Services/Empresas");
        try{
            await serv.criarEmpresa(empresa, res);
        } catch (err) {
            console.error(err);
        }
    })();
 };
