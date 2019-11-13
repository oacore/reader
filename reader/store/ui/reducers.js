import { UI_ACTIONS } from './actions'

export const uiInitialState = {
  isSidebarOpen: false,
  isThumbnailSidebarVisible: false,
  isOutlineSidebarVisible: false,
  isEnhancementSidebarVisible: false,
  isRelatedPapersScrolled: window.location.hash === '#related-papers',
  currentPageNumber: 1,
}

export default (state = uiInitialState, { type, payload }) => {
  switch (type) {
    case UI_ACTIONS.TOGGLE_THUMBNAILS_SIDEBAR:
      return {
        ...state,
        isThumbnailSidebarVisible: !state.isThumbnailSidebarVisible,
        isOutlineSidebarVisible: false,
        isEnhancementSidebarVisible: false,
        isSidebarOpen: !state.isThumbnailSidebarVisible,
      }
    case UI_ACTIONS.TOGGLE_OUTLINE_SIDEBAR:
      return {
        ...state,
        isOutlineSidebarVisible: !state.isOutlineSidebarVisible,
        isThumbnailSidebarVisible: false,
        isEnhancementSidebarVisible: false,
        isSidebarOpen: !state.isOutlineSidebarVisible,
      }

    case UI_ACTIONS.SCROLL_TO_RELATED_PAPERS:
      if (window.history.pushState)
        window.history.pushState(null, null, '#related-papers')
      else window.location.hash = '#related-papers'

      return {
        ...state,
        isRelatedPapersScrolled: true,
      }

    case UI_ACTIONS.UNSET_RELATED_PAPERS:
      if (window.location.hash === '#related-papers') {
        if (window.history.pushState)
          window.history.pushState('', document.title, window.location.pathname)
        else window.location.hash = ''
      }
      return {
        ...state,
        isRelatedPapersScrolled: false,
      }

    case UI_ACTIONS.CHANGE_CURRENT_PAGE_NUMBER:
      return {
        ...state,
        currentPageNumber: payload.currentPageNumber,
      }
    default:
      return state
  }
}
