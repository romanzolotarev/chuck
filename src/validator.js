export const validator = password => {
  const alpha = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const alpha2 = [...[...alpha].splice(1), alpha[0]]
  const alpha3 = [...[...alpha2].splice(1), alpha2[0]]

  const pairs = alpha.map(x => x + x)
  const triples = alpha.map((x, idx) => x + alpha2[idx] + alpha3[idx])

  const allPairs = password.match(new RegExp(pairs.join('|'), 'g'))
  const allTriples = password.match(new RegExp(triples.join('|'), 'g'))

  const rules = [
    allTriples && allTriples.length >= 1,
    allPairs && allPairs.length >= 2,
    password.length <= 32,
    password.match(/[^a-z]/g) === null,
    password.match(/[iOI]/g) === null
  ]
  return rules.filter(Boolean).length === rules.length
}
