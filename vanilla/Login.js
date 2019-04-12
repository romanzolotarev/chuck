import { swapNodes, label, form, input, span, div, button } from './dom.js'
import { validator } from '../src/validator.js'

const SET_PASSWORD = 'SET_PASSWORD'
const SET_USERNAME = 'SET_USERNAME'
const LOG_IN = 'LOG_IN'
const LOG_OUT = 'LOG_OUT'

const initialState = {
  username: '',
  password: '',
  loggedIn: false
}

//
// The app
//

export const Login = () => {
  const _state = { current: null }
  const node = { current: document.getElementById('Login') }
  const storage = { current: null }

  const reducer = (state, { type, payload }) => {
    switch (type) {
      case SET_PASSWORD: {
        return { ...state, password: payload }
      }
      case SET_USERNAME: {
        return { ...state, username: payload }
      }
      case LOG_IN: {
        return { ...state, loggedIn: true }
      }
      case LOG_OUT: {
        return { ...state, loggedIn: false }
      }
      default:
        return state
    }
  }

  const dispatch = action => {
    if (_state.current === null) _state.current = { ...initialState }
    const state = reducer(_state.current, action)
    // console.log(_state.current, action, state)
    _state.current = state

    //
    // Store loggedIn in localStorage
    //
    if (storage.current === null) {
      storage.current = window.localStorage
      const type = JSON.parse(storage.current.getItem('loggedIn'))
        ? LOG_IN
        : LOG_OUT
      dispatch({ type })
      return state
    }
    storage.current.setItem('loggedIn', JSON.stringify(state.loggedIn))

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

const Root = ({ state, dispatch }) => {
  const isPasswordValid = validator(state.password)

  const usernameInput = {
    id: 'username',
    text: 'Username',
    type: 'text',
    value: state.username,
    onchange: e => dispatch({ type: SET_USERNAME, payload: e.target.value })
  }

  const passwordInput = {
    id: 'password',
    text: 'Password',
    type: 'password',
    value: state.password,
    onchange: e => dispatch({ type: SET_PASSWORD, payload: e.target.value })
  }

  return div(
    { className: 'center mb4 w-100 mw6 mb3 mt3' },
    state.loggedIn
      ? (div(`You have logged in as ${state.username}`),
        button(
          {
            onclick: () => dispatch({ type: LOG_OUT }),
            className: 'bw0 pa2 bg-black white'
          },
          'log out'
        ))
      : form(
          {
            action: '#',
            onsubmit: e => {
              e.preventDefault()
              validator(state.password) && dispatch({ type: LOG_IN })
            }
          },
          LabeledInput(usernameInput),
          LabeledInput(passwordInput),
          input({
            type: 'submit',
            value: 'log in',
            className: isPasswordValid
              ? 'bw0 pa2 bg-black white'
              : 'bw0 pa2 bg-gray black'
          }),

          span(
            { className: 'pa2 gray sans-serif f7' },
            state.password.length > 0 && !isPasswordValid
              ? 'invaild password'
              : state.password.length > 0 && isPasswordValid && 'vaild password'
          )
        )
  )
}

const LabeledInput = ({ id, text, ...props }) =>
  div(
    label({ className: 'db f7 sans-serif mb2', htmlFor: id }, text),
    input({ className: 'db b--gray pa2 mb2', id, ...props })
  )
