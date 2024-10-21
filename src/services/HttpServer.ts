import http from 'node:http'

type HttpServerParams = {
  port: number
}

export type Request = typeof http.IncomingMessage

export type Response<Req extends Request = Request> =
  typeof http.ServerResponse<InstanceType<Req>>

export class HttpServer {
  public readonly instance: http.Server

  constructor({ port }: HttpServerParams) {
    this.instance = http.createServer()

    this.instance.listen(port)
  }
}
