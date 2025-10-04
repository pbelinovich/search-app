import { Express } from 'express'

export type ServerParams = {
  port: string
}

export type SetupAndRunServerParams = {
  serverParams: ServerParams
}

export type SetupHttpApiParams = {
  expressApp: Express
}

export interface IUser {
  id: number
  firstName: string
  lastName: string
  email: string
}

export interface ISearchRequest {
  query: string
  delay?: number
}

export interface ISearchResponse {
  data: IUser[]
  total: number
}
