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
  sender: User,
  receiver: User | Group,
  date : Date,
}

export interface Group {
  id : number,
  avatar : string,
  name : string,
  users : User[],
}

export interface AuthJwtResponse {
  user: User,
  content: string[],
}

export interface RefreshTokenResponse {
  accessToken: string,
  refreshToken: string,
}

