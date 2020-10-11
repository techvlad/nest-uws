import { NestApplicationOptions, RequestMethod } from '@nestjs/common'
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { AbstractHttpAdapter } from '@nestjs/core'
import {
  TemplatedApp,
  HttpRequest,
  HttpResponse,
  us_listen_socket_close,
  AppOptions,
  App,
  SSLApp,
} from 'uWebSockets.js'
import { RequestHandler } from '@nestjs/common/interfaces'

export class UWebSocketsAdapter extends AbstractHttpAdapter<
  TemplatedApp,
  HttpRequest,
  HttpResponse
> {
  constructor(options?: AppOptions) {
    super(!!options ? SSLApp(options) : App())
  }

  close(): any {
    return us_listen_socket_close(this.getInstance<TemplatedApp>())
  }

  createMiddlewareFactory(
    requestMethod: RequestMethod,
  ):
    | ((path: string, callback: Function) => any)
    | Promise<(path: string, callback: Function) => any> {
    return undefined
  }

  // enableCors(options: CorsOptions, prefix: string | undefined): any {}

  getRequestHostname(request: HttpRequest): any {}

  getRequestMethod(request: HttpRequest): any {
    return request.getMethod()
  }

  getRequestUrl(request: HttpRequest): any {}

  getType(): string {
    return 'uwebsockets'
  }

  initHttpServer(options: NestApplicationOptions): any {
    return this.getInstance<TemplatedApp>()
  }

  get(handler: RequestHandler): any
  get(path: any, handler: RequestHandler): any
  get(...args) {
    const instance = this.getInstance<TemplatedApp>()
    const handler = args[args.length - 1] as RequestHandler

    if (args.length === 2) {
      const path = args[0] as string
      instance.get(path, (res, req) => handler(req, res))
    }
  }

  listen(port: string | number, callback?: () => void): any
  listen(port: string | number, hostname: string, callback?: () => void): any
  listen(...args) {
    const instance = this.getInstance<TemplatedApp>()
    const port = parseInt(args[0], 10)

    if (args.length === 1) {
      return instance.listen(port, () => void 0)
    } else if (args.length === 2) {
      if (typeof args[1] === 'string') {
        return instance.listen(args[1] as string, port, () => void 0)
      }
      return instance.listen(port, args[1] as () => void)
    } else if (args.length === 3) {
      return this.instance.listen(
        args[1] as string,
        port,
        args[2] as () => void,
      )
    } else {
      throw Error('WTF ?')
    }
  }

  redirect(response: HttpResponse, statusCode: number, url: string): any {}

  render(response: HttpResponse, view: string, options: any): any {}

  reply(
    response: HttpResponse,
    body: any,
    statusCode: number | undefined,
  ): any {
    const responseCode = statusCode ?? response.statusCode

    if (responseCode) {
      response.writeStatus(responseCode.toString())
    }

    if (body) {
      if (typeof body === 'object') {
        response
          .writeHeader('Content-Type', 'application/json; charset=utf-8')
          .write(JSON.stringify(body))
      } else {
        response
          .writeHeader('Content-Type', 'text/html; charset=utf-8')
          .write(body)
      }
    }

    response.end()
  }

  setErrorHandler(handler: Function, prefix: string | undefined): any {}

  setHeader(response: HttpResponse, key: string, value: string): any {
    response.writeHeader(key, value)
  }

  setNotFoundHandler(handler: Function, prefix: string | undefined): any {}

  setViewEngine(engine: string): any {}

  status(response: HttpResponse, statusCode: number): any {
    response.statusCode = statusCode
  }

  useStaticAssets(args: any): any {}

  enableCors(options: CorsOptions): any {}

  registerParserMiddleware(): any {}
}
