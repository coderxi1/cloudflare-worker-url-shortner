
export const responseRedirect = (url: string) => Response.redirect(url, 302)
export const responseBlank = () => new Response(null, { status: 200 })
export const responseJson = (obj: any) => new Response(JSON.stringify(obj), {headers: { 'Content-Type': 'application/json' }})
export const responseHtml = (html: string) => new Response(html, { headers: { 'Content-Type': 'text/html' } })
export const assert = (condition: any, message: string) => { if (!condition) throw new Error(message) }

export const genRandomKey = (length: number) => {
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  return Array.from({ length }, () => $chars.charAt(Math.floor(Math.random() * $chars.length))).join('')
}