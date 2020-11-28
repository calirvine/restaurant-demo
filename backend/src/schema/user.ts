import {
  enumType,
  objectType,
  extendType,
  inputObjectType,
  arg,
  stringArg,
} from '@nexus/schema'
import { Profile as IProfile, User as IUser } from '@prisma/client'
import { ctx } from '../context'
import { createUser, verifyUser } from '../controllers/auth'
import { createSession, getSession } from '../controllers/session'

export const Roles = enumType({
  name: 'Role',
  members: ['user', 'owner', 'admin'],
  description: 'The auth level of the logged in user',
})

export const Profile = objectType({
  name: 'Profile',
  definition(t) {
    t.id('id')
    t.string('name')
    t.field('role', {
      type: 'Role',
      resolve(profile: IProfile) {
        if (profile.role === 0) return 'user'
        if (profile.role === 1) return 'owner'
        if (profile.role === 2) return 'admin'
        return null
      },
    })
  },
})

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id')
    t.string('email')
    t.field('profile', {
      type: 'Profile',
      nullable: true,
      resolve(user: IUser, _, ctx: ctx) {
        if (!user.profileId) return null
        return ctx.prisma.profile.findOne({ where: { id: user.profileId } })
      },
    })
  },
})

export const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: true,
      async resolve(_, __, ctx: ctx) {
        const userId = (await ctx.session)?.userId
        if (!userId) return null
        return ctx.prisma.user.findOne({ where: { id: userId } })
      },
    })
  },
})

export const authInput = inputObjectType({
  name: 'AuthInput',
  definition(t) {
    t.string('email', { nullable: false })
    t.string('password', { nullable: false })
  },
})

export const profileInput = inputObjectType({
  name: 'ProfileInput',
  definition(t) {
    t.string('name', { nullable: false })
    t.field('role', {
      type: 'Role',
      nullable: false,
    })
  },
})

export const token = objectType({
  name: 'SessionToken',
  definition(t) {
    t.string('token', {
      nullable: true,
    })
  },
})

export const mutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createUser', {
      type: 'SessionToken',
      args: {
        AuthInput: arg({
          type: 'AuthInput',
          nullable: false,
        }),
        ProfileInput: arg({
          type: 'ProfileInput',
          nullable: false,
        }),
      },
      async resolve(_, args, ctx: ctx) {
        const { AuthInput, ProfileInput } = args

        const res = await createUser(
          { ...AuthInput, ...ProfileInput },
          ctx.prisma.user,
        )
        if ('error' in res) {
          console.log(`Error in createUser: ${res.message}`)
          return { token: null }
        }
        return { token: await createSession(res) }
      },
    })
    t.field('loginUser', {
      type: 'SessionToken',
      args: {
        AuthInput: arg({
          type: 'AuthInput',
          nullable: false,
        }),
      },
      async resolve(_, { AuthInput }, ctx: ctx) {
        const res = await verifyUser(AuthInput, ctx.prisma.user)
        if ('error' in res) {
          console.log(`Error in loginUser: ${res.message}`)
          return { token: null }
        }
        return { token: await createSession(res) }
      },
    })
    t.field('deleteUserById', {
      type: 'Boolean',
      args: {
        userId: stringArg({
          nullable: false,
        }),
      },
      async resolve(_, { userId }, ctx: ctx) {
        const userRole = (await ctx.session)?.role
        if (userRole !== 2)
          throw new Error('Only admins can delete restaurants')
        return !!(await ctx.prisma.user.delete({
          where: { id: userId },
        }))
      },
    })
  },
})
