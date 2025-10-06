const { prisma } = require('../db/prisma');

module.exports.index = async (req, res) => {
  const games = await prisma.game.findMany();
  res.json(games);
}

module.exports.create = async (req, res) => {
  await prisma.game.create({ data: req.body });
  res.json({ msg: 'ok' });
}

module.exports.show = async (req, res) => {
  const game = await prisma.game.findUnique({ where: { id: req.body.id } });
  res.json(game);
}

module.exports.update = async (req, res) => {
  const game = await prisma.game.update({ where: { id: req.body.id }, data: req.body })
  res.json(game);
}

