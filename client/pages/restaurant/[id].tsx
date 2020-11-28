import styled from '@emotion/styled'
import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { mq } from '../../styles/breakpoints'
import { RESTAURANT_FRAGMENT } from '../../components/restaurantCard'
import { restaurantQuery } from './__generated__/restaurantQuery'

const RESTAURANT_QUERY = gql`
  query restaurantQuery($id: String!) {
    restaurantById(id: $id) {
      ...RestaurantFragment
    }
  }
  ${RESTAURANT_FRAGMENT}
`

const Restaurant: React.FC = () => {
  const router = useRouter()
  const id = router?.query?.id

  const { loading, error, data } = useQuery<restaurantQuery>(RESTAURANT_QUERY, {
    variables: { id },
  })
  if (loading) return null
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>
  return <pre>{JSON.stringify(data.restaurantById, null, 2)}</pre>
}

export default Restaurant
