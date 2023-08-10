const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const authenticateUser = (req,res,next) => {
    const token = req.header('x-auth-token');

    if(!token) {
        return res.status(401).json({msg:'no token'});
    }

    try{
        const decode = jwt.verify(token,jwtSecret)
        req.user = decode.user;
        next();
    }catch(err){
        res.status(500).json({msg:'token not valid'});
    }
}

  const isUser = (req, res, next) => {    
    if (req.user && req.user.role === 'user') {
      return next();
    }
    return res.status(403).json({ message: 'Access denied' });
  };
  
  const isDealership = (req, res, next) => {
    if (req.user && req.user.role === "dealership") {
      return next();
    }
    return res.status(403).json({ message: 'Access denied' });
  };

module.exports = {
    authenticateUser,
    isUser,
    isDealership
}