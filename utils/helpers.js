const getBuildTarget = () =>
  typeof BUILD_TARGET !== 'undefined' ? BUILD_TARGET : ''

const getAssetPath = (path, target = getBuildTarget()) =>
  target === 'aws' ? `/reader${path}` : path

const addEllipsis = (text, max) => {
  if (text.length <= max) return text

  return `${text.substring(0, max - 3)}...`
}

module.exports = { getAssetPath, addEllipsis }
