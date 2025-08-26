export const API_HOST = import.meta.env.VITE_API_HOST as string
console.log('API_HOST', API_HOST)
export const API_PREFIX = `${API_HOST}${import.meta.env.VITE_API_PREFIX}` as const

export const GET = 'GET' as const
export const POST = 'POST' as const
export const PUT = 'PUT' as const
export const DELETE_ = 'DELETE' as const
export type HttpMethod = typeof GET | typeof POST | typeof PUT | typeof DELETE_

export type HttpHeaders = Record<string, string>
export type HttpParams =
  | Record<string, string | number | boolean | null | undefined>
  | URLSearchParams

export type HttpResponseType = 'json' | 'text' | 'blob' | 'arraybuffer'

export interface HttpRequestBase {
  method: HttpMethod
  headers?: HttpHeaders
  params?: HttpParams
  withCredentials?: boolean
  responseType?: HttpResponseType
}

export interface HttpRequestWithData<T = unknown> extends HttpRequestBase {
  data: T
}

/** GET */
export function getHttpGetOptions(
  headers: HttpHeaders | null = null,
  params: HttpParams | null = null,
  responseType: HttpResponseType | null = null,
): HttpRequestBase {
  return {
    method: GET,
    headers: headers ?? undefined,
    params: params ?? undefined,
    responseType: responseType ?? undefined,
    withCredentials: true,
  }
}

/** POST */
export function getHttpPostData<T = unknown>(
  data: T,
  headers: HttpHeaders | null = null,
  params: HttpParams | null = null,
): HttpRequestWithData<T> {
  return {
    method: POST,
    data,
    headers: headers ?? undefined,
    params: params ?? undefined,
    withCredentials: true,
  }
}

/** PUT */
export function getHttpPutData<T = unknown>(
  data: T,
  headers: HttpHeaders | null = null,
  params: HttpParams | null = null,
): HttpRequestWithData<T> {
  return {
    method: PUT,
    data,
    headers: headers ?? undefined,
    params: params ?? undefined,
    withCredentials: true,
  }
}

/** DELETE */
export function getHttpDeleteOptions(
  headers: HttpHeaders | null = null,
  params: HttpParams | null = null,
): HttpRequestBase {
  return {
    method: DELETE_,
    headers: headers ?? undefined,
    params: params ?? undefined,
    withCredentials: true,
  }
}

export function getAuthHeaders(accessToken: string | null | undefined): HttpHeaders {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
}

export function getContentTypeFormDataHeaders(): HttpHeaders {
  return { 'Content-Type': 'multipart/form-data' }
}

export function getCacheControlHeaders(): HttpHeaders {
  return { 'Cache-Control': 'no-cache' }
}

export const getCachControlHeaders = getCacheControlHeaders
