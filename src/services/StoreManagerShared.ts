import { type StoreManagerAbstract, type User } from '../interfaces'
import { StoreError } from '../exceptions/StoreError'

export class StoreManagerShared implements StoreManagerAbstract {
  public async getUsers(): Promise<User[]> {
    return await new Promise((resolve, reject) => {
      if (process.send !== undefined) {
        process.send({ type: 'getUsers' })
      }

      process.once(
        'message',
        ({
          type,
          data,
          error
        }: {
          type: string
          data: User[]
          error?: string
        }) => {
          if (type === 'getUsers') {
            resolve(data)
          }

          if (type === 'getUsersError' && error !== undefined) {
            reject(new StoreError(error))
          }
        }
      )

      process.on('error', (e) => reject(new StoreError(e.message)))
    })
  }

  public async getUser(userId: User['id']): Promise<User> {
    return await new Promise((resolve, reject) => {
      if (process.send !== undefined) {
        process.send({ type: 'getUser', userId })
      }

      process.once(
        'message',
        ({
          type,
          data,
          error
        }: {
          type: string
          data: User
          error?: string
        }) => {
          if (type === 'getUser') {
            resolve(data)
          }

          if (type === 'getUserError' && error !== undefined) {
            reject(new StoreError(error))
          }
        }
      )

      process.on('error', (e) => reject(new StoreError(e.message)))
    })
  }

  public async addUser(user: Omit<User, 'id'>): Promise<User> {
    return await new Promise((resolve, reject) => {
      if (process.send !== undefined) {
        process.send({ type: 'addUser', user })
      }

      process.once(
        'message',
        ({
          type,
          data,
          error
        }: {
          type: string
          data: User
          error?: string
        }) => {
          if (type === 'addUser') {
            resolve(data)
          }

          if (type === 'addUserError' && error !== undefined) {
            reject(new StoreError(error))
          }
        }
      )

      process.on('error', (e) => reject(new StoreError(e.message)))
    })
  }

  public async updateUser(user: User): Promise<User> {
    return await new Promise((resolve, reject) => {
      if (process.send !== undefined) {
        process.send({ type: 'updateUser', user })
      }

      process.once(
        'message',
        ({
          type,
          data,
          error
        }: {
          type: string
          data: User
          error?: string
        }) => {
          if (type === 'updateUser') {
            resolve(data)
          }

          if (type === 'updateUserError' && error !== undefined) {
            reject(new StoreError(error))
          }
        }
      )

      process.on('error', (e) => reject(new StoreError(e.message)))
    })
  }

  public async removeUser(userId: User['id']): Promise<void> {
    return await new Promise((resolve, reject) => {
      if (process.send !== undefined) {
        process.send({ type: 'removeUser', userId })
      }

      process.once(
        'message',
        ({ type, error }: { type: string; error?: string }) => {
          if (type === 'removeUser') {
            resolve()
          }

          if (type === 'removeUserError' && error !== undefined) {
            reject(new StoreError(error))
          }
        }
      )

      process.on('error', (e) => reject(new StoreError(e.message)))
    })
  }
}
