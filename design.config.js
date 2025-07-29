const path = require('path')

const icons = [
  'view-grid',
  'chevron-right',
  'chevron-left',
  'format-rotate-90',
  'file-download',
  'printer',
  'printer-off',
  'magnify-plus-outline',
  'magnify-minus-outline',
  'file-document',
]

const iconsRoot = path.join(
  path.dirname(require.resolve('@mdi/svg/package.json')),
  './svg'
)

const getPublicPath = () => {
  if (process.env.BUILD_TARGET === 'aws') {
    // eslint-disable-next-line no-console
    console.log(process.env.BUILD_TARGET, 'process.env.BUILD_TARGET')
    return '/reader/static/design'
  }
  if (process.env.ICONS_PUBLIC_PATH) {
    // eslint-disable-next-line no-console
    console.log(process.env.ICONS_PUBLIC_PATH, 'process.env.ICONS_PUBLIC_PATH')
    return process.env.ICONS_PUBLIC_PATH
  }
  return '/static/design'
}

const config = {
  icons: {
    path: iconsRoot,
    files: icons,
  },

  output: {
    path: path.join(__dirname, 'public/static/design'),
    publicPath: getPublicPath(),
    icons: {
      files: 'icons',
      sprite: 'icons.svg',
    },
  },
}

module.exports = config
