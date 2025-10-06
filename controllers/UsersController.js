const { prisma } = require('../db/prisma');

module.exports.index = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
}

module.exports.create = async (req, res) => {
  await prisma.user.create({ data: req.body });
  res.json({ msg: 'ok' });
}

module.exports.show = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.body.id } });
  res.json(user);
}

module.exports.update = async (req, res) => {
  const user = await prisma.user.update({ where: { id: req.body.id }, data: req.body })
  res.json(user);
}

