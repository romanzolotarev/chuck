import React, {
  useEffect,
  useReducer,
  useRef,
  createContext,
  useContext
} from 'react'

import {
  reducer,
  FETCH,
  UPDATE_JOKES,
  UPDATE_FAVORITES,
  LIKE,
  UNLIKE,
  START_AUTO_FETCH,
  STOP_AUTO_FETCH,
  initialState
} from './reducer'
import './index.css'

const fetchApi = async (url, cb) => {
  const response = await fetch(url)
  const json = await response.json()
  if (json.value === undefined) return
  cb(json.value)
}

const StateDispatch = createContext([])

export const App = ({ url, autoFetchInterval, randomLimit, favoriteLimit }) => {
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

  //
  //
  // Store favorites and jokes in localStorage
  //
  const storage = useRef(null)
  useEffect(() => {
    //
    // Set an item into localStorage
    const setItem = (key, json) => {
      const value = JSON.stringify(json)
      value && storage.current.setItem(key, value)
    }
    //
    // Get an item from localStorage
    const getItem = (key, type) => {
      const payload = JSON.parse(storage.current.getItem(key))
      payload && dispatch([type, payload])
    }

    if (storage.current === null) {
      storage.current = window.localStorage
      getItem('favorites', UPDATE_FAVORITES)
      getItem('jokes', UPDATE_JOKES)
    }
    setItem('favorites', state.favorites)
    setItem('jokes', state.jokes)
  }, [state.favorites, state.jokes])

  return (
    <div className="center mw6 w-100 cf">
      <StateDispatch.Provider
        value={{
          state,
          dispatch,
          randomLimit,
          favoriteLimit,
          autoFetchInterval
        }}
      >
        <RandomJokes />
        <FavoriteJokes />
      </StateDispatch.Provider>
    </div>
  )
}

const RandomJokes = () => {
  const { state, dispatch, favoriteLimit } = useContext(StateDispatch)
  return (
    <div className="w-50 fl">
      <h2>random jokes</h2>
      <FetchButton />
      <div>
        {state.jokes.map(x => {
          const action = x.favorite
            ? [UNLIKE, x]
            : [LIKE, { joke: x, limit: favoriteLimit }]
          return (
            <div
              className="pa2 bg-white b--gray mb3 pointer"
              onClick={() => dispatch(action)}
              key={x.id}
            >
              {x.joke}
              <LikeButton x={x} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

const FavoriteJokes = () => {
  const { state, dispatch, favoriteLimit } = useContext(StateDispatch)
  const {
    favorites: { length }
  } = state
  const header =
    length === 1
      ? 'favorite one'
      : length === favoriteLimit
      ? 'top ' + length + ' of favorites'
      : length > 0
      ? length + ' of favorites'
      : 'favorite ones'
  return (
    <div className="w-50 fl">
      <div className="pl2">
        <h2>{header}</h2>
        <AutoFetchButtons />
        <div>
          {state.favorites.map(x => (
            <div
              className="pa2 bg-white b--gray mb3 pointer"
              onClick={() => dispatch([UNLIKE, x])}
              key={x.id}
            >
              {x.joke}
              <LikeButton x={x} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const FetchButton = () => {
  const { state, dispatch, randomLimit } = useContext(StateDispatch)
  return (
    <button
      className={
        'mb3 bw0 pa2 ' +
        (state.shouldFetch ? 'bg-gray black' : 'bg-black white')
      }
      disabled={state.shouldFetch}
      onClick={() => dispatch([FETCH])}
    >
      fetch {randomLimit} jokes
    </button>
  )
}

const AutoFetchButtons = () => {
  const { state, dispatch, autoFetchInterval } = useContext(StateDispatch)
  return (
    <>
      <button
        className={
          'mb3 bw0 pa2 ' +
          (state.shouldAutoFetch ? 'bg-gray black' : 'bg-black white')
        }
        disabled={state.shouldAutoFetch}
        onClick={() => dispatch([START_AUTO_FETCH])}
      >
        fetch one every {Math.floor(autoFetchInterval / 1000)} seconds
      </button>
      <button
        className={
          'mb3 bw0 pa2 ' +
          (!state.shouldAutoFetch ? 'bg-gray black' : 'bg-black white')
        }
        disabled={!state.shouldAutoFetch}
        onClick={() => dispatch([STOP_AUTO_FETCH])}
      >
        stop
      </button>
    </>
  )
}

const LikeButton = ({ x }) => (
  <button className="f7 sans-serif pv1 dib bw0 bg-white db outline-0">
    {x.favorite ? <>&#x2605; unlike</> : <>&#x2606; like</>}
  </button>
)
