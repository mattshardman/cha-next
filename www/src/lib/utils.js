import { randomBytes, hash, box } from 'tweetnacl';
import {
  decodeBase64,
  encodeUTF8,
  decodeUTF8,
  encodeBase64,
} from 'tweetnacl-util';

export function createUint8Array(input) {
  return decodeBase64(input);
}

export function encrypt(receiverPublicKey, msgParams) {
  const msgParamsHashedPW = JSON.stringify({
    user: msgParams.user,
    hash: encodeBase64(hash(decodeUTF8(msgParams.password))),
  });
  const ephemeralKeyPair = box.keyPair();
  const pubKeyUInt8Array = decodeBase64(receiverPublicKey);
  const msgParamsUInt8Array = decodeUTF8(msgParamsHashedPW);
  const nonce = randomBytes(box.nonceLength);
  const encryptedMessage = box(
    msgParamsUInt8Array,
    nonce,
    pubKeyUInt8Array,
    ephemeralKeyPair.secretKey,
  );
  return {
    ciphertext: encodeBase64(encryptedMessage),
    ephemPubKey: encodeBase64(ephemeralKeyPair.publicKey),
    nonce: encodeBase64(nonce),
    version: 'x25519-xsalsa20-poly1305',
  };
}
/* Decrypt a message with a base64 encoded secretKey (privateKey) */
export function decrypt(receiverSecretKey, encryptedData) {
  const receiverSecretKeyUint8Array = decodeBase64(receiverSecretKey);
  const nonce = decodeBase64(encryptedData.nonce);
  const ciphertext = decodeBase64(encryptedData.ciphertext);
  const ephemPubKey = decodeBase64(encryptedData.ephemPubKey);

  const decryptedMessage = box.open(
    ciphertext,
    nonce,
    ephemPubKey,
    receiverSecretKeyUint8Array,
  );
  return encodeUTF8(decryptedMessage);
}
