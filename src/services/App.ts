import { HttpServer, type Request, type Response } from './HttpServer'
import { StoreManager } from './StoreManager'
import { Controller } from '../interfaces'
import { CreateUser } from '../controllers/CreateUser'
import { DeleteUser } from '../controllers/DeleteUser'
import { ReadUser } from '../controllers/ReadUser'
import { ReadUsers } from '../controllers/ReadUsers'
import { UpdateUser } from '../controllers/UpdateUser'
import { ControllerError } from '../exceptions/ControllerError'
import { HTTP_CODES } from '../const/http-codes'

type AppParams = {
  port: number
  baseUrl: string
  store: StoreManager
}

export class App {
  readonly #baseUrl: string

  readonly #server: HttpServer['instance']

  readonly #store: StoreManager

  readonly #controllers: Controller[]

  constructor(params: AppParams) {
    const httpServer = new HttpServer({
      port: params.port
    })

    this.#server = httpServer.instance

    this.#baseUrl = params.baseUrl

    this.#store = params.store

    this.#controllers = [
      CreateUser,
      DeleteUser,
      ReadUser,
      ReadUsers,
      UpdateUser
    ].map((controllerClass) => new controllerClass(this.#store))
  }

  public init(): void {
    this.#server.on('request', this.#handleRequest.bind(this))
  }

  /**
   * Request handling logic
   * @param request
   * @param response
   * @throws {Error}
   */
  #handleRequest<
    Req extends Request = Request,
    Res extends Response<Req> = Response
  >(request: InstanceType<Req>, response: InstanceType<Res>): void {
    try {
      const method = request.method?.toLowerCase() ?? ''

      const url = request.url?.slice(this.#baseUrl.length)?.toLowerCase() ?? ''

      const controller = this.#findController({
        method,
        url
      })

      this.#handleRoute(response, controller)
    } catch (e) {
      this.#handleRequestException(response, e)
    }
  }

  /**
   * Request exception handling logic
   * @param response
   * @param e
   * @throws {Error}
   */
  #handleRequestException(response: InstanceType<Response>, e: unknown): void {
    const error = e as Error

    const isControllerError =
      (error as ControllerError).name === 'ControllerError'

    if (isControllerError) {
      this.#handleNotFound(response, error.message)
    } else {
      throw e
    }
  }

  /**
   * Find controller for specified method and URL
   * @param payload
   * @param payload.method
   * @param payload.url
   * @returns Controller
   * @throws {ControllerError}
   */
  #findController({
    method,
    url
  }: {
    method: string
    url: string
  }): Controller {
    const foundController = this.#controllers.find(
      (controller) => controller.method === method && url.match(controller.url)
    )

    if (foundController === undefined) {
      throw new ControllerError(
        `Controller for method ${method.toUpperCase()} and URL ${this.#baseUrl}${url} not found`
      )
    }

    return foundController
  }

  #handleRoute(response: InstanceType<Response>, controller: Controller): void {
    this.#setResponseCode(response, HTTP_CODES.Ok)

    this.#setResponseBody(response, {
      data: controller.constructor.name
    })
  }

  #handleNotFound(response: InstanceType<Response>, message: string): void {
    this.#setResponseCode(response, HTTP_CODES.NotOFund)

    this.#setResponseBody(response, {
      message
    })
  }

  #setResponseCode(response: InstanceType<Response>, code: number): void {
    response.writeHead(code, { 'Content-Type': 'application/json' })
  }

  #setResponseBody<Body>(response: InstanceType<Response>, body: Body): void {
    response.end(JSON.stringify(body))
  }
}
