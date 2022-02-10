import type { Request, Response, NextFunction } from 'express';
import prisma from "./prisma.js";
import { APIClient } from './simplybook.js';
import { checkCapacity } from './notification.js';
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'


export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.sendStatus(401)
  }
  next()
}

export const handleCallback = async (req: Request, res: Response) => {
  const sb = new APIClient()
  await sb.initialize()
  const data = req.body
  const bookingEntity = await sb.getBooking(data.booking_id) as any
  await prisma.service.upsert({
    where: { id: bookingEntity.service_id },
    update: {},
    create: (await sb.getService(bookingEntity.service_id))
  })
  await prisma.user.upsert({
    where: { id: bookingEntity.client_id },
    update: {},
    create: (await sb.getClient(bookingEntity.client_id))
  })

  switch (data.notification_type) {
    case 'cancel': {
      await prisma.booking.delete({
        where: {
          id: bookingEntity.id
        }
      })
    }
    case 'modify': {
      const booking = await prisma.booking.update({
        where: {
          id: bookingEntity.id
        },
        data: {
          ...bookingEntity,
        },
        include: {
          service: true,
        }
      })
      await checkCapacity(booking)
    } break;
    case 'create': {
      const booking = await prisma.booking.create({
        data: {
          ...bookingEntity,
        },
        include: {
          service: true,
        }
      })
      await checkCapacity(booking)
    }
  }
  res.sendStatus(200)

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
  resp.json({token: jwt.sign(user, process.env.secret!, { expiresIn: "1 year" })})
}