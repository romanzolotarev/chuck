import { render } from 'react-dom'
import React, {
  useEffect,
  useReducer,
  useRef,
  createContext,
  useContext,
  useMemo
} from 'react'
import {
  reducer,
  FETCH,
  UPDATE_JOKES,
  LIKE,
  UNLIKE,
  START_AUTO_FETCH,
  STOP_AUTO_FETCH,
  initialState
} from './reducer'

const fetchApi = async (url, cb) => {
  const response = await fetch(url)
  const json = await response.json()
  if (json.value === undefined) return
  cb(json.value)
}

const StateDispatch = createContext([])

const App = ({ url, autoFetchInterval, randomLimit, favoriteLimit }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  //
  //
  // Fetch jokes
  //
  useEffect(() => {
    if (state.shouldFetch)
      fetchApi(url + randomLimit, x => dispatch([UPDATE_JOKES, x]))
  }, [url, state.shouldFetch, randomLimit])

  //
  //
  // Set and stop timer to fetch and like jokes automatically
  //
  const autoFetchTimer = useRef(null)
  useEffect(() => {
    //
    // Stop the timer if it's ticking, but shouldn't.
    //
    if (autoFetchTimer.current !== null && !state.shouldAutoFetch) {
      clearInterval(autoFetchTimer.current)
    }

    //
    // Fetch on joke right away and start a timer to fetch them
    // one by one every five seconds
    //
    if (state.shouldAutoFetch) {
      const fetchOneJoke = ([joke]) =>
        dispatch([LIKE, { joke, limit: favoriteLimit }])
      fetchApi(url + '1', fetchOneJoke)
      autoFetchTimer.current = setInterval(() => {
        fetchApi(url + '1', fetchOneJoke)
      }, autoFetchInterval)
    }
    return () => {
      clearInterval(autoFetchTimer.current)
    }
  }, [url, state.shouldAutoFetch, fetchApi])
  //
  // Stop fetching when there are more than nine jokes.
  //
  useEffect(() => {
    if (state.favorites.length >= favoriteLimit) dispatch([STOP_AUTO_FETCH])
  }, [state.favorites])

  const value = useMemo(
    () => ({
      state,
      dispatch,
      randomLimit,
      favoriteLimit,
      autoFetchInterval
    }),
    [state, dispatch, randomLimit, favoriteLimit, autoFetchInterval]
  )
  return (
    <>
      <StateDispatch.Provider value={value}>
        <RandomJokes />
        <FavoriteJokes />
      </StateDispatch.Provider>
    </>
  )
}

const RandomJokes = () => {
  const { state, dispatch, randomLimit, favoriteLimit } = useContext(
    StateDispatch
  )
  return (
    <>
      <h2>random jokes</h2>
      <button disabled={state.shouldFetch} onClick={() => dispatch([FETCH])}>
        fetch {randomLimit} jokes
      </button>
      <div>
        {state.jokes.map(x => {
          const action = x.favorite
            ? [UNLIKE, x]
            : [LIKE, { joke: x, limit: favoriteLimit }]
          return (
            <div onClick={() => dispatch(action)} key={x.id}>
              {x.joke}
            </div>
          )
        })}
      </div>
    </>
  )
}

const FavoriteJokes = () => {
  const { state, dispatch, favoriteLimit, autoFetchInterval } = useContext(
    StateDispatch
  )
  return (
    <>
      <h2>top {favoriteLimit} of favorites</h2>
      <button
        disabled={state.shouldAutoFetch}
        onClick={() => dispatch([START_AUTO_FETCH])}
      >
        fetch one every {Math.floor(autoFetchInterval / 1000)} seconds
      </button>
      <button
        disabled={!state.shouldAutoFetch}
        onClick={() => dispatch([STOP_AUTO_FETCH])}
      >
        stop
      </button>
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
  <App
    url="https://api.icndb.com/jokes/random/"
    autoFetchInterval={5000}
    randomLimit={10}
    favoriteLimit={10}
  />,
  document.getElementById('root')
)
