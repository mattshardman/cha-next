import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { encrypt, decrypt } from '../lib/utils';

import { clientPublic, clientSecret } from '../lib/test-data';

const p = 'pT/mh0ur8JHuSXVd4OPvvlySn5MOu/nWh+i7OSuZ2HE=';
const s = 'YRDHSzOytYLhpI4EXcH0JuryzhNjqZVFTEO0JY71Aks=';

function Login() {
  const [serverPublic, setServerPublic] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handleForm = async (e) => {
    e.preventDefault();

    if (serverPublic) {
      const message = encrypt(p, { user, password });

      try {
        const result = await axios.post(
          'http://localhost:8000/api/sign-up',
          message,
        );
        console.log(result);
        // console.log(result);
        // const resultString = decrypt(result.data, {
        //   publicKey,
        //   secretKey: secretTestKey,
        // });
        // console.log(resultString);
        // return resultString;
      } catch (err) {
        return err;
      }
    }
    return null;
  };

  const getPublicKey = async () => {
    try {
      const result = await axios.get('http://localhost:8000/api/public-key');
      const publicKeyString = result.data;
      console.log(publicKeyString);
      return setServerPublic(publicKeyString);
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  useEffect(() => {
    getPublicKey();
  }, []);

  return (
    <form onSubmit={handleForm}>
      <input
        type="text"
        value={user}
        placeholder="User"
        onChange={e => setUser(e.target.value)}
      />
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default Login;
