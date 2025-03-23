import { RespError } from "../types/error";
import { SaveUrlRequestParams } from "../types/request"
import { assert, HTTP_REGEX, code, genRandomKey, stringfyOptions } from "./utils";

let env: Env
let kv: KVNamespace
const use = (fenv: Env) => { if(!env) { env = fenv; kv = env.URLS } }

const getUrl = async (key: string)  => {
  const value = await env.URLS.get(key)
  if (!value)
    return { }
  const [_saveTime, expireTime, url, optionsJson] = value.split('|', 4)
  return { 
    url,
    expired: Number(expireTime) == -1 ? false : Date.now() > Number(expireTime),
    options: optionsJson ? JSON.parse(optionsJson) : null
  }
}

const saveUrl = async (role:string, params: SaveUrlRequestParams) : Promise<{ key: string; }>  => {

  const { url, key: customKey, expireDay = 1, options } = params
  const expireSeconds = expireDay * 24 * 60 * 60

  assert(url, code.SAVE_URL_REQUIRED)
  
  assert(HTTP_REGEX.test(url), code.SAVE_URL_NOT_VAILD)
  if (role != 'admin') {
    assert(env.HOST_WHITELIST.includes(new URL(url).host), code.SAVE_URL_NOT_IN_HOST_WHITELIST)
    assert(!customKey, code.SAVE_CUSTOM_KEY_NEED_ADMIN)
    assert(expireDay <= 1, code.SAVE_EXPIRE_DAY_NEED_ADMIN)
  }

  // generate key
  let key: string
  if (customKey) {
    const { url } = await getUrl(customKey)
    assert(!url, code.SAVE_KEY_EXSITS)
    key = customKey
  } else {
    let [ randomKey, len, times ] = [ '', env.KEY_MIN_LENGTH, 0 ]
    do {
      randomKey = genRandomKey(len)
      if (times++ > 3 && len++ > env.KEY_MIN_LENGTH + 3) {
        throw new RespError(code.SAVE_KEY_GEN_FAILED)
      }
    } while ((await getUrl(randomKey)).url)
    key = randomKey
  }

  //save
  const saveTime = Date.now() , expireTime = expireDay <= 0 ? -1 : saveTime + expireSeconds * 1000
  const value = [saveTime, expireTime, url.replace('|','%7C'), stringfyOptions(options)].join('|')

  await kv.put(key, value, env.KEY_REMOVE || expireDay > 0 ? { expirationTtl: expireSeconds } : undefined).catch(e=>new RespError(code.UNKNOWN,e.message))

  return { key }

}

export default { use, getUrl, saveUrl }