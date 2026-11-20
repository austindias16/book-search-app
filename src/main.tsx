import 'antd/dist/reset.css'
import '@/styles/global.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ROOT_ELEMENT_ID } from '@/constants'
import { App } from '@/app'

createRoot(document.getElementById(ROOT_ELEMENT_ID)!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
