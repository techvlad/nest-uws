import { NestFactory } from '@nestjs/core'

import { UWebSocketsAdapter } from './uwebsocket-adapter/adapter'

import { AppModule } from './app.module'

async function bootstrap() {
  const uwsAdapter = new UWebSocketsAdapter()

  const proxy = new Proxy(uwsAdapter, {
    get(target: UWebSocketsAdapter, p: PropertyKey, receiver: any): any {
      console.log({ target, p, receiver })
      return target[p]
    },
  })

  const app = await NestFactory.create(AppModule, proxy)
  await app.listen(3000)
}
bootstrap()
