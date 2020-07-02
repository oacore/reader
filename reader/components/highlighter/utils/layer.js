const CONTEXT_MENU_LAYER_CLASS_NAME = 'context-menu-layer'
const HIGHLIGHTS_LAYER_CLASS_NAME = 'highlights-layer'

export const findOrCreateLayerForContextMenu = (container) => {
  let layer = container.querySelector(`.${CONTEXT_MENU_LAYER_CLASS_NAME}`)

  if (!layer) {
    layer = document.createElement('div')
    layer.className = CONTEXT_MENU_LAYER_CLASS_NAME
    container.appendChild(layer)
  }

  return layer
}

export const findOrCreateLayerForHighlights = (container) => {
  let layer = container.querySelector(`.${HIGHLIGHTS_LAYER_CLASS_NAME}`)

  if (!layer) {
    layer = document.createElement('div')
    layer.className = HIGHLIGHTS_LAYER_CLASS_NAME
    container.appendChild(layer)
  }

  return layer
}

export const findPageLayer = (pageNumber) =>
  // TODO: Get reference from PDF viewer object.
  //  It should be cheaper operation than this one
  document.querySelector(`.page[data-page-number="${pageNumber}"]`)

export default {
  findOrCreateLayerForContextMenu,
  findOrCreateLayerForHighlights,
  findPageLayer,
}
