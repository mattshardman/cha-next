import { box } from 'tweetnacl';
import {
  encodeBase64,
} from 'tweetnacl-util';
import { encrypt, decrypt } from './utils';

describe('decrypt and encrypt functions', () => {
  const { publicKey, secretKey } = box.keyPair();
  const receiverPublicKey = encodeBase64(publicKey);
  const receiverSecretKey = encodeBase64(secretKey);
  console.log(receiverPublicKey, receiverSecretKey);


  const p = 'pT/mh0ur8JHuSXVd4OPvvlySn5MOu/nWh+i7OSuZ2HE=';
  const s = 'YRDHSzOytYLhpI4EXcH0JuryzhNjqZVFTEO0JY71Aks=';

  const encryptedMessage = encrypt(p, { user: 'Bill', password: 'xxx' });
  it('encrypts message', () => {
    expect(encryptedMessage.ciphertext.length).toBe(172);
  });

  it('decrypts message', () => {
    const mess = decrypt(s, encryptedMessage);
    const decryptedMessage = JSON.parse(mess);
    expect(decryptedMessage.user).toBe('Bill');
  });
});
