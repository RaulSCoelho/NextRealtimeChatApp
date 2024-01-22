import { z } from 'zod'

const server = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  VERCEL_URL: z.string().optional(),
  PUSHER_APP_ID: z.string(),
  PUSHER_SECRET: z.string()
})

const client = z.object({
  NEXT_PUBLIC_PORT: z
    .string()
    .transform(port => Number(port))
    .default('3000'),
  NEXT_PUBLIC_PUSHER_KEY: z.string(),
  NEXT_PUBLIC_PUSHER_CLUSTER: z.string()
})

const processEnv = {
  VERCEL_URL: process.env.VERCEL_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_PORT: process.env.NEXT_PUBLIC_PORT,
  PUSHER_APP_ID: process.env.PUSHER_APP_ID,
  NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
  PUSHER_SECRET: process.env.PUSHER_SECRET,
  NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
}

type ServerEnvs = z.infer<typeof server>
type ClientEnvs = z.infer<typeof client>

const merged = server.merge(client)
/** @type z.infer<merged>
 *  @ts-ignore - can't type this properly in jsdoc */
// eslint-disable-next-line no-unused-vars
let env: ServerEnvs & ClientEnvs = process.env

if (!!process.env.SKIP_ENV_VALIDATION === false) {
  const isServer = typeof window === 'undefined'

  const parsed = isServer
    ? merged.safeParse(processEnv) // on server we can validate all env vars
    : client.safeParse(processEnv) // on client we can only validate the ones that are exposed

  if (parsed.success === false) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors)
    throw new Error('Invalid environment variables')
  }

  /** @type z.infer<merged>
   *  @ts-ignore - can't type this properly in jsdoc */
  env = new Proxy(parsed.data, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith('NEXT_PUBLIC_'))
        throw new Error(
          process.env.NODE_ENV === 'production'
            ? '❌ Attempted to access a server-side environment variable on the client'
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`
        )
      /*  @ts-ignore - can't type this properly in jsdoc */
      return target[prop]
    }
  })
}

export { env }
