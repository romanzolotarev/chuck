import { render } from 'react-dom'
import React from 'react'
import { Login } from './Login.js'
import { App } from './App.js'
import './index.css'

render(
  <>
    <Login />
    <App
      url="https://api.icndb.com/jokes/random/"
      autoFetchInterval={5000}
      randomLimit={10}
      favoriteLimit={10}
    />
  </>,
  document.getElementById('root')
)
