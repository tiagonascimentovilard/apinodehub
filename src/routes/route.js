const {verifyJWT} = require('../Utils/JWT');
const CepController = require('../Controllers/CepController');
const UsuarioController = require('../Controllers/UsuarioController');
const ResponsavelController = require('../Controllers/ResponsavelController');
const EmpresaController = require('../Controllers/EmpresaController');
const LocalController = require('../Controllers/LocalController');
const AutenticacaoController = require('../Controllers/AutenticacaoController');

var cors = require('cors');

module.exports = (app) => {
   app.use(cors())
   app.get('/enderecocep/:cep',verifyJWT, CepController.get);
   app.post('/cadusuario', UsuarioController.post);
   app.put('/alteraempresaresp',verifyJWT, ResponsavelController.put);
   app.post('/cadresponsavel',verifyJWT, ResponsavelController.post);
   app.get('/listaresponsaveis',verifyJWT, ResponsavelController.get);
   app.post('/cadempresa',verifyJWT, EmpresaController.post);
   app.get('/listaempresas',verifyJWT, EmpresaController.get);
   app.post('/cadlocal',verifyJWT, LocalController.post);
   app.get('/listalocais',verifyJWT, LocalController.get);
   app.put('/alteralocalresp',verifyJWT, LocalController.put);
   app.get('/autenticacao', AutenticacaoController.get);
}

