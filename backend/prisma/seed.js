const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Seed users
  const hashedAdmin = bcrypt.hashSync('admin123');
  const hashedAgent = bcrypt.hashSync('agent123');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin Coordinator',
      email: 'admin@example.com',
      password: hashedAdmin,
      role: 'ADMIN'
    }
  });

  const agent = await prisma.user.upsert({
    where: { email: 'agent@example.com' },
    update: {},
    create: {
      name: 'Field Agent One',
      email: 'agent@example.com',
      password: hashedAgent,
      role: 'AGENT'
    }
  });

  // Seed sample fields
    await prisma.field.createMany({
      data: [
        {
          name: 'Field A - Maize',
          cropType: 'Maize',
          plantingDate: new Date('2024-01-15'),
          currentStage: 'Growing',
          notes: '',
          agentId: agent.id
        },
        {
          name: 'Field B - Tomatoes',
          cropType: 'Tomatoes',
          plantingDate: new Date('2024-02-01'),
          currentStage: 'Ready',
          notes: 'Some pests spotted',
          agentId: agent.id
        },
        {
          name: 'Field C - Wheat',
          cropType: 'Wheat',
          plantingDate: new Date('2023-12-01'),
          currentStage: 'Harvested',
          notes: '',
          agentId: agent.id
        }
      ]
    });

  console.log('Database seeded with demo data');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
