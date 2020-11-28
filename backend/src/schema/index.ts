import { queryType } from '@nexus/schema'
import * as userTypes from './user'
import * as restaurantTypes from './restaurant'
import * as reviewTypes from './reviews'
import * as commentTypes from './comment'

const ok = {
  query: queryType({
    definition(t) {
      t.field('ok', {
        type: 'Boolean',
        resolve() {
          return true
        },
      })
    },
  }),
}

export const schema = [
  ok,
  userTypes,
  restaurantTypes,
  reviewTypes,
  commentTypes,
]
