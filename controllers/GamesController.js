const { prisma } = require('../db/prisma');

module.exports.index = async (req, res) => {
  try {
    const games = await prisma.game.findMany({ include: { guests: true, invitations: true } });
    return res.json(games);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur interne.' });
  }
}

module.exports.create = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: 'user_id requis.' });

    const created = await prisma.game.create({ data: req.body });
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Impossible de créer la partie.' });
  }
}

module.exports.show = async (req, res) => {
  try {
    const game = await prisma.game.findUnique({ where: { id: req.params.id }, include: { guests: true, invitations: true, user: true } });
    if (!game) return res.status(404).json({ error: 'Partie non trouvée.' });
    return res.json(game);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur interne.' });
  }
}

module.exports.update = async (req, res) => {
  try {
    const data = { ...req.body };
    const game = await prisma.game.update({ where: { id: req.params.id }, data });
    return res.json(game);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Impossible de mettre à jour la partie.' });
  }
}

