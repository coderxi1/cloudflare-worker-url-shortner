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
      assert(password == PASSWORD, '密码错误')
    }
    // before check
    assert(!PASSWORD_REQUIRE || password, '密码不能为空')
    assert(url, 'url 不能为空')
    assert(HTTP_REGEX.test(url),`url {${url}} 格式不正确`)
    if (password != PASSWORD) {
      assert(HOST_WHITELIST.includes(new URL(url).host), `url {${url}} 不在白名单中`)
      assert(!customKey, '自定义key仅在输入密码后可以使用')
      assert(expireDay <= 1, '设置超过1天的过期时间仅在输入密码后可以使用')
    }
    // generate key
    if (customKey) {
      const { url } = await this.getUrl(customKey)
      assert(!url, `key {${customKey}} 已经被占用`)
      key = customKey
    } else {
      let [ randomKey, len, times ] = [ '', KEY_MIN_LENGTH, 0 ]
      do {
        randomKey = genRandomKey(len)
        assert(times++ < 3 || len++ > KEY_MIN_LENGTH + 3, '生成随机Key尝试次数过多，请重试')
      } while ((await this.getUrl(randomKey)).url)
      key = randomKey
    }
    // save kv
    const saveTime = Date.now() , expireTime = expireDay <= 0 ? -1 : saveTime + expireSeconds * 1000
    const value = [saveTime, expireTime, url].join('|')
    try {
      await this.kv.put(key, value, KEY_REMOVE || expireDay > 0 ? { expirationTtl: expireSeconds } : undefined)
    } catch (e: any) {
      throw new Error(`保存url时出错: ${e.message}`)
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
