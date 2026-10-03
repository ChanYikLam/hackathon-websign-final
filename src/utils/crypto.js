const CryptoJS = require("crypto-js");
const config = require("../config");

function encrypt(text) {
  return CryptoJS.AES.encrypt(text, config.encryption.key).toString();
}

function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, config.encryption.key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * 加密文本并包装为 JSON 标记格式，避免仅靠前缀判断是否已加密
 * 返回格式: {"_enc":"<ciphertext>"}
 */
function encryptIfPlain(text) {
  if (!text) return null;
  // 如果已经是标记格式，直接返回
  try {
    const parsed = JSON.parse(text);
    if (parsed && parsed._enc) return text;
  } catch {
    // 不是 JSON，说明是明文
  }
  const ciphertext = encrypt(text);
  return JSON.stringify({ _enc: ciphertext });
}

/**
 * 解密标记格式的加密文本
 * 如果是 {"_enc":"..."} 格式则解密，否则原样返回
 */
function decryptIfEncrypted(text) {
  if (!text) return null;
  try {
    const parsed = JSON.parse(text);
    if (parsed && parsed._enc) {
      try {
        return decrypt(parsed._enc);
      } catch {
        return text;
      }
    }
  } catch {
    // 不是 JSON，说明是明文
  }
  return text;
}

module.exports = {
  encrypt,
  decrypt,
  encryptIfPlain,
  decryptIfEncrypted,
};
