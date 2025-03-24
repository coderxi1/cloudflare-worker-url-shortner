export interface ListUrlResponse {
  url: string
  key: string
  saveTime: string,
  expireTime: string,
  options: {
    responseMode?: 'redirect' | 'manual' | 'proxy',
    proxyOptions: {
      method?: string,
      headers?: Record<string, string>,
      body?: string,
      allowOrigin?: boolean
    }
  }
}