import type { Request, Response, NextFunction } from 'express';
import prisma from "./prisma.js";
import { APIClient } from './simplybook.js';
import { checkCapacity } from './notification.js';
import jwt from 'jsonwebtoken'
import config from './config.js'
import bcrypt from 'bcrypt'


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
  await prisma.client.upsert({
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

export const generateToken = async (req: Request, resp: Response) => {
  const data = req.body
  if (!data.email || !data.password) return resp.sendStatus(400)
  const user = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  })
  if (user) {
    bcrypt.compare(data.password, user.password, (err: any, result: any) => {
      if (err) throw err
      if (result) {
        resp.send(jwt.sign({ name: user.name }, config.secret, { expiresIn: "1 year" }))
      } else {
        resp.sendStatus(401)
      }
    })
  } else {
    resp.sendStatus(401)
  }
}
