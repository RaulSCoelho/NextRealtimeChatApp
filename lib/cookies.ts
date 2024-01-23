import { LiteralUnion } from 'react-hook-form'

import { CookieAttr } from 'cookies'
import { parseCookies, setCookie, destroyCookie } from 'nookies'

export type Cookie = LiteralUnion<'user', string>
export type ParseCookiesContext = Parameters<typeof parseCookies>[0]
export type SetCookieContext = Parameters<typeof setCookie>[0]
export type DestroyCookieContext = Parameters<typeof destroyCookie>[0]

const defaultOptions: CookieAttr = {
  path: '/',
  secure: true,
  sameSite: 'strict'
}

export const cookies = (ctx?: ParseCookiesContext) => parseCookies(ctx) as { [key in Cookie]: string }

function set(name: Cookie, value: any, options: CookieAttr = {}, ctx?: SetCookieContext) {
  if (!options.expires) {
    defaultOptions.maxAge = 60 * 60 * 24 * 30 // Default to 30 days
  }

  return setCookie(ctx, name, typeof value === 'string' ? value : JSON.stringify(value), {
    ...defaultOptions,
    ...options
  })
}

function get(name: Cookie, ctx?: ParseCookiesContext) {
  const value = cookies(ctx)[name]

  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function destroy(name: Cookie, ctx?: DestroyCookieContext) {
  return destroyCookie(ctx, name)
}

cookies.set = set
cookies.get = get
cookies.delete = destroy
