 exports.post = (req, res, next) => {

    let login = req.body.login;
    let senha = req.body.senha;

    (async () => {
        const serv = require("../Services/Usuarios");
        try{
            await serv.criarUsuario(login,senha, res);
           
        } catch (err) {
            console.error(err);
        }
    })();
 };