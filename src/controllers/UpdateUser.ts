import {
  type Controller,
  type ControllerActionParams,
  type User
} from '../interfaces'
import { BaseController } from './BaseController'
import {
  isValidAge,
  isValidHobbies,
  isValidId,
  isValidUsername
} from '../helpers/validation'
import { ValidationError } from '../exceptions/ValidationError'

export class UpdateUser extends BaseController implements Controller {
  public method: Controller['method'] = 'put'
  public url: Controller['url'] = /^users\/(.+)$/

  /**
   * Update user
   * @param payload
   * @param payload.data
   * @param payload.url
   * @returns Promise<User>
   * @throws {ValidationError|StoreError}
   */
  public async action({ data, url }: ControllerActionParams): Promise<User> {
    const userId = url.match(this.url)?.[1] ?? ''

    if (!isValidId(userId)) {
      throw new ValidationError('User id is invalid')
    }

    const age = data.age as User['age']

    if (!isValidAge(age)) {
      throw new ValidationError('User age is invalid')
    }

    const hobbies = data.hobbies as User['hobbies']

    if (!isValidHobbies(hobbies)) {
      throw new ValidationError('User hobbies is invalid')
    }

    const username = data.username as User['username']

    if (!isValidUsername(username)) {
      throw new ValidationError('User username is invalid')
    }

    const user = {
      age,
      hobbies,
      id: userId,
      username
    }

    return await this.store.updateUser(user)
  }
}
