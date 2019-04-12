const attributeExceptions = ['role']

const appendText = (el, text) => {
  const textNode = document.createTextNode(text)
  el.appendChild(textNode)
}

const appendArray = (el, children) => {
  children.forEach(child => {
    if (Array.isArray(child)) {
      appendArray(el, child)
    } else if (child instanceof window.Element) {
      el.appendChild(child)
    } else if (typeof child === 'string') {
      appendText(el, child)
    }
  })
}

const setStyles = (el, styles) => {
  if (!styles) {
    el.removeAttribute('styles')
    return
  }

  Object.keys(styles).forEach(styleName => {
    if (styleName in el.style) {
      el.style[styleName] = styles[styleName]
    } else {
      console.warn(`${propName} is not a valid property of a <${type}>`)
    }
  })
}

const makeElement = (type, textOrPropsOrChild, ...otherChildren) => {
  const el = document.createElement(type)

  if (Array.isArray(textOrPropsOrChild)) {
    appendArray(el, textOrPropsOrChild)
  } else if (textOrPropsOrChild instanceof window.Element) {
    el.appendChild(textOrPropsOrChild)
  } else if (typeof textOrPropsOrChild === 'string') {
    appendText(el, textOrPropsOrChild)
  } else if (typeof textOrPropsOrChild === 'object') {
    Object.keys(textOrPropsOrChild).forEach(propName => {
      if (propName in el || attributeExceptions.includes(propName)) {
        const value = textOrPropsOrChild[propName]

        if (propName === 'style') {
          setStyles(el, value)
        } else if (value) {
          el[propName] = value
        } else {
          // console.warn(el, `${propName} is not a valid property of a <${type}>`)
        }
      }
    })
  }

  if (otherChildren) appendArray(el, otherChildren)

  return el
}

export const swapNodes = (newNode, oldNode) => {
  if (oldNode.parentElement) {
    oldNode.parentElement.replaceChild(newNode, oldNode)
  }
  return newNode
}

export const button = (...args) => makeElement('button', ...args)
export const input = (...args) => makeElement('input', ...args)
export const form = (...args) => makeElement('form', ...args)
export const div = (...args) => makeElement('div', ...args)
export const h2 = (...args) => makeElement('h2', ...args)
export const span = (...args) => makeElement('span', ...args)
export const label = (...args) => makeElement('label', ...args)
