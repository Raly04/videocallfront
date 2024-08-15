import { Avatar } from "primeng/avatar"

export interface User {
  id: number,
  username: string,
  avatar: string,
  mail: string,
  groups: Group[],
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
  date: Date,
}

export interface Group {
  id: number,
  avatar: string,
  name: string,
  users: User[],
}

export interface AuthJwtResponse {
  user: User,
  content: string[],
}

export interface RefreshTokenResponse {
  accessToken: string,
  refreshToken: string,
}

export interface Contact {
  id: number,
  avatar: string,
  name: string,
  credentials: {
    mail: string,
    password: string
  },
  GroupsOrUsers: User[] | Group[],
  isGroup: boolean
}
export enum NotifType {
  FRIEND_REQUEST, OTHER
}
export interface Notif {
  id: number,
  type: NotifType
  sender: User,
  date: Date,
}

export interface FriendRequestNotif extends Notif {
  receiver: User,
  accepted: boolean,
}
