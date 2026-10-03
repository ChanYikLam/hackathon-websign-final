/**
 * Token 混淆存储工具
 *
 * 注意：这不是真正的加密，而是 XOR + Base64 的混淆。
 * 对于客户端存储的 token，真正的安全保障是 httpOnly cookie，
 * 这里仅增加直接读取 localStorage 的难度。
 */

const STORAGE_PREFIX = 'sp_enc:'
const XOR_KEY = 'SoloPilot_2024_Secure'

function xorCipher(input: string, key: string): string {
  let output = ''
  for (let i = 0; i < input.length; i++) {
    output += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return output
}

/**
 * 将 token 加密为可存储的字符串
 */
export function encryptToken(token: string): string {
  try {
    const ciphered = xorCipher(token, XOR_KEY)
    const encoded = btoa(unescape(encodeURIComponent(ciphered)))
    return STORAGE_PREFIX + encoded
  } catch {
    return token
  }
}

/**
 * 解密 token
 */
export function decryptToken(stored: string): string {
  try {
    if (!stored.startsWith(STORAGE_PREFIX)) {
      // 兼容旧版明文 token
      return stored
    }
    const encoded = stored.slice(STORAGE_PREFIX.length)
    const ciphered = decodeURIComponent(escape(atob(encoded)))
    return xorCipher(ciphered, XOR_KEY)
  } catch {
    return ''
  }
}
