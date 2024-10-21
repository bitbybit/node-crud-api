import { Store } from '../interfaces'

export class BaseController<S extends Store = Store> {
  #store: S

  constructor(store: S) {
    this.#store = store
  }
}
