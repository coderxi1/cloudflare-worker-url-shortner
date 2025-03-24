import service from './service'
import jwt from "@tsndr/cloudflare-worker-jwt"
import { Resp, assert, code } from "./utils"
import { LoginRequestParams, SaveUrlRequestParams } from "../types/request"

let env: Env

const use = (fenv: Env) => { if(!env) {env = fenv ; service.use(env) } }

const spa = (request: Request) => env.ASSETS.fetch(request)

const jwtCheck = async (request: Request) => {
  const token = request.headers.get("Authorization")
  if (!token || !(await jwt.verify(token!, env.PASSWORD_SECRET_KEY).catch(_=>false))) {
    return false
  }
  return jwt.decode(token)
}

const login = async ({password}: LoginRequestParams) => {
  if (password !== env.PASSWORD) 
    return Resp.err(code.PASSWORD_WRONG)
  const exp = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
  const token = await jwt.sign({role:"admin",exp}, env.PASSWORD_SECRET_KEY);
  return Resp.json({token})
}

const handle = async (path: string, request: Request, ctx: ExecutionContext): Promise<Response> => {
  const { method } = request

  if (["/","/login","/favicon.ico"].includes(path)) {
    return spa(request)
  }

  if (path == "/api/login") {
    return login(await request.json<LoginRequestParams>())
  }
  
  if (path == "/api/url") {
    const jwtCheckResult = await jwtCheck(request)
    env.PASSWORD_REQUIRE && assert(jwtCheckResult, 401, "Unauthorized")
    const role = !jwtCheckResult ? 'user' : ((jwtCheckResult.payload as any).role || 'user')
    const params = await request.json<SaveUrlRequestParams>()
    return Resp.json({key:(await service.saveUrl(role, params)).key})
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