import {
  type Controller,
  type ControllerActionParams,
  type User
} from '../interfaces'
import { BaseController } from './BaseController'
import {
  isValidAge,
  isValidHobbies,
  isValidUsername
} from '../helpers/validation'
import { ValidationError } from '../exceptions/ValidationError'

export class CreateUser extends BaseController implements Controller {
  public method: Controller['method'] = 'post'
  public url: Controller['url'] = /^users$/

  /**
   * Create user
   * @param payload
   * @param payload.data
   * @returns User
   * @throws {ValidationError}
   */
  public action({ data }: ControllerActionParams): User {
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
      username
    }

    return this.store.addUser(user)
  }
}
