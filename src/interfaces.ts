export type User = {
  age: number
  hobbies: string[]
  id: string
  username: string
}

export interface Controller {
  method: 'get' | 'post' | 'put' | 'delete'
  url: RegExp
}
