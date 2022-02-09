import PrismaClientPkg from "@prisma/client";
import config from '../src/config.js'

const PrismaClient = PrismaClientPkg.PrismaClient;

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)
  for (const u of config.userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
