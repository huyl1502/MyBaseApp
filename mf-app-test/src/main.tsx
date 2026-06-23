import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from 'antd'
import './index.css'
import AppRoot from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <AppRoot />
    </App>
  </StrictMode>,
)
