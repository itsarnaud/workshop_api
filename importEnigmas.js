const { PrismaClient } = require('./generated/prisma');
const fs = require('fs');
const path = require('path');

async function main() {
  const prisma = new PrismaClient();
  const enigmaPath = path.join(__dirname, '../workshop/src/data/enigma.json');
  const raw = fs.readFileSync(enigmaPath, 'utf-8');
  const enigmas = JSON.parse(raw);

  for (const key of Object.keys(enigmas)) {
    const item = enigmas[key];
    // Correction de la clé "asnwer" potentielle
    const answer = item.answer || item.asnwer;
    try {
      await prisma.question.create({
        data: {
          title: item.title,
          enigma: item.enigma,
          answer: answer,
          hint: item.hint || null,
          digit: item.digit
        },
      });
      console.log(`Question ajoutée : ${item.title}`);
    } catch (e) {
      console.error(`Erreur pour la question ${item.title} :`, e.message);
    }
  }
  await prisma.$disconnect();
}

main();
