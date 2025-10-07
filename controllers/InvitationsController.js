const { prisma } = require('../db/prisma');

module.exports.index = async (req, res) => {
  try {
    const invitations = await prisma.invitation.findMany({ select: { id: true, token: true, created_at: true, expires_at: true, game: true } });
    return res.json(invitations);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur interne.' });
  }
}

module.exports.create = async (req, res) => {
  try {
    const { game_id, expires_at } = req.body;
    if (!game_id || !expires_at) return res.status(400).json({ error: 'game_id et expires_at requis.' });

    const invitation = await prisma.invitation.create({ data: req.body });
    return res.status(201).json(invitation);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Impossible de créer l\'invitation.' });
  }
}

module.exports.show = async (req, res) => {
  try {
    const id = req.params.id || req.body.id;
    if (!id) return res.status(400).json({ error: 'id requis.' });

    const invitation = await prisma.invitation.findUnique({ where: { id }, select: { id: true, token: true, created_at: true, expires_at: true, game: true } });
    if (!invitation) return res.status(404).json({ error: 'Invitation non trouvée.' });
    return res.json(invitation);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur interne.' });
  }
}

