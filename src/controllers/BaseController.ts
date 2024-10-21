import { StoreManager } from '../services/StoreManager'

export class BaseController {
  protected readonly store: StoreManager

  constructor(store: StoreManager) {
    this.store = store
  }
}
