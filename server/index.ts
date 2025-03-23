import controller from './controller'
import { Resp, code } from './utils'

export default {
	async fetch(request, env, ctx): Promise<Response> {
		controller.use(env)
		try {
			return await controller.handle(new URL(request.url).pathname, request, ctx)
		} catch (e : any) {
			return Resp.err(e.code || code.UNKNOWN,e.message)
		}
	},
} satisfies ExportedHandler<Env>;