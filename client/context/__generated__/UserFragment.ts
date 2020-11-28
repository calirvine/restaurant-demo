/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Role } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL fragment: UserFragment
// ====================================================

export interface UserFragment_profile {
  __typename: "Profile";
  role: Role | null;
  name: string | null;
}

export interface UserFragment {
  __typename: "User";
  id: string | null;
  email: string | null;
  profile: UserFragment_profile | null;
}
