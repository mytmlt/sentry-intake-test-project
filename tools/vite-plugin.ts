import { configSecrets } from './config.ts'
import { assembleDeps } from './deps.ts'
import { handleIntakeHttp } from './http-api.ts'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('utf8')
}

function pathnameOf(url: string | undefined): string {
  if (!url) {
    return ''
  }
  const q = url.indexOf('?')
  return q === -1 ? url : url.slice(0, q)
}

export function intakeLabPlugin(
  env: Record<string, string | undefined>,
): Plugin {
  return {
    name: 'intake-lab',
    configureServer(server) {
      server.middlewares.use(createIntakeMiddleware(env))
    },
    configurePreviewServer(server) {
      server.middlewares.use(createIntakeMiddleware(env))
    },
  }
}

export function createIntakeMiddleware(
  env: Record<string, string | undefined>,
) {
  return async (
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void,
  ) => {
    const path = pathnameOf(req.url)
    if (!path.startsWith('/api/intake')) {
      next()
      return
    }

    const method = req.method ?? 'GET'
    const rawBody = method === 'POST' ? await readBody(req) : ''
    const { config, deps } = assembleDeps(env)
    const result = await handleIntakeHttp(
      method,
      path,
      rawBody,
      deps,
      configSecrets(config),
    )

    res.statusCode = result.status
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(result.body, null, 2))
  }
}
