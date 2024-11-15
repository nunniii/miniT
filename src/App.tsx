// src/App.tsx
import { useEffect, useState } from 'react';
import { fetchMessage } from './wasmHelper';

function App() {


  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMessage().then(setMessage);
  }, []);

  return <div>{message}</div>;
}

export default App;
