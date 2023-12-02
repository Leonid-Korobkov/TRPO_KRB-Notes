import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

import AuthProvider from './context/AuthProvider.jsx'

import { Provider } from 'react-redux'
import store from './store/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
)
