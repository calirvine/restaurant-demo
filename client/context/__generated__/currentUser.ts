/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Role } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: currentUser
// ====================================================

export interface currentUser_me_profile {
  __typename: "Profile";
  role: Role | null;
  name: string | null;
}

export interface currentUser_me {
  __typename: "User";
  id: string | null;
  email: string | null;
  profile: currentUser_me_profile | null;
}

export interface currentUser {
  me: currentUser_me | null;
}
