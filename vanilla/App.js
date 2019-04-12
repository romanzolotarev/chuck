import { swapNodes, div, h2, button } from './dom.js'
import {
  FETCH,
  UNLIKE,
  LIKE,
  STOP_AUTO_FETCH,
  START_AUTO_FETCH
} from '../src/reducer.js'

const initialState = {
  shouldFetch: false,
  shouldAutoFetch: false,
  favorites: [
    {
      id: 226,
      joke:
        "&quot;Brokeback Mountain&quot; is not just a movie. It's also what Chuck Norris calls the pile of dead ninjas in his front yard.",
      favorite: true
    },
    {
      id: 166,
      joke: "Chuck Norris doesn't play god. Playing is for children.",
      favorite: true
    },
    {
      id: 539,
      joke:
        "Chuck Norris's database has only one table, 'Kick', which he DROPs frequently.",
      favorite: true
    },
    {
      id: 162,
      joke: 'Once you go Norris, you are physically unable to go back.',
      favorite: true
    },
    {
      id: 346,
      joke:
        'Every time Chuck Norris smiles, someone dies. Unless he smiles while he?s roundhouse kicking someone in the face. Then two people die.',
      favorite: true
    },
    {
      id: 461,
      joke: 'Chuck Norris finished World of Warcraft.',
      favorite: true
    },
    {
      id: 415,
      joke: 'When Chuck Norris wants an egg, he cracks open a chicken.',
      favorite: true
    }
  ],

  jokes: [
    {
      id: 74,
      joke:
        "In honor of Chuck Norris, all McDonald's in Texas have an even larger size than the super-size. When ordering, just ask to be Chucksized.",
      categories: []
    },
    {
      id: 42,
      joke:
        "Chuck Norris doesn't churn butter. He roundhouse kicks the cows and the butter comes straight out.",
      categories: []
    },
    {
      id: 351,
      joke:
        'In a tagteam match, Chuck Norris was teamed with Hulk Hogan against King Kong Bundy and Andre The Giant. He pinned all 3 at the same time.',
      categories: []
    }
  ]
}

export default initialState

export const App = ({ url, randomLimit, favoriteLimit, autoFetchInterval }) => {
  const node = { current: document.getElementById('App') }

  const state = {
    ...initialState,
    randomLimit,
    favoriteLimit,
    autoFetchInterval
  }

  const dispatch = action => state

  //
  // Render
  //
  node.current = swapNodes(Root({ state, dispatch }), node.current)
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
