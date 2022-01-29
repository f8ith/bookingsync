import type { Request, Response } from 'express';
import PrismaClientPkg from "@prisma/client";
const PrismaClient = PrismaClientPkg.PrismaClient;
import { APIClient } from './simplybook.js';

export const handleCallback = async (res: Response, req: Request) => {
  const prisma = new PrismaClient()
  const sb = new APIClient()
  const data = req.body
  switch (data.notification_type) {
    case 'create':
      const booking = await sb.getBooking(data.booking_id) as any
      await prisma.booking.create({
        data: {
          ...booking,
          service: {
            connectOrCreate: {
              where: {
                id: booking.service_id
              },
              create: (await sb.getService(booking.service_id))
            },
            client: {
              connectOrCreate: {
                where: {
                  id: booking.client_id
                },
                create: (await sb.getService(booking.client_id))
              }
            },
          }
        }
      })
  }
  res.sendStatus(200)
}

