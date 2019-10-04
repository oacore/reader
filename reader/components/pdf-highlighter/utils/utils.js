export const getPageFromElement = target => {
  const node = target.closest('.page')

  if (!(node instanceof HTMLElement)) return null

  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
  const number = Number(node.dataset.pageNumber)

  return { node, number }
}

export const getPageFromRange = ({ startContainer, endContainer }) => {
  const { parentElement: startParentElement } = startContainer
  const { parentElement: endParentElement } = endContainer

  return {
    selectionStartPage: getPageFromElement(startParentElement),
    selectionEndPage: getPageFromElement(endParentElement),
  }
}
