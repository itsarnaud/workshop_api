const { prisma } = require('../db/prisma');
const jwt        = require('jsonwebtoken');

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

module.exports.join = async (req, res) => {
  try {
    const { token } = req.params;
    const { username } = req.body;
    if (!token) return res.status(400).json({ error: 'token requis' });

    if (!username) return res.status(400).json({ error: 'Le nom d\'utilisateur est requis.' });

    const invitation = await prisma.invitation.findUnique({ where: { token }, include: { game: true } });
    if (!invitation) return res.status(404).json({ error: 'Invitation non trouvée.' });

    const expires = new Date() > invitation.expires_at;
    if (expires) return res.status(400).json({ error: 'Invitation expirée.' });

    const guest = await prisma.guest.create({ data: { username, game_id: invitation.game_id } });
    const guest_token = jwt.sign({ guest_id: guest.id, username }, process.env.JWT_SECRET, { expiresIn: '2h' });

    try {
      const socketHelper = require('../socket');
      const io = socketHelper.getIO();
      const room = `game_${invitation.game_id}`;
      io.to(room).emit('guest:joined', { gameId: invitation.game_id, guest: { id: guest.id, username: guest.username } });
    } catch (err) {
      console.warn('Socket emit failed:', err.message);
    }

  return res.json({ token: guest_token, game_id: invitation.game_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur interne.' })
  }
}
