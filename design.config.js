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

const config = {
  icons: {
    path: iconsRoot,
    files: icons,
  },

  output: {
    path: path.join(__dirname, 'public/design'),
    publicPath: '/reader/design',
    icons: {
      files: 'icons',
      sprite: 'icons.svg',
    },
  },
}

module.exports = config
