import compression from 'compression'
import cors from 'cors'
import express from 'express'
import http from 'node:http'
import { setupHTTPApi } from './setup-http-api'
import { logError, logInfo } from './logger'
import { morganMiddleware } from './middlewares'
import { ServerParams } from './types'

export const initMainThread = (serverParams: ServerParams) => {
  const serverApp = express()

  serverApp.use(compression())
  serverApp.use(express.json())
  serverApp.use(cors())
  serverApp.use(morganMiddleware)

  // initialize a simple http server
  const server = http.createServer(serverApp)

  setupHTTPApi({ expressApp: serverApp })

  // start our server
  const port = serverParams.port

  server
    .listen(port, () => {
      logInfo(`Input Test Task server started on port ${port}`)
    })
    .once('error', (err: any) => {
      logError(err.code === 'EADDRINUSE' ? `Port ${port} is already used! Please specify another port or release port ${port}!` : err)
    })
}
