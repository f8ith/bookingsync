import PrismaClientPkg from "@prisma/client";
import data from './data.json'

const PrismaClient = PrismaClientPkg.PrismaClient;

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)
  for (const u of data.admins) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created admin with id: ${user.id}`)
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
