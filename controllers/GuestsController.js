const { prisma } = require('../db/prisma');

module.exports.index = async (req, res) => {
  const guests = await prisma.guest.findMany();
  res.json(guests);
}

module.exports.create = async (req, res) => {
  await prisma.guest.create({ data: req.body });
  res.json({ msg: 'ok' });
}

module.exports.show = async (req, res) => {
  const guest = await prisma.guest.findUnique({ where: { id: req.body.id } });
  res.json(guest);
}

module.exports.update = async (req, res) => {
  const guest = await prisma.guest.update({ where: { id: req.body.id }, data: req.body })
  res.json(guest);
}

