const CepController = require('../Controllers/CepController');
const UsuarioController = require('../Controllers/UsuarioController');
const ResponsavelController = require('../Controllers/ResponsavelController');
const EmpresaController = require('../Controllers/EmpresaController');
const LocalController = require('../Controllers/LocalController');

var cors = require('cors');

module.exports = (app) => {
   app.use(cors())
   app.get('/enderecocep/:cep',verifyJWT, CepController.get);
   app.post('/cadusuario', UsuarioController.post);
   app.get('/loginusuario', UsuarioController.get);
   app.put('/alteraempresaresp',verifyJWT, ResponsavelController.put);
   app.post('/cadresponsavel',verifyJWT, ResponsavelController.post);
   app.get('/listaresponsaveis',verifyJWT, ResponsavelController.get);
   app.post('/cadempresa',verifyJWT, EmpresaController.post);
   app.get('/listaempresas',verifyJWT, EmpresaController.get);
   app.post('/cadlocal',verifyJWT, LocalController.post);
   app.get('/listalocais',verifyJWT, LocalController.get);
   app.put('/alteralocalresp',verifyJWT, LocalController.put);
}

function verifyJWT(req, res, next){
   const jwt = require('jsonwebtoken');
   const token = req.headers['x-access-token'];
   if (!token) return res.status(511).json({ auth: false, message: 'No token provided.' });
   
   jwt.verify(token, process.env.SECRET, function(err, decoded) {
     if (err)  return res.status(511).json({ auth: false, message: 'Failed to authenticate token.' });
     next();
   });
}
