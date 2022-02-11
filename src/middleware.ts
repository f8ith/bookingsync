import type { Request, Response, NextFunction } from 'express';
import prisma from "./prisma";
import { checkCapacity } from './notification';
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'


export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.sendStatus(401)
  }
  next()
}

export const googleOAuth2 = async (req: Request, resp: Response) => {
  const { token } = req.body
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const profile = ticket.getPayload();
  if (!profile) return resp.status(400)
  const user = await prisma.user.upsert({
    where: {
      gId: profile.sub
    },
    update: {
      name: profile.name!,
      email: profile.email!
    },
    create: {
      name: profile.name!,
      email: profile.email!,
      gId: profile.sub!,
    }
  })
  if (!user.phone) resp.status(201); else resp.status(200)
  resp.json({token: jwt.sign(user, process.env.secret!, { expiresIn: "1 year" }), data: user})
}