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
      <h1>{message}</h1>
      <Terminal />
    </div>
  );
}

export default App;
