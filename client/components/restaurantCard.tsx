import styled from '@emotion/styled'
import { gql } from '@apollo/client'

import { mq } from '../styles/breakpoints'

import { RestaurantFragment } from './__generated__/RestaurantFragment'
import Link from 'next/link'
import Image from 'next/image'

import restaurantImage from '../public/restaurant-placeholder.jpg'

interface IRestaurantCard {
  data: RestaurantFragment
}

const Wrapper = styled.div`
  ${mq({
    width: ['100%', '48%', '30%'],
    padding: '20px',
  })}
`
const Container = styled.div`
  ${mq({
    border: '1px solid #f7f7f7',
    borderRadius: '8px',
    padding: '20px',
    cursor: 'pointer',
  })}
`

const Title = styled.h5`
  margin-bottom: 20px;
`

const ReviewScore = styled.p`
  ${mq({
    marginTop: '20px',
    color: 'grey',
  })}
`

export const RESTAURANT_FRAGMENT = gql`
  fragment RestaurantFragment on Restaurant {
    id
    name
    description
    score {
      numOfReviews
      score
    }
  }
`

export const RestaurantCard: React.FC<IRestaurantCard> = ({ data }) => {
  const { id, name, description, score } = data
  return (
    <Wrapper>
      <Link href={`/restaurant/${id}`}>
        <Container>
          <Title>{name}</Title>
          <Image
            src="/restaurant-placeholder.jpg"
            alt="Image of a restaurant"
            width={300}
            height={170}
          />
          <p>{description}</p>
          {score && (
            <ReviewScore>{`Avg: ${score.score}/5 (${score.numOfReviews})`}</ReviewScore>
          )}
        </Container>
      </Link>
    </Wrapper>
  )
}
