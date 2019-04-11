import { render } from 'react-dom'
import React, { useEffect, useState } from 'react'

const fetchApi = async (url, cb) => {
  const response = await fetch(url)
  const json = await response.json()
  if (json.value === undefined) return
  cb(json.value)
}

const App = ({ url }) => {
  const [jokes, setJokes] = useState([])
  useEffect(() => {
    fetchApi(url, setJokes)
  }, [url])
  return <pre>{JSON.stringify(jokes, {}, 2)}</pre>
}

render(
  <App url="https://api.icndb.com/jokes/random/10" />,
  document.getElementById('root')
)
