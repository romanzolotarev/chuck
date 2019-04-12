import { swapNodes, div, h2, button } from './dom.js'
import {
  reducer,
  FETCH,
  UNLIKE,
  LIKE,
  UPDATE_JOKES,
  UPDATE_FAVORITES,
  STOP_AUTO_FETCH,
  START_AUTO_FETCH,
  initialState
} from '../src/reducer.js'

//
// Fetch API
//

const fetchApi = async (url, cb) => {
  const response = await fetch(url)
  const json = await response.json()
  if (json.value === undefined) return
  cb(json.value)
}

//
// The app
//

export const App = ({ url, randomLimit, favoriteLimit, autoFetchInterval }) => {
  const node = { current: document.getElementById('App') }
  const autoFetchTimer = { current: null }
  const _state = { current: null }
  const storage = { current: null }

  const dispatch = action => {
    if (_state.current === null)
      _state.current = {
        ...initialState,
        randomLimit,
        favoriteLimit,
        autoFetchInterval
      }

    const state = reducer(_state.current, action)
    //
    // console.log(_state.current, action, state)
    //
    _state.current = state

    //
    // Fetch jokes
    //
    if (state.shouldFetch)
      fetchApi(url + randomLimit, payload =>
        dispatch({ type: UPDATE_JOKES, payload })
      )

    //
    // Auto fetch
    //
    if (autoFetchTimer.current !== null && !state.shouldAutoFetch) {
      clearInterval(autoFetchTimer.current)
      autoFetchTimer.current = null
    }
    if (autoFetchTimer.current === null && state.shouldAutoFetch) {
      const fetchOneJoke = ([joke]) =>
        dispatch({ type: LIKE, payload: { joke, limit: state.favoriteLimit } })
      fetchApi(url + '1', fetchOneJoke)
      autoFetchTimer.current = setInterval(() => {
        fetchApi(url + '1', fetchOneJoke)
      }, autoFetchInterval)
    }
    if (
      state.favorites.length >= state.favoriteLimit &&
      autoFetchTimer.current !== null
    ) {
      return dispatch({ type: STOP_AUTO_FETCH })
    }

    //
    // Keep jokes and favorites in localStorage
    //
    const setItem = (key, json) => {
      const value = JSON.stringify(json)
      value && storage.current.setItem(key, value)
    }
    //
    // Dispatch multiple actions one after the other
    //
    const reduceActions = (state, actions) =>
      actions.reduce((acc, x) => dispatch(x), state)
    const getItems = items => {
      reduceActions(
        state,
        items.map(([key, type]) => {
          const payload = JSON.parse(storage.current.getItem(key))
          return payload ? { type, payload } : {}
        })
      )
    }
    if (storage.current === null) {
      //
      // Read from localStorage
      //
      storage.current = window.localStorage
      getItems([['favorites', UPDATE_FAVORITES], ['jokes', UPDATE_JOKES]])
      return state
    } else {
      //
      // Write to localStorage
      //
      setItem('favorites', state.favorites)
      setItem('jokes', state.jokes)
    }

    //
    // Render
    //
    node.current = swapNodes(Root({ state, dispatch }), node.current)
    return state
  }

  dispatch({})
}

//
// Components
//

const Root = ({ state, dispatch }) =>
  div(
    { className: 'center mw6 w-100 cf' },
    RandomJokes({ state, dispatch }),
    FavoriteJokes({ state, dispatch })
  )

const RandomJokes = ({ state, dispatch }) => {
  return div(
    { className: 'w-50 fl' },
    h2('random jokes'),
    FetchButton({ state, dispatch }),

    div(
      state.jokes.map(x => {
        const action = x.favorite
          ? { type: UNLIKE, payload: x }
          : { type: LIKE, payload: { joke: x, limit: state.favoriteLimit } }

        return div(
          {
            className: 'pa2 bg-white b--gray mb3 pointer',
            onclick: () => dispatch(action),
            key: x.id
          },
          x.joke,
          LikeButton({ x })
        )
      })
    )
  )
}

const FavoriteJokes = ({ state, dispatch }) => {
  const {
    favorites: { length }
  } = state
  const header =
    length === 1
      ? 'favorite one'
      : length === state.favoriteLimit
      ? 'top ' + length + ' of favorites'
      : length > 0
      ? length + ' of favorites'
      : 'favorite ones'
  return div(
    { className: 'w-50 fl' },
    div(
      { className: 'pl2' },
      h2(header),
      AutoFetchButtons({ state, dispatch }),
      div(
        state.favorites.map(x =>
          div(
            {
              className: 'pa2 bg-white b--gray mb3 pointer',
              onclick: () => dispatch({ type: UNLIKE, payload: x }),
              key: x.id
            },
            x.joke,
            LikeButton({ x })
          )
        )
      )
    )
  )
}

const FetchButton = ({ state, dispatch }) => {
  return button(
    {
      className:
        'mb3 bw0 pa2 ' +
        (state.shouldFetch ? 'bg-gray black' : 'bg-black white'),
      disabled: state.shouldFetch ? 'disabled' : '',
      onclick: () => dispatch({ type: FETCH })
    },
    'fetch ' + state.randomLimit + ' jokes'
  )
}

const AutoFetchButtons = ({ state, dispatch }) => {
  return div(
    button(
      {
        className:
          'mb3 bw0 pa2 ' +
          (state.shouldAutoFetch ? 'bg-gray black' : 'bg-black white'),
        disabled: state.shouldAutoFetch ? 'disabled' : '',
        onclick: () => dispatch({ type: START_AUTO_FETCH })
      },
      ` fetch one every ${Math.floor(state.autoFetchInterval / 1000)} seconds`
    ),
    button(
      {
        className:
          'mb3 bw0 pa2 ' +
          (!state.shouldAutoFetch ? 'bg-gray black' : 'bg-black white'),
        disabled: !state.shouldAutoFetch ? 'disabled' : '',
        onclick: () => dispatch({ type: STOP_AUTO_FETCH })
      },
      'stop'
    )
  )
}

const LikeButton = ({ x }) =>
  button(
    {
      className: 'f7 sans-serif pv1 dib b--gray mt2 bg-white db outline-0'
    },
    x && (x.favorite ? 'unlike' : 'like')
  )
