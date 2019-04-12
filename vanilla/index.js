import { App } from './App.js'

App({
  url: 'https://api.icndb.com/jokes/random/',
  autoFetchInterval: 5000,
  randomLimit: 10,
  favoriteLimit: 10
})
