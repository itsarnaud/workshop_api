const bcrypt     = require('bcrypt');
const { prisma } = require('../db/prisma');
const jwt        = require('jsonwebtoken');

const safeUserSelect = {
  id: true,
  username: true,
  email: true,
  created_at: true
};

module.exports.index = async (req, res) => {
  try {
    const users = await prisma.user.findMany({ select: { ...safeUserSelect, games: true } });
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur interne.' });
  }
}

module.exports.create = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Le nom d\'utilisateur, l\'email et le mot de passe sont requis.' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const created = await prisma.user.create({ data: { username, email, password: hash } });
    const user = await prisma.user.findUnique({ where: { id: created.id }, select: safeUserSelect });
    return res.status(201).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Impossible de créer l\'utilisateur.' });
  }
}

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'L\'email et le mot de passe sont requis.' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Identifiant ou mot de passe incorrect.' });
    }

    const token = jwt.sign({ user_id: user.id, username: user.username, role: 'owner' }, process.env.JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur lors de l\'authentification.' });
  }
}

module.exports.show = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id }, select: { ...safeUserSelect, games: true } });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur interne.' });
  }
}

module.exports.update = async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.password) delete data.password;

    const user = await prisma.user.update({ where: { id: req.params.id }, data });
    const safe = await prisma.user.findUnique({ where: { id: user.id }, select: safeUserSelect });
    return res.json(safe);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Impossible de mettre à jour l\'utilisateur.' });
  }
}

