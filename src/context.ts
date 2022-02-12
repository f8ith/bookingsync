import prisma from './prisma'
import type { PrismaClient, User } from '@prisma/client'

export interface createContext {
  prisma: PrismaClient
  user: User
}

export const createContext = (req: any) => {
  return {
    prisma: prisma,
    user: req.user,
  }
}
