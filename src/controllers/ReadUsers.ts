import { Controller } from '../interfaces'
import { BaseController } from './BaseController'

export class ReadUsers extends BaseController implements Controller {
  public method: Controller['method'] = 'get'

  public url: Controller['url'] = /^users$/
}
