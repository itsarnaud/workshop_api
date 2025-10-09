const { prisma } = require('../db/prisma');

module.exports = {
  // Récupérer toutes les questions
  async getAll(req, res) {
    try {
      const questions = await prisma.question.findMany();
      res.json(questions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Récupérer une question par son id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const question = await prisma.question.findUnique({ where: { id: parseInt(id, 10) } });
      if (!question) return res.status(404).json({ error: 'Question non trouvée' });
      res.json(question);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Mettre à jour une GameQuestion (par exemple pour stocker une réponse ou l'état)
  async updateGameQuestion(req, res) {
    try {
      const { id } = req.params; // id de GameQuestion
      const data = req.body;
      const updated = await prisma.gameQuestion.update({
        where: { id: parseInt(id, 10) },
        data,
      });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
