import { ISearchRequest, ISearchResponse } from '@backend/types'
import { AbortError, OutdatedError, errorHandler } from './errors'
import { ICreateRequestExtraOptions, RestHandlerResult } from './types'

export * from './types'

const createRestHandler = <TParams, TResponse>(url: string, { headers = {} }: ICreateRequestExtraOptions = {}) => {
  let lastRequest: { revision: number; cancel: () => void } | null = null
  let lastRevision = 0

  return {
    execute: async (params: TParams): Promise<RestHandlerResult<TResponse>> => {
      const abortController = new AbortController()
      const revision = ++lastRevision

      lastRequest?.cancel()
      lastRequest = { revision, cancel: () => abortController.abort() }

      let result: RestHandlerResult<TResponse>

      const abortHandler = () => {
        if (!abortController.signal.aborted) {
          throw new AbortError()
        }
      }

      try {
        abortController.signal.addEventListener('abort', abortHandler)

        const response = await fetch(url, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
          signal: abortController.signal,
        })

        if (lastRequest?.revision !== revision) {
          throw new OutdatedError()
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        result = { kind: 'success', response: await response.json() }
      } catch (error) {
        result = errorHandler(error)
      }

      abortController.signal.removeEventListener('abort', abortHandler)

      if (lastRequest?.revision === revision) {
        lastRequest = null
      }

      return result
    },
    cancel: () => {
      lastRequest?.cancel()
      lastRequest = null
    },
  }
}

export const api = {
  search: createRestHandler<ISearchRequest, ISearchResponse>('/search'),
}
