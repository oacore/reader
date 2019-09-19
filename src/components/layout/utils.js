/* eslint-disable import/prefer-default-export */

/**
 * Borrowed from JedWatson/classnames (NPM module)
 * Source: https://github.com/JedWatson/classnames/blob/master/index.js
 */
export function flatClassList(...args) {
  const classList = args
    .map(arg => {
      if (!arg) return null

      const argType = typeof arg

      if (argType === 'string' || argType === 'number') return arg

      if (Array.isArray(arg) && arg.length) return classNames.apply(this, arg)

      if (argType === 'object')
        return Object.entries(arg).map(([key, value]) => (value ? key : null))

      return null
    })
    .flat()
    .filter(x => x)

  const cssModule = typeof this == 'object' ? this : {}

  return classList
    .map(name =>
      Object.prototype.hasOwnProperty.call(cssModule, name)
        ? cssModule[name]
        : name
    )
    .join(' ')
}
