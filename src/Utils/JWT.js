function verifyJWT(req, res, next){
    const jwt = require('jsonwebtoken');
    const token = req.headers['x-access-token'];
    if (!token) return res.status(511).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err)  return res.status(511).json({ auth: false, message: 'Failed to authenticate token.' });
      next();
    });
 }

 module.exports = {verifyJWT};