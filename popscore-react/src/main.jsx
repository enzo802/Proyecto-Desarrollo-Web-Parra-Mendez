import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

// el orden importa: resenas.css pisa algunas reglas de home.css (solo en /resenas)
import './styles/home.css'
import './styles/login.css'
import './styles/config.css'
import './styles/resenas.css'
import './styles/foros.css'
import './styles/trivia.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
