import { PrismaClient, Role, Status, Action } from "@prisma/client";
import { fakerPT_BR as faker } from "@faker-js/faker";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.history.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.reimbursement.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  const roles = Object.values(Role);
  const users = [];

  for (const role of roles) {
    const user = await prisma.user.create({
      data: {
        name: `User ${role.toLowerCase()}`,
        email: `${role.toLowerCase()}@empresa.com`,
        password: hashedPassword,
        role: role,
      },
    });
    users.push(user);
  }

  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        role: Role.EMPLOYEE,
      },
    });
    users.push(user);
  }

  const categoryNames = [
    "Alimentação",
    "Transporte",
    "Hospedagem",
    "Internet/Home Office",
    "Saúde",
    "Outros",
  ];
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.create({
        data: { name, active: true },
      }),
    ),
  );

  for (let i = 0; i < 50; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomStatus = faker.helpers.arrayElement(Object.values(Status));

    const reimbursement = await prisma.reimbursement.create({
      data: {
        userId: randomUser.id,
        categoryId: randomCategory.id,
        description: faker.commerce.productDescription().substring(0, 100),
        value: Number.parseFloat(faker.commerce.price({ min: 10, max: 2500 })),
        expenseDate: faker.date.recent({ days: 60 }),
        status: randomStatus,
        rejectionReason:
          randomStatus === Status.REJECTED
            ? "Nota fiscal ilegível ou fora do prazo."
            : null,

        attachments: {
          create: [
            {
              fileName: `comprovante_${faker.string.alphanumeric(5)}.pdf`,
              url: faker.internet.url(),
              fileType: "application/pdf",
            },
          ],
        },

        histories: {
          create: [
            {
              userId: randomUser.id,
              action: Action.CREATED,
              observation: "Solicitação inicial realizada pelo sistema.",
              createdAt: faker.date.past(),
            },
          ],
        },
      },
    });

    if (randomStatus !== Status.DRAFT && randomStatus !== Status.SUBMITTED) {
      const managerUser = users.find(
        (u) => u.role === Role.MANAGER || u.role === Role.ADMIN,
      );
      await prisma.history.create({
        data: {
          reimbursementId: reimbursement.id,
          userId: managerUser?.id || randomUser.id,
          action: randomStatus as unknown as Action,
          observation: `Status alterado para ${randomStatus} durante a auditoria.`,
        },
      });
    }
  }

  console.log("Seed finalizado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
