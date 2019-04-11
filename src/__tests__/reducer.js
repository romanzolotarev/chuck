import {
  initialState,
  reducer,
  LIKE,
  UNLIKE,
  FETCH,
  START_AUTO_FETCH,
  STOP_AUTO_FETCH,
  UPDATE_JOKES,
  UPDATE_FAVORITES
} from '../reducer'

describe('reducer', () => {
  const joke = { id: 1, joke: 'a' }

  it('default', () => {
    expect(reducer(initialState, {})).toEqual(initialState)
  })

  it('LIKE', () => {
    const state = { ...initialState, jokes: [joke] }
    expect(reducer(state, { type: LIKE, payload: { joke, limit: 1 } })).toEqual(
      {
        favorites: [{ id: 1, joke: 'a', favorite: true }],
        jokes: [{ id: 1, joke: 'a', favorite: true }],
        shouldFetch: false,
        shouldAutoFetch: false
      }
    )
  })

  it('LIKE keeps jokes under limit', () => {
    const favorites = [
      { id: 2, joke: 'b', favorite: true },
      { id: 3, joke: 'c', favorite: true }
    ]
    const state = { ...initialState, jokes: [joke], favorites }
    expect(reducer(state, { type: LIKE, payload: { joke, limit: 2 } })).toEqual(
      {
        favorites: [
          { id: 1, joke: 'a', favorite: true },
          { id: 2, joke: 'b', favorite: true }
        ],
        jokes: [{ id: 1, joke: 'a', favorite: true }],
        shouldFetch: false,
        shouldAutoFetch: false
      }
    )
  })

  it('UNLIKE', () => {
    const state = { ...initialState, jokes: [joke] }
    expect(reducer(state, { type: UNLIKE, payload: joke })).toEqual({
      favorites: [],
      jokes: [{ id: 1, joke: 'a', favorite: false }],
      shouldFetch: false,
      shouldAutoFetch: false
    })
  })

  it('FETCH', () => {
    expect(reducer(initialState, { type: FETCH })).toEqual({
      favorites: [],
      jokes: [],
      shouldFetch: true,
      shouldAutoFetch: false
    })
  })

  it('UPDATE_JOKES', () => {
    expect(
      reducer(initialState, { type: UPDATE_JOKES, payload: [joke] })
    ).toEqual({
      favorites: [],
      jokes: [{ id: 1, joke: 'a' }],
      shouldFetch: false,
      shouldAutoFetch: false
    })
  })

  it('UPDATE_FAVORITES', () => {
    const favorites = [
      { id: 2, joke: 'b', favorite: true },
      { id: 3, joke: 'c', favorite: true }
    ]
    expect(
      reducer(initialState, { type: UPDATE_FAVORITES, payload: favorites })
    ).toEqual({
      favorites,
      jokes: [],
      shouldFetch: false,
      shouldAutoFetch: false
    })
  })

  it('START_AUTO_FETCH', () => {
    expect(reducer(initialState, { type: START_AUTO_FETCH })).toEqual({
      favorites: [],
      jokes: [],
      shouldFetch: false,
      shouldAutoFetch: true
    })
  })

  it('STOP_AUTO_FETCH', () => {
    expect(reducer(initialState, { type: STOP_AUTO_FETCH })).toEqual({
      favorites: [],
      jokes: [],
      shouldFetch: false,
      shouldAutoFetch: false
    })
  })
})
