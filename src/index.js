import { render } from 'react-dom'
import React, { useEffect, useReducer } from 'react'

const fetchApi = async (url, cb) => {
  const response = await fetch(url)
  const json = await response.json()
  if (json.value === undefined) return
  cb(json.value)
}

const FETCH = 'FETCH'
const UPDATE_JOKES = 'UPDATE_JOKES'

const reducer = (state, { type, payload }) => {
  switch (type) {
    case UPDATE_JOKES:
      return { ...state, jokes: payload, shouldFetch: false }
    case FETCH:
      return { ...state, shouldFetch: true }
    default:
      return state
  }
}

const App = ({ url }) => {
  const initialState = { jokes: [], shouldFetch: false }
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (state.shouldFetch)
      fetchApi(url, x => dispatch({ type: UPDATE_JOKES, payload: x }))
  }, [url, state.shouldFetch])

  return (
    <>
      <button
        disabled={state.shouldFetch}
        onClick={() => dispatch({ type: FETCH })}
      >
        fetch ten jokes
      </button>
      <div>
        {state.jokes.map(x => (
          <div key={x.id}>{x.joke}</div>
        ))}
      </div>
    </>
  )
}

render(
  <App url="https://api.icndb.com/jokes/random/10" />,
  document.getElementById('root')
)
