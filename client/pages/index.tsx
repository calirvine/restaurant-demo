import { gql, useQuery } from '@apollo/client'

import {
  RESTAURANT_FRAGMENT,
  RestaurantCard,
} from '../components/restaurantCard'
import { allRestaurantsQuery } from './__generated__/allRestaurantsQuery'

const RESTAURANTS_QUERY = gql`
  query allRestaurantsQuery {
    allRestaurants {
      ...RestaurantFragment
    }
  }
  ${RESTAURANT_FRAGMENT}
`

export default function Home() {
  const { loading, error, data } = useQuery<allRestaurantsQuery>(
    RESTAURANTS_QUERY,
  )
  const allRestaurants = data?.allRestaurants || []
  return (
    <div>
      {!loading &&
        !error &&
        allRestaurants.map(restaurant => (
          <RestaurantCard key={restaurant.id} data={restaurant} />
        ))}
    </div>
  )
}
