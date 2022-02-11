import { PrismaClient, Role } from "@prisma/client";
import * as data from './data.json'

const prisma = new PrismaClient()

const role: Role = "admin"

async function main() {
  console.log(`Start seeding admins...`)
  for (const u of data.admins) {
    const user = await prisma.user.upsert({
      where: {
        gId: u.gId
      },
      update: {
        ...u,
        role: role
      },
      create: {
        ...u,
        role: role
      }  
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
