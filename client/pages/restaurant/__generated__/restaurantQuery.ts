/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: restaurantQuery
// ====================================================

export interface restaurantQuery_restaurantById_score {
  __typename: "Score";
  numOfReviews: number | null;
  score: number | null;
}

export interface restaurantQuery_restaurantById {
  __typename: "Restaurant";
  id: string | null;
  name: string | null;
  description: string | null;
  score: restaurantQuery_restaurantById_score | null;
}

export interface restaurantQuery {
  restaurantById: restaurantQuery_restaurantById | null;
}

export interface restaurantQueryVariables {
  id: string;
}
