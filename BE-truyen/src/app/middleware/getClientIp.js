// middleware/getClientIp.js
const getClientIp = (req, res, next) => {
    req.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    next();
  };
  
  module.exports = getClientIp;
  