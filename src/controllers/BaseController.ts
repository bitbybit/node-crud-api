import { type StoreManagerAbstract } from '../interfaces'

export class BaseController {
  protected readonly store: StoreManagerAbstract

  constructor(store: StoreManagerAbstract) {
    this.store = store
  }
}
