import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { encrypt, decrypt } from '../lib/utils';

function Login() {
  const [publicKey, setPublicKey] = useState(false);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handleForm = async (e) => {
    e.preventDefault();

    if (publicKey) {
      const message = encrypt(user, password, publicKey);

      try {
        const result = await axios.post('http://localhost:8000/api/sign-up', message);
        const resultString = decrypt(result.data, publicKey);
        console.log(resultString);
        return resultString;
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
      return setPublicKey(publicKeyString);
    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    getPublicKey();
  }, []);

  return (
    <form onSubmit={handleForm}>
      <input type="text" value={user} placeholder="User" onChange={e => setUser(e.target.value)} />
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
