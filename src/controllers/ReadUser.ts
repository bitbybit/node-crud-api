import {
  type Controller,
  type ControllerActionParams,
  type User
} from '../interfaces'
import { BaseController } from './BaseController'
import { ValidationError } from '../exceptions/ValidationError'
import { isValidId } from '../helpers/validation'

export class ReadUser extends BaseController implements Controller {
  public method: Controller['method'] = 'get'
  public url: Controller['url'] = /^users\/(.+)$/

  /**
   * Read user
   * @param payload
   * @param payload.url
   * @returns User
   * @throws {ValidationError|StoreError}
   */
  public action({ url }: ControllerActionParams): User {
    const userId = url.match(this.url)?.[1] ?? ''

    if (!isValidId(userId)) {
      throw new ValidationError('User id is invalid')
    }

    return this.store.getUser(userId)
  }
}
