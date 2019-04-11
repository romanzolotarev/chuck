import {
  initialState,
  reducer,
  LIKE,
  UNLIKE,
  FETCH,
  UPDATE_JOKES
} from '../reducer.js'

describe('reducer', () => {
  it('default', () => {
    expect(reducer(initialState, [])).toEqual(initialState)
  })
  const joke = { id: 1, joke: 'a' }

  it('LIKE', () => {
    const state = { ...initialState, jokes: [joke] }
    expect(reducer(state, [LIKE, joke])).toEqual({
      favorites: [{ id: 1, joke: 'a', favorite: true }],
      jokes: [{ id: 1, joke: 'a', favorite: true }],
      shouldFetch: false
    })
  })

  it('UNLIKE', () => {
    const state = { ...initialState, jokes: [joke] }
    expect(reducer(state, [UNLIKE, joke])).toEqual({
      favorites: [],
      jokes: [{ id: 1, joke: 'a', favorite: false }],
      shouldFetch: false
    })
  })

  it('FETCH', () => {
    expect(reducer(initialState, [FETCH])).toEqual({
      favorites: [],
      jokes: [],
      shouldFetch: true
    })
  })

  it('UPDATE_JOKES', () => {
    expect(reducer(initialState, [UPDATE_JOKES, [joke]])).toEqual({
      favorites: [],
      jokes: [{ id: 1, joke: 'a' }],
      shouldFetch: false
    })
  })
})
