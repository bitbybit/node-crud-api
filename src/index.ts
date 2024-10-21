import { App } from './services/App'
import { StoreManager } from './services/StoreManager'
import { getBaseUrl, getPort } from './helpers/env'

const app = new App({
  baseUrl: getBaseUrl(),
  port: getPort(),
  store: new StoreManager()
})

app.init()
