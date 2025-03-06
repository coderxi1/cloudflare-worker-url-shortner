import { assert, genRandomKey } from './utils'

const HTTP_REGEX = /^https?:\/\/(?:.*@)?[\w-]+(?:\.[\w-]+)*(?:[_\-.,~!*:#()\w\/?%&=]*)?$/

export default class Service {
  private inited = false
  private env!: Env
  private kv!: KVNamespace
  use(env: Env) {
    if (this.inited) return
    this.env = env
    this.kv = env.URLS
  }
  async saveUrl(params: any): Promise<string> {
    let key: string
    const { PASSWORD, PASSWORD_REQUIRE, KEY_MIN_LENGTH, HOST_WHITELIST, KEY_REMOVE } = this.env
    const { url, password, key: customKey, expireDay = 1 } = params
    const expireSeconds = expireDay * 24 * 60 * 60
    if (password) {
      assert(password == PASSWORD, 'password is not correct')
    }
    // before check
    assert(!PASSWORD_REQUIRE || password, 'password is required')
    assert(url, 'url is required')
    assert(HTTP_REGEX.test(url),`url {${url}} is not valid`)
    if (password != PASSWORD) {
      assert(HOST_WHITELIST.includes(new URL(url).host), `url {${url}} is not in whitelist`)
      assert(!customKey, 'custom key can only be used after entering password')
      assert(expireDay <= 1, 'set expireDay greater than 1 can only be used after entering password')
    }
    // generate key
    if (customKey) {
      const { url } = await this.getUrl(customKey)
      assert(!url, `key {${customKey}} is already taken`)
      key = customKey
    } else {
      let [ randomKey, len, times ] = [ '', KEY_MIN_LENGTH, 0 ]
      do {
        randomKey = genRandomKey(len)
        assert(times++ > 3 && len++ > KEY_MIN_LENGTH + 3, 'too many random key generation attempts, please try again')
      } while ((await this.getUrl(randomKey)).url)
      key = randomKey
    }
    // save kv
    const saveTime = Date.now() , expireTime = expireDay <= 0 ? -1 : saveTime + expireSeconds * 1000
    const value = [saveTime, expireTime, url].join('|')
    try {
      await this.kv.put(key, value, KEY_REMOVE || expireDay > 0 ? { expirationTtl: expireSeconds } : undefined)
    } catch (e: any) {
      throw new Error(`save url failed: ${e.message}`)
    }
    return key
  }
  async getUrl(
    key: string
  ): Promise<{ url?: string; status?: 'normal' | 'expired' | 'none' }> {
    const value = await this.kv.get(key)
    if (!value) return { status: 'none' }
    const [saveTime, expireTime, url] = value.split('|', 3)
    const isExpired = Number(expireTime) == -1 ? false : Date.now() > Number(expireTime)
    return { url, status: isExpired ? 'expired' : 'normal' }
  }
}
