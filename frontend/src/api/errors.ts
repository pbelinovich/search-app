import { RestHandlerAbortedResult, RestHandlerErrorResult, RestHandlerOutdatedResult } from './types'

export const ABORT_ERROR_NAME = 'AbortError'
export const OUTDATED_ERROR_NAME = 'OutdatedError'

export class AbortError extends Error {
  name = ABORT_ERROR_NAME

  constructor() {
    super('Request was aborted')
  }
}

export class OutdatedError extends Error {
  name = OUTDATED_ERROR_NAME

  constructor() {
    super('Response is outdated')
  }
}

export const errorHandler = (error: unknown): RestHandlerErrorResult | RestHandlerAbortedResult | RestHandlerOutdatedResult => {
  if (!(error instanceof Error)) {
    return { kind: 'error', message: 'Unknown error' }
  }

  if (error.name === ABORT_ERROR_NAME) {
    return { kind: 'aborted' }
  }

  if (error.name === OUTDATED_ERROR_NAME) {
    return { kind: 'outdated' }
  }

  return { kind: 'error', message: error.message }
}
