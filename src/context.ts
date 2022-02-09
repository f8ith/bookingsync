import prisma from "./prisma.js"
import type { PrismaClient } from "@prisma/client";

export interface Context {
  prisma: PrismaClient
}

export const context: Context = {
  prisma: prisma,
}
