import React, { useEffect } from 'react';
import axios from 'axios';

function Message() {
  useEffect(() => {
    axios.get('http://localhost:8000/api/message').then(r => console.log(r.data));
  }, []);
  return (
    <div>
        mess
    </div>
  );
}

export default Message;
