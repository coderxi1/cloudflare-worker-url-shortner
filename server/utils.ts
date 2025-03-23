import { RespError, ErrorCode } from "../types/error"
import { SaveUrlRequestParams } from "../types/request"

export class Resp extends Response {
  static html(html: string, status: number = 200) {
    return new Response(html,{headers:{'Content-Type':'text/html'},status})
  }
  static blank(status: number = 200) {
    return new Response(null, {status})
  }
  static err(code: number, message?: string, status: number = 200) {
    return this.json({error:new RespError(code,message).toJsonObject()},{status})
  }
}

export const assert = (condition: any, code: number, message?: string) => { if (!condition) throw new RespError(code,message) }
export const code = ErrorCode

export const HTTP_REGEX = /^https?:\/\/(?:.*@)?[\w-]+(?:\.[\w-]+)*(?:[_\-.,~!*:#()\w\/?%&=]*)?$/

export const genRandomKey = (length: number) => {
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  return Array.from({ length }, () => $chars.charAt(Math.floor(Math.random() * $chars.length))).join('')
}

export const stringfyOptions = (options: SaveUrlRequestParams['options']) : string => {
  if (!options || !options.responseMode || options.responseMode == 'redirect')
    return ""
  if (options.responseMode == "manual")
    return JSON.stringify({responseMode:options.responseMode})
  if (options.responseMode == "proxy") {
    const o = options.proxyOptions
    if (!o.headers || Object.keys(o.headers).length == 0) {
      delete o.headers
    }
    if (!o.body) {
      delete o.body
    }
  }
  return JSON.stringify(options)
}


