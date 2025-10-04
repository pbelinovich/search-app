import { initMainThread } from './main-thread'
import { ServerParams } from './types'
import { logInfo } from './logger'

const port = process.env.PORT

const params: ServerParams = {
  port: port || '5010',
}

initMainThread(params)

process.addListener('SIGINT', () => {
  logInfo(`Получен сигнал SIGINT. Завершение работы...`)
  process.exit(0)
})

process.addListener('SIGTERM', () => {
  logInfo(`Получен сигнал SIGTERM. Завершение работы...`)
  process.exit(0)
})
