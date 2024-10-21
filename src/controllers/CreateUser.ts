import { Controller } from '../interfaces'
import { BaseController } from './BaseController'

export class CreateUser extends BaseController implements Controller {
  public method: Controller['method'] = 'post'

  public url: Controller['url'] = /^users$/
}
