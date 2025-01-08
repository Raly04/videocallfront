import { Avatar } from "primeng/avatar"

export interface User {
  id: number,
  username: string,
  avatar: string,
  mail: string,
  groups: Group[],
  password: string
  contacts : User[];
}

export interface AuthResponse {
  user: User,
  content: string
}

export interface Mess {
  id: number,
  content: string,
  sender: number,
  type : MessageType,
  receiver: number,
  date: Date,
}

export enum MessageType {
  USER = 'USER',
  GROUP = 'GROUP'
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
  FRIEND_REQUEST = "FRIEND_REQUEST", OTHER = "OTHER"
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
