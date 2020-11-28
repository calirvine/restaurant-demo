import {
  objectType,
  extendType,
  inputObjectType,
  arg,
  stringArg,
} from '@nexus/schema'
import { ctx } from '../context'

export const restaurant = objectType({
  name: 'Restaurant',
  definition(t) {
    t.id('id')
    t.string('name')
    t.string('description')
    t.field('owner', {
      type: 'User',
      resolve(restaurant, _, ctx: ctx) {
        return ctx.prisma.user.findOne({ where: { id: restaurant.ownerId } })
      },
    })
  },
})

export const owner = extendType({
  type: 'User',
  definition(t) {
    t.list.field('restaurants', {
      type: 'Restaurant',
      nullable: true,
      resolve(user, _, ctx: ctx) {
        return ctx.prisma.restaurant.findMany({ where: { ownerId: user.id } })
      },
    })
  },
})

export const restaurantInputs = inputObjectType({
  name: 'RestaurantInputs',
  definition(t) {
    t.string('name', { nullable: false })
    t.string('description', {
      nullable: false,
    })
    t.string('owner', {
      nullable: true,
    })
  },
})

export const mutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addRestaurant', {
      type: 'Restaurant',
      args: {
        RestaurantInput: arg({
          type: 'RestaurantInputs',
          nullable: false,
        }),
      },
      async resolve(_, { RestaurantInput }, ctx: ctx) {
        const session = await ctx.session
        if (
          session?.role !== 2 &&
          RestaurantInput.owner &&
          RestaurantInput.owner !== session?.userId
        )
          throw new Error('Cannot create a restaurant for someone else')
        const owner =
          session?.role === 2
            ? RestaurantInput.owner || session.userId
            : session?.userId
        if (!owner || session?.role === 0)
          throw new Error('Unauthenticated session')

        return ctx.prisma.restaurant.create({
          data: {
            name: RestaurantInput.name,
            description: RestaurantInput.description,
            owner: { connect: { id: owner } },
          },
        })
      },
    })
    t.field('deleteRestaurantById', {
      type: 'Boolean',
      args: {
        restaurantId: stringArg({
          nullable: false,
        }),
      },
      async resolve(_, { restaurantId }, ctx: ctx) {
        const userRole = (await ctx.session)?.role
        if (userRole !== 2)
          throw new Error('Only admins can delete restaurants')
        return !!(await ctx.prisma.restaurant.delete({
          where: { id: restaurantId },
        }))
      },
    })
  },
})

export const query = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('allRestaurants', {
      type: 'Restaurant',
      resolve(_, __, ctx: ctx) {
        return ctx.prisma.restaurant.findMany()
      },
    })
    t.field('restaurantById', {
      type: 'Restaurant',
      args: {
        id: stringArg({
          nullable: false,
        }),
      },
      resolve(_, { id }, ctx: ctx) {
        return ctx.prisma.restaurant.findOne({ where: { id } })
      },
    })
  },
})
