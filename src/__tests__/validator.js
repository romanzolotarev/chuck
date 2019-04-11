import { validator } from '../Login'

describe('password', () => {
  //
  // ok:     abc, cde, fgh, .., xyz
  // not ok: acd
  it('must include one straight of at least three letters', () => {
    expect(validator('aabbacd')).toBeFalsy()
  })

  //
  it('may not contain i, O, or I', () => {
    expect(validator('aabbabci')).toBeFalsy()
    expect(validator('aabbabcI')).toBeFalsy()
    expect(validator('aabbabcO')).toBeFalsy()
  })

  //
  // ok:     aabb
  // not ok: aaa
  it('must contain 2 non-overlapping pairs', () => {
    expect(validator('aaabc')).toBeFalsy()
    expect(validator('aaaabc')).toBeTruthy()
  })

  it('must be 32 or less', () => {
    expect(validator(Array(34).join('x'))).toBeFalsy()
  })

  //
  // ok: abcaabb
  // not ok: ABCaabb
  //
  it('must be lowercase alphabetic only', () => {
    expect(validator('ABCaabbabc')).toBeFalsy()
  })
  it('must return true on valid passwords', () => {
    expect(validator('aabbabc')).toBeTruthy()
    expect(validator('aabbabccde')).toBeTruthy()
  })
})
