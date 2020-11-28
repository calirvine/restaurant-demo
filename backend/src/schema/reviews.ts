import {
  objectType,
  extendType,
  inputObjectType,
  arg,
  stringArg,
} from '@nexus/schema'
import { Review } from '@prisma/client'
import { ctx } from '../context'

export const review = objectType({
  name: 'Review',
  definition(t) {
    t.id('id')
    t.int('rating')
    t.string('comment')
    t.field('author', {
      type: 'User',
      resolve(review: Review, _, ctx: ctx) {
        return ctx.prisma.user.findOne({ where: { id: review.userId } })
      },
    })
    t.field('restaurant', {
      type: 'Restaurant',
      resolve(review: Review, _, ctx: ctx) {
        return ctx.prisma.restaurant.findOne({
          where: { id: review.restaurantId },
        })
      },
    })
  },
})

export const score = objectType({
  name: 'Score',
  definition(t) {
    t.float('score')
    t.int('numOfReviews')
  },
})

export const extendRestaurant = extendType({
  type: 'Restaurant',
  definition(t) {
    t.list.field('Reviews', {
      type: 'Review',
      resolve(restaurant, _, ctx: ctx) {
        return ctx.prisma.review.findMany({
          where: { restaurantId: restaurant.id },
        })
      },
    })
    t.field('score', {
      type: 'Score',
      nullable: true,
      async resolve(restaurant, _, ctx: ctx) {
        const reviews = await ctx.prisma.review.findMany({
          where: { restaurantId: restaurant.id },
        })
        if (!reviews || reviews.length === 0) return null
        const numOfReviews = reviews.length
        const score =
          Math.floor(
            (reviews.reduce((acc, curr) => acc + curr.rating, 0) /
              numOfReviews) *
              100,
          ) / 100
        return { score, numOfReviews }
      },
    })
  },
})

export const extendUser = extendType({
  type: 'User',
  definition(t) {
    t.list.field('reviews', {
      type: 'Review',
      resolve(user, _, ctx: ctx) {
        return ctx.prisma.review.findMany({ where: { userId: user.id } })
      },
    })
  },
})

export const reviewInput = inputObjectType({
  name: 'ReviewInput',
  definition(t) {
    t.string('comment', {
      nullable: false,
    })
    t.int('rating', {
      nullable: false,
    })
  },
})

export const addReview = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addReview', {
      type: 'Review',
      args: {
        ReviewInput: arg({
          type: 'ReviewInput',
          nullable: false,
        }),
        restaurant: stringArg({
          nullable: false,
        }),
      },
      async resolve(_, { restaurant, ReviewInput }, ctx: ctx) {
        const userId = (await ctx.session)?.userId
        if (!userId) throw new Error('Unauthenticated user')
        const review = await ctx.prisma.review.findFirst({
          where: { restaurantId: restaurant, userId },
        })
        if (review) return review
        return ctx.prisma.review.create({
          data: {
            rating: ReviewInput.rating,
            restaurant: { connect: { id: restaurant } },
            author: { connect: { id: userId } },
            comment: ReviewInput.comment,
          },
        })
      },
    })
    t.field('deleteReviewById', {
      type: 'Boolean',
      args: {
        reviewId: stringArg({
          nullable: false,
        }),
      },
      async resolve(_, { reviewId }, ctx: ctx) {
        const userRole = (await ctx.session)?.role
        if (userRole !== 2)
          throw new Error('Only admins can delete restaurants')
        return !!(await ctx.prisma.review.delete({
          where: { id: reviewId },
        }))
      },
    })
  },
})
