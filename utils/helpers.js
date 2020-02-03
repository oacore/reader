const getBuildTarget = () =>
  typeof BUILD_TARGET !== 'undefined' ? BUILD_TARGET : ''

const getAssetPath = (path, target = getBuildTarget()) =>
  target === 'aws' ? `/reader${path}` : path

module.exports = { getAssetPath }
