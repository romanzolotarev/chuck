import React, { useState } from 'react'

export const validator = password => {
  const rules = [
    password.length > 32,
    password.toLowerCase() !== password,
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

  return (
    <div className="center mb4 w-100 mw6 mb3 mt3">
      {loggedIn ? (
        <>
          <p>
            You have logged in as <span className="b">{username}</span>
          </p>
          <button
            onClick={() => logIn(false)}
            className="bw0 bg-gray black pa2"
          >
            log out
          </button>
        </>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault()
            logIn(validator(password))
          }}
        >
          <LabeledInput {...usernameInput} />
          <LabeledInput {...passwordInput} />
          <button
            onClick={() => logIn(validator(password))}
            className="bw0 bg-gray black pa2"
          >
            log in
          </button>
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
