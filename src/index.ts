import { App } from './services/App'
import { getBaseUrl, getPort } from './helpers/env'
import { store } from './store'

const app = new App({
  baseUrl: getBaseUrl(),
  port: getPort(),
  store
})

app.init()
