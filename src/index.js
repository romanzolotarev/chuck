import { render } from 'react-dom'
import React from 'react'
import { Login } from './Login'
import { App } from './App'
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
