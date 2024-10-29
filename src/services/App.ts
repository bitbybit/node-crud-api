import { HttpServer, type Request, type Response } from './HttpServer'
import {
  type Controller,
  type ControllerPayload,
  type ControllerPayloadKeys,
  type ControllerPayloadValues,
  type StoreManagerAbstract
} from '../interfaces'
import { CreateUser } from '../controllers/CreateUser'
import { DeleteUser } from '../controllers/DeleteUser'
import { ReadUser } from '../controllers/ReadUser'
import { ReadUsers } from '../controllers/ReadUsers'
import { UpdateUser } from '../controllers/UpdateUser'
import { ControllerError } from '../exceptions/ControllerError'
import { HTTP_CODES } from '../const/http-codes'
import { StoreError } from '../exceptions/StoreError'
import { ValidationError } from '../exceptions/ValidationError'

type AppParams = {
  port: number
  baseUrl: string
  store: StoreManagerAbstract
}

export class App {
  readonly #baseUrl: string
  readonly #server: HttpServer
  readonly #store: StoreManagerAbstract
  readonly #controllers: Controller[]

  constructor(params: AppParams) {
    this.#server = new HttpServer({
      port: params.port
    })

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
    this.#server.instance.on('request', this.#handleRequest.bind(this))
  }

  /**
   * Request handling logic
   * @param request
   * @param response
   * @throws {Error}
   */
  async #handleRequest<
    Req extends Request = Request,
    Res extends Response<Req> = Response
  >(request: InstanceType<Req>, response: InstanceType<Res>): Promise<void> {
    try {
      const method = this.#server.getRequestMethod(request)

      const url = this.#server.getRequestUrl(request, this.#baseUrl)

      const data = await this.#server.getRequestData<
        ControllerPayloadKeys,
        ControllerPayloadValues
      >(request)

      const controller = this.#findController({
        method,
        url
      })

      await this.#handleRoute({
        data,
        controller,
        response,
        url
      })
    } catch (e) {
      this.#handleRequestException(response, e)
    }
  }

  async #handleRoute({
    controller,
    data,
    response,
    url
  }: {
    controller: Controller
    data: ControllerPayload
    response: InstanceType<Response>
    url: string
  }): Promise<void> {
    try {
      const result = await controller.action({
        data,
        url
      })

      const isCreate = controller instanceof CreateUser
      const isDelete = controller instanceof DeleteUser

      let code: number

      switch (true) {
        case isCreate:
          code = HTTP_CODES.created
          break

        case isDelete:
          code = HTTP_CODES.noContent
          break

        default:
          code = HTTP_CODES.ok
          break
      }

      this.#server.setResponseCode(response, code)

      if (!isDelete) {
        this.#server.setResponseBody(response, result)
      } else {
        response.end()
      }
    } catch (e) {
      this.#handleRouteException(response, e)
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
        `Controller for method ${method.toUpperCase()} and URL ${url} not found`
      )
    }

    return foundController
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
      this.#handleUncaught(response)
    }
  }

  /**
   * Route exception handling logic
   * @param response
   * @param e
   * @throws {Error}
   */
  #handleRouteException(response: InstanceType<Response>, e: unknown): void {
    const error = e as Error

    const isStoreError = (error as StoreError).name === 'StoreError'

    const isValidationError =
      (error as ValidationError).name === 'ValidationError'

    switch (true) {
      case isStoreError:
        this.#handleNotFound(response, error.message)
        break

      case isValidationError:
        this.#handleInvalid(response, error.message)
        break

      default:
        this.#handleUncaught(response)
        break
    }
  }

  #handleNotFound(response: InstanceType<Response>, message: string): void {
    this.#server.setResponseCode(response, HTTP_CODES.notFound)

    this.#server.setResponseBody(response, {
      message
    })
  }

  #handleInvalid(response: InstanceType<Response>, message: string): void {
    this.#server.setResponseCode(response, HTTP_CODES.badRequest)

    this.#server.setResponseBody(response, {
      message
    })
  }

  #handleUncaught(response: InstanceType<Response>): void {
    this.#server.setResponseCode(response, HTTP_CODES.serverError)

    this.#server.setResponseBody(response, {
      message: 'Internal server error'
    })
  }
}
