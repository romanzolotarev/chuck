import { render } from 'react-dom'
import React, { useEffect, useReducer } from 'react'
import {
  reducer,
  FETCH,
  UPDATE_JOKES,
  LIKE,
  UNLIKE,
  initialState
} from './reducer'

const fetchApi = async (url, cb) => {
  const response = await fetch(url)
  const json = await response.json()
  if (json.value === undefined) return
  cb(json.value)
}

const App = ({ url }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (state.shouldFetch) fetchApi(url, x => dispatch([UPDATE_JOKES, x]))
  }, [url, state.shouldFetch])

  return (
    <>
      <h2>random jokes</h2>
      <button disabled={state.shouldFetch} onClick={() => dispatch([FETCH])}>
        fetch ten jokes
      </button>
      <div>
        {state.jokes.map(x => {
          const type = x.favorite ? UNLIKE : LIKE
          return (
            <div onClick={() => dispatch([type, x])} key={x.id}>
              {x.joke}
            </div>
          )
        })}
      </div>
      <h2>top ten of favorites</h2>
      <div>
        {state.favorites.map(x => (
          <div onClick={() => dispatch([UNLIKE, x])} key={x.id}>
            {x.joke}
          </div>
        ))}
      </div>
    </>
  )
}

render(
  <App url="https://api.icndb.com/jokes/random/10" />,
  document.getElementById('root')
)
