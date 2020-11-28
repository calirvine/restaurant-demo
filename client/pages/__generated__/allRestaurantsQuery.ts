/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: allRestaurantsQuery
// ====================================================

export interface allRestaurantsQuery_allRestaurants_score {
  __typename: "Score";
  numOfReviews: number | null;
  score: number | null;
}

export interface allRestaurantsQuery_allRestaurants {
  __typename: "Restaurant";
  id: string | null;
  name: string | null;
  description: string | null;
  score: allRestaurantsQuery_allRestaurants_score | null;
}

export interface allRestaurantsQuery {
  allRestaurants: (allRestaurantsQuery_allRestaurants | null)[] | null;
}
