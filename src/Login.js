import React, { useState, useRef, useEffect } from 'react'

export const validator = password => {
  const alpha = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const alpha2 = [...[...alpha].splice(1), alpha[0]]
  const alpha3 = [...[...alpha2].splice(1), alpha2[0]]

  const pairs = alpha.map(x => x + x)
  const triples = alpha.map((x, idx) => x + alpha2[idx] + alpha3[idx])

  const allPairs = password.match(new RegExp(pairs.join('|'), 'g'))
  const allTriples = password.match(new RegExp(triples.join('|'), 'g'))

  const rules = [
    allTriples && allTriples.length < 1,
    allPairs && allPairs.length < 2,
    password.length > 32,
    password.match(/[^a-z]/g) !== null,
    password.match(/[iOI]/g) !== null
  ]
  return rules.filter(x => x === false).length === rules.length
}

export const Login = () => {
  const [loggedIn, logIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const usernameInput = {
    id: 'username',
    label: 'Username',
    type: 'text',
    value: username,
    onChange: setUsername
  }
  const passwordInput = {
    id: 'password',
    label: 'Password',
    type: 'password',
    value: password,
    onChange: setPassword
  }

  const isPasswordValid = validator(password)

  const storage = useRef(null)
  useEffect(() => {
    if (storage.current === null) {
      storage.current = window.localStorage
      logIn(JSON.parse(storage.current.getItem('loggedIn')))
    }
    storage.current.setItem('loggedIn', JSON.stringify(loggedIn))
  }, [loggedIn])

  return (
    <div className="center mb4 w-100 mw6 mb3 mt3">
      {loggedIn ? (
        <>
          <p>
            You have logged in as <span className="b">{username}</span>
          </p>
          <button
            onClick={() => logIn(false)}
            className="bw0 pa2 bg-black white"
          >
            log out
          </button>
        </>
      ) : (
        <form
          action="#"
          onSubmit={e => {
            e.preventDefault()
            logIn(isPasswordValid)
          }}
        >
          <LabeledInput {...usernameInput} />
          <LabeledInput {...passwordInput} />
          <button
            type="submit"
            className={
              isPasswordValid
                ? 'bw0 pa2 bg-black white'
                : 'bw0 pa2 bg-gray black'
            }
          >
            log in
          </button>

          <span className="pa2 gray sans-serif f7">
            {password.length > 0 && !isPasswordValid
              ? 'invaild password'
              : password.length > 0 && isPasswordValid
              ? 'vaild password'
              : ''}
          </span>
        </form>
      )}
    </div>
  )
}

const LabeledInput = ({ type, id, label, value, onChange }) => (
  <>
    <label className="db f7 sans-serif mb2" htmlFor={id}>
      {label}
    </label>
    <input
      className="db b--gray pa2 mb2"
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      id={id}
    />
  </>
)
