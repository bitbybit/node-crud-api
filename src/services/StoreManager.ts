import { type StoreManagerAbstract, type User } from '../interfaces'
import { StoreError } from '../exceptions/StoreError'
import { v4 as uuid } from 'uuid'

class Store {
  public users: User[] = []
}

export class StoreManager implements StoreManagerAbstract {
  readonly #store: Store

  constructor() {
    this.#store = new Store()
  }

  public async getUsers(): Promise<User[]> {
    return this.#store.users
  }

  /**
   * Get user by `id`
   * @param userId
   * @returns Promise<User>
   * @throws {StoreError}
   */
  public async getUser(userId: User['id']): Promise<User> {
    const userIndex = this.#findUserIndex(userId)

    return this.#store.users[userIndex]
  }

  public async addUser(user: Omit<User, 'id'>): Promise<User> {
    const newUser = {
      id: uuid(),
      ...user
    }

    this.#store.users.push(newUser)

    return newUser
  }

  /**
   * Edit user
   * @param user
   * @returns Promise<User>
   * @throws {StoreError}
   */
  public async updateUser(user: User): Promise<User> {
    const userIndex = this.#findUserIndex(user.id)

    this.#store.users[userIndex] = {
      ...this.#store.users[userIndex],
      ...user
    }

    return this.#store.users[userIndex]
  }

  /**
   * Remove user by `id`
   * @param userId
   * @throws {StoreError}
   */
  public async removeUser(userId: User['id']): Promise<void> {
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
