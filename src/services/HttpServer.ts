import http from 'node:http'
import querystring from 'node:querystring'

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

  public getRequestMethod(request: InstanceType<Request>): string {
    return request.method?.toLowerCase() ?? ''
  }

  public getRequestUrl(request: InstanceType<Request>, baseUrl = ''): string {
    const url = request.url ?? ''

    const urlParsed = new URL(`http://localhost${url}`)

    const urlPath = urlParsed.pathname

    return urlPath.substring(0, baseUrl.length) === baseUrl
      ? urlPath.slice(baseUrl.length)
      : urlPath
  }

  public async getRequestData<Key extends string = string, Value = unknown>(
    request: InstanceType<Request>
  ): Promise<Record<Key, Value>> {
    return await new Promise((resolve, reject) => {
      let chunks = ''

      request.on('data', (chunk) => {
        try {
          chunks += chunk.toString()
        } catch (error) {
          reject(error)
        }
      })

      request.on('end', async () => {
        try {
          const data = (
            chunks.trim() === '' ? {} : JSON.parse(chunks)
          ) as Record<Key, Value>

          resolve(data)
        } catch (error) {
          reject(error)
        }
      })

      request.on('error', (error) => {
        reject(error)
      })
    })
  }

  public setResponseCode(response: InstanceType<Response>, code: number): void {
    response.writeHead(code, { 'Content-Type': 'application/json' })
  }

  public setResponseBody<Body>(
    response: InstanceType<Response>,
    body: Body
  ): void {
    response.end(JSON.stringify(body))
  }
}
