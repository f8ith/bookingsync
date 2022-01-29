import PrismaClientPkg from "@prisma/client";
const PrismaClient = PrismaClientPkg.PrismaClient;

export interface Context {
  prisma: InstanceType<typeof PrismaClient>
}

const prisma = new PrismaClient()

export const context: Context = {
  prisma: prisma,
}
