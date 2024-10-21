import { Controller } from '../interfaces'
import { UUID_V4_RE } from '../const/regexp'
import { BaseController } from './BaseController'

export class DeleteUser extends BaseController implements Controller {
  private userIdRegExp = UUID_V4_RE

  public method: Controller['method'] = 'delete'

  public url: Controller['url'] = new RegExp(
    '^users/(' + this.userIdRegExp.source + ')$'
  )
}
