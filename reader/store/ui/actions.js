export const UI_ACTIONS = {
  TOGGLE_THUMBNAILS_SIDEBAR: 'ui/TOGGLE_THUMBNAILS_SIDEBAR',
  TOGGLE_OUTLINE_SIDEBAR: 'ui/TOGGLE_OUTLINE_SIDEBAR',
  TOGGLE_ENHANCEMENT_SIDEBAR: 'ui/TOGGLE_ENHANCEMENT_SIDEBAR',
  SCROLL_TO_RELATED_PAPERS: 'ui/SCROLL_TO_RELATED_PAPERS',
  UNSET_RELATED_PAPERS: 'ui/UNSET_RELATED_PAPERS',
  SCROLL_TO_LAST_READ_POSITION: 'ui/SCROLL_TO_LAST_READ_POSITION',
  SET_LAST_READ_POSITION: 'ui/SET_LAST_READ_POSITION',
  CHANGE_CURRENT_PAGE_NUMBER: 'ui/CHANGE_CURRENT_PAGE_NUMBER',
}

export const toggleThumbnailsSidebar = () => ({
  type: UI_ACTIONS.TOGGLE_THUMBNAILS_SIDEBAR,
})

export const toggleOutlineSidebar = () => ({
  type: UI_ACTIONS.TOGGLE_OUTLINE_SIDEBAR,
})

export const toggleEnhancementSidebar = () => ({
  type: UI_ACTIONS.TOGGLE_OUTLINE_SIDEBAR,
})

export const scrollToRelatedPapers = () => ({
  type: UI_ACTIONS.SCROLL_TO_RELATED_PAPERS,
})

export const unsetRelatedPapers = () => ({
  type: UI_ACTIONS.UNSET_RELATED_PAPERS,
})

export const changeCurrentPageNumber = currentPageNumber => ({
  type: UI_ACTIONS.CHANGE_CURRENT_PAGE_NUMBER,
  payload: {
    currentPageNumber,
  },
})
