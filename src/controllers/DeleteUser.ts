import { type Controller, type ControllerActionParams } from '../interfaces'
import { BaseController } from './BaseController'
import { isValidId } from '../helpers/validation'
import { ValidationError } from '../exceptions/ValidationError'

export class DeleteUser extends BaseController implements Controller {
  public method: Controller['method'] = 'delete'
  public url: Controller['url'] = /^users\/(.+)$/

  /**
   * Delete user
   * @param payload
   * @param payload.url
   * @throws {ValidationError|StoreError}
   */
  public async action({ url }: ControllerActionParams): Promise<void> {
    const userId = url.match(this.url)?.[1] ?? ''

    if (!isValidId(userId)) {
      throw new ValidationError('User id is invalid')
    }

    await this.store.removeUser(userId)
  }
}
