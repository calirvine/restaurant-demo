import { PrismaClient, Profile, User } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

export interface IReqWithSession extends Request {
  session: {
    userId: string
    role: string
  } | null
}

export async function getSession(
  sessionId?: string,
): Promise<{ userId: string; role: number } | null> {
  if (!sessionId) return null
  const session = await prisma.session.findOne({ where: { id: sessionId } })
  return session ? JSON.parse(session.data) : null
}

export async function createSession(user: User & { profile: Profile | null }) {
  const session = await prisma.session.create({
    data: {
      data: JSON.stringify({ userId: user.id, role: user.profile?.role ?? 0 }),
    },
  })
  return session.id
}

export async function endSession(sessionId: string) {
  const res = await prisma.session.delete({ where: { id: sessionId } })
  if (res) return true
  return false
}

export function purgeSessions() {
  prisma.session.deleteMany({})
}
