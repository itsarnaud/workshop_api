const { prisma } = require('../db/prisma');
const jwt = require('jsonwebtoken');

module.exports.index = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) return res.status(401).json({ error: 'Non authentifié.' });

    const games = await prisma.game.findMany({ where: { user_id: user.id }, include: { guests: true, invitations: true } });
    return res.json(games);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur interne.' });
  }
}

module.exports.create = async (req, res) => {
  try {
    const user = res.locals.user;
    if (!user) return res.status(401).json({ error: 'Non authentifié.' });

    const created = await prisma.game.create({ data: { user_id: user.id } });
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Impossible de créer la partie.' });
  }
}

module.exports.show = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await prisma.game.findUnique({ where: { id }, include: { guests: true, invitations: true, user: true } });
    if (!game) return res.status(404).json({ error: 'Partie non trouvée.' });
    return res.json(game);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur interne.' });
  }
}

module.exports.update = async (req, res) => {
  try {
    const gameId = req.params.id;
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) return res.status(404).json({ error: 'Partie non trouvée.' });

    const allowed = ['time_left'];
    const data = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        data[key] = req.body[key];
      }
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Aucun champ modifiable fourni.' });
    }

    const updated = await prisma.game.update({ where: { id: gameId }, data });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Impossible de mettre à jour la partie.' });
  }
}

module.exports.setTime = async (req, res) => {
  try {
    const { id }        = req.params;
    const { time_left } = req.body;

    const game   = await prisma.game.findUnique({ where: { id } });
    if (!game) return res.status(404).json({ error: 'Partie non trouvée.' });

    const normalizedTime = time_left < 0 ? 0 : time_left;
    const gameOver = normalizedTime <= 0;

    const updated = await prisma.game.update({ where: { id }, data: { time_left: normalizedTime, game_over: gameOver } });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur interne.' });
  }
}

