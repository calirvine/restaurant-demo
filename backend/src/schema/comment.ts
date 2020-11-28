import {
  objectType,
  extendType,
  inputObjectType,
  arg,
  stringArg,
} from '@nexus/schema'
import { ctx } from '../context'

export const comment = objectType({
  name: 'Comment',
  definition(t) {
    t.id('id')
    t.string('comment')
  },
})

export const extendReview = extendType({
  type: 'Review',
  definition(t) {
    t.field('ownerComment', {
      type: 'Comment',
      nullable: true,
      resolve(review, _, ctx: ctx) {
        if (!review.reviewCommentId) return null
        return ctx.prisma.reviewComment.findFirst({
          where: { id: review.reviewCommentId },
        })
      },
    })
  },
})

export const inputs = inputObjectType({
  name: 'ReviewCommentInput',
  definition(t) {
    t.string('comment', { nullable: false })
    t.string('reviewId', { nullable: false })
  },
})

export const mutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('addCommentToReview', {
      type: 'Comment',
      args: {
        ReviewCommentInput: arg({
          type: 'ReviewCommentInput',
          nullable: false,
        }),
      },
      async resolve(_, { ReviewCommentInput }, ctx: ctx) {
        if (!ReviewCommentInput) throw new Error('Missing required fields')
        const userId = (await ctx.session)?.userId
        const review = await ctx.prisma.review.findOne({
          where: { id: ReviewCommentInput.reviewId },
          include: { restaurant: true },
        })
        if (review?.reviewCommentId)
          throw new Error('Review has already been commented on')
        if (review?.restaurant.ownerId !== userId)
          throw new Error('User doesnt own the restaurant being reviewed')
        return ctx.prisma.reviewComment.create({
          data: {
            comment: ReviewCommentInput.comment,
            review: { connect: { id: ReviewCommentInput.reviewId } },
            author: { connect: { id: userId } },
          },
        })
      },
    })
    t.field('deleteCommentById', {
      type: 'Boolean',
      args: {
        commentId: stringArg({
          nullable: false,
        }),
      },
      async resolve(_, { commentId }, ctx: ctx) {
        const userRole = (await ctx.session)?.role
        if (userRole !== 2) throw new Error('Only admins can delete comments')
        return !!(await ctx.prisma.reviewComment.delete({
          where: { id: commentId },
        }))
      },
    })
  },
})
