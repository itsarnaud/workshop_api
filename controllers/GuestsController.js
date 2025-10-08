const { prisma } = require('../db/prisma');

module.exports.index = async (req, res) => {
  try {
    const guests = await prisma.guest.findMany();
    return res.json(guests);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur interne.' });
  }
}

module.exports.create = async (req, res) => {
  try {
    const { username, game_id } = req.body;
    if (!username || !game_id) return res.status(400).json({ error: 'username et game_id requis.' });

    const created = await prisma.guest.create({ data: req.body });
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Un invité avec ce nom existe déjà pour cette partie.' });
    }
    return res.status(500).json({ error: 'Impossible de créer l\'invité.' });
  }
}

module.exports.show = async (req, res) => {
  try {
    const id = req.params.id || req.body.id;
    if (!id) return res.status(400).json({ error: 'id requis.' });

    const guest = await prisma.guest.findUnique({ where: { id } });
    if (!guest) return res.status(404).json({ error: 'Invité non trouvé.' });
    return res.json(guest);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur interne.' });
  }
}

module.exports.update = async (req, res) => {
  try {
    const id = req.params.id || req.body.id;
    if (!id) return res.status(400).json({ error: 'id requis.' });

    const data = { ...req.body };
    // Ne pas autoriser la modification de game_id
    if (data.game_id) delete data.game_id;

    const guest = await prisma.guest.update({ where: { id }, data });
    return res.json(guest);
  } catch (err) {
    console.error(err);
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Conflit de données.' });
    }
    return res.status(500).json({ error: 'Impossible de mettre à jour l\'invité.' });
  }
}

