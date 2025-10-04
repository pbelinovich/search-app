export interface ICreateRequestExtraOptions {
  headers?: HeadersInit
}

export type RestHandlerSuccessResult<TResponse> = { kind: 'success'; response: TResponse }
export type RestHandlerErrorResult = { kind: 'error'; message: string }
export type RestHandlerAbortedResult = { kind: 'aborted' }
export type RestHandlerOutdatedResult = { kind: 'outdated' }

export type RestHandlerResult<TResponse> =
  | RestHandlerSuccessResult<TResponse>
  | RestHandlerErrorResult
  | RestHandlerAbortedResult
  | RestHandlerOutdatedResult
