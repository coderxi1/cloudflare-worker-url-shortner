import html_index from './html/index.html'
import html_expired from './html/expired.html'
import html_404 from './html/404.html'
import Service from './service'
import { responseJson, responseHtml, responseBlank, responseRedirect } from './utils'

const service = new Service()

export default {
  async fetch(request, env, ctx): Promise<Response> {
    service.use(env)
    const method = request.method
    const path = new URL(request.url).pathname
    if (method == 'GET' && path == '/') {
      return responseHtml(html_index)
    }
    if (method == 'POST' && path == '/') {
      const params = await request.json()
      try {
        return responseJson({ key: await service.saveUrl(params) })
      } catch (e: any) {
        return responseJson({ error: e.message })
      }
    }
    if (method == 'GET' && path.length > 1) {
      const key = path.slice(1)
      const {url, status} = await service.getUrl(key)
      switch (status) {
        case 'normal': return responseRedirect(url!)
        case 'expired': return responseHtml(html_expired)
        case 'none': return responseHtml(html_404)
      }
    }
    return responseBlank()
  },
} satisfies ExportedHandler<Env>