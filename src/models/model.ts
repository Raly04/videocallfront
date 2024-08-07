export interface User {
  id: number,
  username: string,
  mail: string,
  groups: string[],
  password: string
}

export interface AuthResponse {
  user: User,
  content: string
}

export interface Mess {
  id: number,
  content: string,
  sender: string,
  recipient: string,
  date : Date,
}

export interface AuthJwtResponse {
  user: User,
  content: string[],
}

export interface RefreshTokenResponse {
  accessToken: string,
  refreshToken: string,
}

