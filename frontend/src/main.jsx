import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import ALlContext from './Context/ALlContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import './i18n'
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
    <ALlContext>
    <App />
    </ALlContext>
    </BrowserRouter>
)
