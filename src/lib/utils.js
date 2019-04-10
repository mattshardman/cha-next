import { randomBytes, box } from 'tweetnacl';
import {
  decodeBase64,
  encodeUTF8,
  decodeUTF8,
  encodeBase64,
} from 'tweetnacl-util';

import sha from 'sha256';

export function parseKey(key) {
  return JSON.parse(`[${key}]`);
}

export function getKeys() {
  const keysExist = localStorage.getItem('SECRET_KEY') && localStorage.getItem('PUBLIC_KEY');

  const storedKeyPair = {
    secretKey: Uint8Array.from(Object.values(JSON.parse(localStorage.getItem('SECRET_KEY')))),
    publicKey: Uint8Array.from(Object.values(JSON.parse(localStorage.getItem('PUBLIC_KEY')))),
  };

  const keyPair = keysExist ? storedKeyPair : box.keyPair();

  if (!keysExist) {
    localStorage.setItem('SECRET_KEY', JSON.stringify(keyPair.secretKey));
    localStorage.setItem('PUBLIC_KEY', JSON.stringify(keyPair.publicKey));
  }

  return keyPair;
}

export function encrypt(user, password, publicKey) {
  const keyPair = getKeys();

  const p = Uint8Array.from(JSON.parse(`[${publicKey}]`));

  const key = box.before(p, keyPair.secretKey);

  const userPublicKey = Array.from(keyPair.publicKey);

  const nonce = randomBytes(24);

  const secretBox = box
    .after(decodeUTF8(JSON.stringify({ user, password: sha.x2(password) }).toString()), nonce, key);

  const messageToSend = new Uint8Array(nonce.length + secretBox.length);
  messageToSend.set(nonce);
  messageToSend.set(secretBox, nonce.length);

  const base64FullMessage = encodeBase64(messageToSend);
  return JSON.stringify({
    p: userPublicKey,
    m: base64FullMessage,
  });
}

export function decrypt(m, publicKey) {
  const keyPair = getKeys();

  const p = Uint8Array.from(JSON.parse(`[${publicKey}]`));

  const key = box.before(p, keyPair.secretKey);

  const messageWithNonceAsUint8Array = decodeBase64(m);

  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength);
  const message = messageWithNonceAsUint8Array.slice(box.nonceLength, m.length);

  const nonceUint8Array = new Uint8Array(nonce);
  const messageUnit8Array = new Uint8Array(message);

  const payload = box.open.after(messageUnit8Array, nonceUint8Array, key);

  // final message
  const payloadString = encodeUTF8(payload);
  return payloadString;
}
