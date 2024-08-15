import { Contact, Group, User } from "./model";

export function contactToUser(contact: Contact): User {
  return {
    id: contact.id,
    avatar: contact.avatar,
    username: contact.name,
    mail: contact.credentials.mail,
    groups: contact.GroupsOrUsers as Group[],
    password: contact.credentials.password,
  }
}

export function contactToGroup(contact: Contact): Group {
  return {
    id: contact.id,
    name: contact.name,
    users: contact.GroupsOrUsers as User[],
    avatar: contact.avatar,
  }
}

export function userToContact(user: User): Contact {
  return {
    id: user.id,
    avatar: user.avatar,
    name: user.username,
    GroupsOrUsers: user.groups as Group[],
    credentials: {
      mail: user.mail,
      password: user.password,
    },
    isGroup: false,
  }
}

export function groupToContact(group: Group): Contact {
  return {
    id: group.id,
    name: group.name,
    GroupsOrUsers: group.users as User[],
    avatar: group.avatar,
    credentials: {
      mail: "",
      password: "",
    },
    isGroup : true,
  }
}
