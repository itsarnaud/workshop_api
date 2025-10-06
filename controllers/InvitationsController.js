const { prisma } = require('../db/prisma');

module.exports.index = async (req, res) => {
  const invitations = await prisma.invitation.findMany();
  res.json(invitations);
}

module.exports.create = async (req, res) => {
  await prisma.invitation.create({ data: req.body });
  res.json({ msg: 'ok' });
}

module.exports.show = async (req, res) => {
  const invitation = await prisma.invitation.findUnique({ where: { id: req.body.id } });
  res.json(invitation);
}

module.exports.update = async (req, res) => {
  const invitation = await prisma.invitation.update({ where: { id: req.body.id }, data: req.body })
  res.json(invitation);
}

