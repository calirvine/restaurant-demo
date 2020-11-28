/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: RestaurantFragment
// ====================================================

export interface RestaurantFragment_score {
  __typename: "Score";
  numOfReviews: number | null;
  score: number | null;
}

export interface RestaurantFragment {
  __typename: "Restaurant";
  id: string | null;
  name: string | null;
  description: string | null;
  score: RestaurantFragment_score | null;
}
