export type User = {
  age: number
  hobbies: string[]
  id: string
  username: string
}

export type ControllerPayloadKeys = keyof User

export type ControllerPayloadValues = User[ControllerPayloadKeys]

export type ControllerPayload = Record<
  ControllerPayloadKeys,
  ControllerPayloadValues
>

export type ControllerActionParams = {
  data: ControllerPayload
  url: string
}

export interface Controller {
  method: 'get' | 'post' | 'put' | 'delete'
  url: RegExp

  action({ data, url }: ControllerActionParams): unknown
}
