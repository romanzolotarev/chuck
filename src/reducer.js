export const LIKE = 'LIKE'
export const UNLIKE = 'UNLIKE'
export const FETCH = 'FETCH'
export const UPDATE_JOKES = 'UPDATE_JOKES'
export const UPDATE_FAVORITES = 'UPDATE_FAVORITES'
export const START_AUTO_FETCH = 'START_AUTO_FETCH'
export const STOP_AUTO_FETCH = 'STOP_AUTO_FETCH'

export const initialState = {
  jokes: [],
  favorites: [],
  shouldFetch: false,
  shouldAutoFetch: false
}

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case LIKE: {
      const { joke, limit } = payload
      const jokes = state.jokes.map(x =>
        x.id === joke.id ? { ...x, favorite: true } : x
      )

      const favorites =
        state.favorites.find(x => x.id === joke.id) === undefined
          ? [{ ...joke, favorite: true }]
              .concat(state.favorites)
              .slice(0, limit)
          : state.favorites
      return { ...state, jokes, favorites }
    }

    case UNLIKE: {
      const joke = payload
      const jokes = state.jokes.map(x =>
        x.id === joke.id ? { ...x, favorite: false } : x
      )
      const favorites = state.favorites.filter(x => joke.id !== x.id)
      return { ...state, jokes, favorites }
    }

    case UPDATE_JOKES:
      return { ...state, jokes: payload, shouldFetch: false }

    case UPDATE_FAVORITES:
      return { ...state, favorites: payload }

    case FETCH:
      return { ...state, shouldFetch: true }

    case START_AUTO_FETCH:
      return { ...state, shouldAutoFetch: true }

    case STOP_AUTO_FETCH:
      return { ...state, shouldAutoFetch: false }

    default:
      return state
  }
}
