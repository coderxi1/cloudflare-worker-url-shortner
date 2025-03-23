export interface SaveUrlRequestParams {
  url: string
  key?: string
  expireDay?: number,
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

export interface LoginRequestParams {
  password:string
}