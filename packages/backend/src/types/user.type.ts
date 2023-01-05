export type UserType = {
  _id: string;
  email: string;
  verifiedEmail?: boolean;
  role?: string;
  authType: AuthType;
};

export enum AuthType {
  Account = 'account',
  User = "user",
}