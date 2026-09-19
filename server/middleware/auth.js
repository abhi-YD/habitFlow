// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//   // get token from header
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'No token, access denied' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     // verify token using secret
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;  // attach userId to every request
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Token invalid or expired' });
//   }
// };

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId    = decoded.userId;

    // attach full user object for AI routes
    const User = require('../models/User');
    req.user   = await User.findById(decoded.userId)
      .select('-password');

    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Token invalid or expired'
    });
  }
};