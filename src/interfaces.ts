export type User = {
  age: number
  hobbies: string[]
  id: string
  username: string
}

export interface Store {
  users: User[]
}

export interface Controller {
  method: 'get' | 'post' | 'put' | 'delete'
  url: RegExp
}
