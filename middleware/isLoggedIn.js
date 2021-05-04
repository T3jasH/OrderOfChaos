const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get the token fron header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res
      .status(401)
      .json({ msg: 'No token found, authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not Valid' });
  }
};
