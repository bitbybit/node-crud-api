import { User } from '../interfaces'
import { StoreError } from '../exceptions/StoreError'
import { v4 as uuid } from 'uuid'

class Store {
  public users: User[] = []
}

export class StoreManager {
  readonly #store: Store

  constructor() {
    this.#store = new Store()
  }

  public getUsers(): User[] {
    return this.#store.users
  }

  /**
   * Get user by `id`
   * @param userId
   * @returns User
   * @throws {StoreError}
   */
  public getUser(userId: User['id']): User {
    const userIndex = this.#findUserIndex(userId)

    return this.#store.users[userIndex]
  }

  public addUser(user: Omit<User, 'id'>): void {
    this.#store.users.push({
      id: uuid(),
      ...user
    })
  }

  /**
   * Edit user
   * @param user
   * @throws {StoreError}
   */
  public updateUser(user: User): void {
    const userIndex = this.#findUserIndex(user.id)

    this.#store.users[userIndex] = user
  }

  /**
   * Remove user by `id`
   * @param userId
   * @throws {StoreError}
   */
  public removeUser(userId: User['id']): void {
    const userIndex = this.#findUserIndex(userId)

    this.#store.users.splice(userIndex, 1)
  }

  /**
   * Find user index in a list of users by `id`
   * @param userId
   * @returns number
   * @throws {StoreError}
   */
  #findUserIndex(userId: User['id']): number {
    const userIndex = this.#store.users.findIndex(({ id }) => id === userId)

    if (userIndex === -1) {
      throw new StoreError(`User with id ${userId} not found`)
    }

    return userIndex
  }
}
