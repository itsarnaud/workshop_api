const jwt = require('jsonwebtoken');
const { prisma } = require('../db/prisma');

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('JWT verification failed in middleware:', err.message);
      return next();
    }

    const email = payload && payload.email;
    if (!email) return next();

    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true, username: true } });
    if (!user) return next();

    res.locals.user = user;
    return next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return next();
  }
};
