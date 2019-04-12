import { Login } from './Login.js'
import { App } from './App.js'

Login({})

App({
  url: 'https://api.icndb.com/jokes/random/',
  autoFetchInterval: 5000,
  randomLimit: 10,
  favoriteLimit: 10
})
