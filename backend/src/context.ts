import { PrismaClient, Session } from '@prisma/client'
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { getSession } from './controllers/session'

const prisma = new PrismaClient()

export interface ctx {
  prisma: PrismaClient
  expressContext: ExpressContext
  session: Promise<{ userId: string; role?: number } | null> | null
}

interface ICreateContext {
  req: ExpressContext
}

export function createContext({ req }: ICreateContext): ctx {
  const sessionId = req.req.headers.authorization?.split(' ')[2]

  return {
    prisma,
    expressContext: req,
    session: getSession(sessionId),
  }
}
