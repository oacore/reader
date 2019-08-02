import path from 'path'

const ABSOLUTE_BASE = path.normalize(path.join(__dirname, '..'))
export const BUILD_DIR = path.join(ABSOLUTE_BASE, 'build')
export const DIST_DIR = path.join(ABSOLUTE_BASE, 'dist')
export const SRC_DIR = path.join(ABSOLUTE_BASE, 'src')
