const getAssetPath = (path, target = process.env.BUILD_TARGET || '') =>
  target === 'azure' ? `/reader${path}` : path

const addEllipsis = (text, max) => {
  if (text.length <= max) return text

  return `${text.substring(0, max - 3)}...`
}

module.exports = { getAssetPath, addEllipsis }
