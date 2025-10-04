import { Request, Response } from 'express'
import { logError } from './logger'
import { SetupHttpApiParams, ISearchRequest, ISearchResponse, IUser } from './types'
import mockData from './mock.json'

interface RequestWithSignal extends Request {
  signal?: AbortSignal
}

const searchUsers = (query: string): IUser[] => {
  const lowerQuery = query.toLowerCase()

  return mockData.filter(
    user =>
      user.firstName.toLowerCase().includes(lowerQuery) ||
      user.lastName.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery)
  )
}

const delayWithAbort = (ms: number, signal?: AbortSignal): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error('Request aborted'))
      return
    }

    const abortHandler = () => {
      clearTimeout(timeout)
      reject(new Error('Request aborted'))
    }

    const timeout = setTimeout(() => {
      signal?.removeEventListener('abort', abortHandler)
      resolve()
    }, ms)

    signal?.addEventListener('abort', abortHandler, { once: true })
  })
}

export const setupHTTPApi = ({ expressApp }: SetupHttpApiParams) => {
  expressApp.post('/search', async (req: RequestWithSignal, res: Response) => {
    let aborted = false

    const abortHandler = () => {
      aborted = true

      if (!res.headersSent) {
        res.status(499).json({
          error: 'Request cancelled by client',
        })
      }
    }

    // если у нас есть сигнал
    if (req.signal) {
      req.signal.addEventListener('abort', abortHandler, { once: true })

      // если уже отменен, обрабатываем сразу
      if (req.signal.aborted) {
        abortHandler()
        return
      }
    }

    try {
      const { query, delay }: ISearchRequest = req.body

      if (!query || typeof query !== 'string' || query.trim() === '') {
        return res.status(400).json({
          error: 'Query parameter is required and must be a non-empty string',
        })
      }

      const delayMs = typeof delay === 'number' && delay > 0 ? delay : 0

      // если у нас есть задержка, применяем ее
      if (delayMs > 0) {
        try {
          await delayWithAbort(delayMs, req.signal)
        } catch (delayError) {
          // если задержка была отменена, ждем ответа от abortHandler
          if (!res.headersSent) {
            abortHandler()
          }

          return
        }
      }

      // если запрос был отменен во время обработки
      if (aborted || req.signal?.aborted) {
        return
      }

      const data = searchUsers(query.trim())
      const response: ISearchResponse = {
        data: data,
        total: data.length,
      }

      // финальная проверка перед отправкой ответа
      if (aborted || req.signal?.aborted) {
        return
      }

      res.json(response)
    } catch (error) {
      if (aborted) {
        return // уже обработано abortHandler
      }

      logError(`Search API error: ${error}`)
      res.status(500).json({ error: 'Internal server error' })
    } finally {
      //  удаляем слушатель отмены если он не был вызван
      if (req.signal && !aborted) {
        req.signal.removeEventListener('abort', abortHandler)
      }
    }
  })
}
