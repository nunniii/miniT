import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import './styles/_input.css'
import './styles/root.scss'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
