const { randomBytes, box } = require('tweetnacl');
const {
  decodeBase64,
  encodeUTF8,
  decodeUTF8,
  encodeBase64,
} = require('tweetnacl-util');

function parseKey(key) {
  return JSON.parse(`[${key}]`);
}

function createKey(keyObj) {
  const key = box.before(Uint8Array.from(keyObj.p), Uint8Array.from(keyObj.s));
  return key;
}

function createMessageToSend(secretBox, nonce) {
  const messageToSend = new Uint8Array(nonce.length + secretBox.length);
  messageToSend.set(nonce);
  messageToSend.set(secretBox, nonce.length);

  return encodeBase64(messageToSend);
}

function encrypt(m, keyObj) {
  const key = createKey(keyObj);
  const nonce = randomBytes(24);
  const secretBox = box.after(decodeUTF8(m), nonce, key);

  return createMessageToSend(secretBox, nonce);
}

function decrypt(m, keyObj) {
  const key = createKey(keyObj);

  const messageWithNonceAsUint8Array = decodeBase64(m);

  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(box.nonceLength, m.length);

  const nonceUint8Array = new Uint8Array(nonce);
  const messageUnit8Array = new Uint8Array(message);

  const payload = box.open.after(messageUnit8Array, nonceUint8Array, key);

  // final message
  const payloadString = encodeUTF8(payload);
  const payloadStringJSON = JSON.parse(payloadString);
  return payloadStringJSON;
}

module.exports = {
  parseKey, createKey, encrypt, decrypt,
};
