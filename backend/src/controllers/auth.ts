import { hash, compare } from 'bcryptjs'
import { Profile, User, UserDelegate } from '@prisma/client'
interface ICreateUser {
  email?: string
  password?: string
  name?: string
  role?: string
}

export enum AuthErrors {
  NO_USER = 'nouser',
  DUPLICATE_USER = 'duplicate user',
  INCORRECT_PASSWORD = 'incorrect password',
  MISSING_DATA = 'incomplete user',
}

interface IAuthError {
  error: AuthErrors
  message: string
}

const roles = ['user', 'owner', 'admin']

export async function createUser(
  { email, password, name, role = 'user' }: ICreateUser,
  userInterface: UserDelegate,
): Promise<(User & { profile: Profile | null }) | IAuthError> {
  if (!email || !password || !name)
    return {
      error: AuthErrors.MISSING_DATA,
      message: 'Missing email or password or name',
    }

  const hashedPassword = await hash(password, 12)
  if (await userInterface.findOne({ where: { email } }))
    return {
      error: AuthErrors.DUPLICATE_USER,
      message: 'A user already exists',
    }
  return userInterface.create({
    data: {
      email,
      password: hashedPassword,
      profile: { create: { name, role: roles.indexOf(role) } },
    },
    include: { profile: true },
  })
}

export async function verifyUser(
  { email, password }: ICreateUser,
  userInterface: UserDelegate,
): Promise<(User & { profile: Profile | null }) | IAuthError> {
  if (!email || !password)
    return {
      error: AuthErrors.MISSING_DATA,
      message: 'Missing email or password',
    }
  const user = await userInterface.findOne({
    where: { email: email },
    include: { profile: true },
  })
  if (!user) return { error: AuthErrors.NO_USER, message: 'No user found' }
  if (await compare(password, user.password)) return user
  return {
    error: AuthErrors.INCORRECT_PASSWORD,
    message: "Password didn't match",
  }
}
