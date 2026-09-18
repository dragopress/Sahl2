import {Request} from 'express';

export interface MembershipContext {
  organizationId:string;
  role:string;
}

export interface AuthContext {
  userId:string;
  memberships:MembershipContext[];
}

export type AuthenticatedRequest=Request & {
  auth?:AuthContext;
  membership?:MembershipContext;
};
