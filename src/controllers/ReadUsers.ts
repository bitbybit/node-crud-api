import { type Controller, type User } from '../interfaces'
import { BaseController } from './BaseController'

export class ReadUsers extends BaseController implements Controller {
  public method: Controller['method'] = 'get'
  public url: Controller['url'] = /^users$/

  /**
   * Read users
   * @returns Promise<User[]>
   * @throws {StoreError}
   */
  public async action(): Promise<User[]> {
    return await this.store.getUsers()
  }
}
