export type AuthLogin = {
  email: string
  password: string
}

export type AuthLoginResponse = {
  accessToken: string
  // add any other fields your API returns:
  // refreshToken?: string;
  // user?: { id: string; name: string };
}
