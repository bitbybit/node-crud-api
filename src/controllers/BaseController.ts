import { StoreManager } from '../services/StoreManager'

export class BaseController {
  #store: StoreManager

  constructor(store: StoreManager) {
    this.#store = store
  }
}
