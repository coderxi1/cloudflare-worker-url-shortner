import service from './service'
import jwt from "@tsndr/cloudflare-worker-jwt"
import { Resp, assert, code, tokenReader, searchParams } from "./utils"
import { LoginRequestParams, SaveUrlRequestParams } from "../types/request"

let env: Env

const use = (fenv: Env) => { if(!env) {env = fenv ; service.use(env) } }

const spa = (request: Request) => env.ASSETS.fetch(request)

const login = async ({password}: LoginRequestParams) => {
  if (password !== env.PASSWORD) 
    return Resp.err(code.PASSWORD_WRONG)
  const exp = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
  return Resp.json({token:await jwt.sign({role:"admin",exp}, env.PASSWORD_SECRET_KEY)})
}

const handle = async (path: string, request: Request, ctx: ExecutionContext): Promise<Response> => {
  const { method } = request

  if (["/","/login","/urls","/favicon.ico"].includes(path)) {
    return spa(request)
  }

  if (path == "/api/login") {
    return login(await request.json<LoginRequestParams>())
  }
  
  if (path == "/api/url") {
    const token = await tokenReader(request,env)
    assert(!env.PASSWORD_REQUIRE || token.valid, code.HTTP_UNAUTHORIZED)
    const {role} = token.payload
    if (method == "POST") {
      const params = await request.json<SaveUrlRequestParams>()
      const key = await service.saveUrl(role, params)
      return Resp.json({key})
    }
    if (method == 'DELETE') {
      const {key} = searchParams(request)
      await service.deleteUrl(role, key)
      return Resp.json({key})
    }
    return Resp.err(code.HTTP_METHOD_NOT_ALLOWED)
  }

  if (path == "/api/urls" && method == "GET") {
    const token = await tokenReader(request,env)
    assert(!env.PASSWORD_REQUIRE || token.valid, code.HTTP_UNAUTHORIZED)
    const {role} = token.payload
    const {pn = '1', ps = '10'} = searchParams(request)
    return Resp.json(await service.listUrls(role,parseInt(pn), parseInt(ps)))
  }

  if (method == "GET") {
    const key = path.slice(1)
    const {url, expired, options} = await service.getUrl(key)
    if (!url) {
      return spa(request)
    }
    if (expired) {
      return Resp.html("expired")
    }
    const { responseMode = "redirect", proxyOptions = {} } = (options || {}) as SaveUrlRequestParams["options"]
    switch (responseMode) {
      case "redirect": return Resp.redirect(url,302)
      case "manual": return Resp.redirect(`${new URL(request.url).origin}/jump?url=${url}`,302)
      case "proxy" : {
        const proxyResponse = await fetch(url, {
          method: proxyOptions?.method ?? 'GET',
          headers: proxyOptions?.headers ?? {},
          body: proxyOptions?.body
        })
        return !proxyOptions?.allowOrigin
          ? proxyResponse
          : new Response(await proxyResponse.text(), {
              status: proxyResponse.status,
              statusText: proxyResponse.statusText,
              headers: {
                ...Object.fromEntries(proxyResponse.headers.entries()),
                'Access-Control-Allow-Origin': '*'
              }
            })
      }
    }
  }
  return Resp.blank()
}

export default { use, spa, handle }