import { type Controller, type User } from '../interfaces'
import { BaseController } from './BaseController'

export class ReadUsers extends BaseController implements Controller {
  public method: Controller['method'] = 'get'
  public url: Controller['url'] = /^users$/

  /**
   * Read users
   * @returns User[]
   * @throws {StoreError}
   */
  public action(): User[] {
    return this.store.getUsers()
  }
}
