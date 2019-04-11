export const LIKE = 'LIKE'
export const UNLIKE = 'UNLIKE'
export const FETCH = 'FETCH'
export const UPDATE_JOKES = 'UPDATE_JOKES'

export const initialState = { jokes: [], favorites: [], shouldFetch: false }

export const reducer = (state, [actionType, payload]) => {
  switch (actionType) {
    case LIKE: {
      const joke = payload
      const jokes = state.jokes.map(x =>
        x.id === joke.id ? { ...x, favorite: true } : x
      )

      const favorites =
        state.favorites.find(x => x.id === joke.id) === undefined
          ? [{ ...joke, favorite: true }].concat(state.favorites).slice(0, 10)
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

    case FETCH:
      return { ...state, shouldFetch: true }

    default:
      return state
  }
}
