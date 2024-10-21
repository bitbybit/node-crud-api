import { config as setEnvVariables } from 'dotenv'
import { PORT_HTTP, BASE_URL } from '../const/defaults'

/**
 * Get `PORT` value from ENV (`.env` file)
 * @returns number
 */
export const getPort = (): number => {
  setEnvVariables()

  return Number(process.env.PORT ?? PORT_HTTP)
}

/**
 * Get `BASE_URL` value from ENV (`.env` file)
 * @returns number
 */
export const getBaseUrl = (): string => {
  setEnvVariables()

  return process.env.BASE_URL ?? BASE_URL
}
