const getBuildTarget = () => {
  return typeof BUILD_TARGET !== 'undefined' ? BUILD_TARGET : ''
}

const getAssetPath = (path, target = getBuildTarget()) => {
  return target === 'aws' ? `/reader-beta${path}` : path
}

module.exports = { getAssetPath }