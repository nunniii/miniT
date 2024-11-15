import { useEffect, useState } from 'react';
import { fetchMessage } from './wasmHelper';
import Terminal from './Terminal';
import './styles/Terminal.scss'; 

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMessage().then(setMessage);
  }, []);

  return (
    <div className="App">
      <h1 className="text-zinc-100 pl-2 bg-zinc-950">{message}</h1>
      <Terminal />
    </div>
  );
}

export default App;
