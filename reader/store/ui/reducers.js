import { AUTH_ACTIONS } from './actions'

export const uiInitialState = {
  isSidebarOpen: false,
  isThumbnailSidebarVisible: false,
  isOutlineSidebarVisible: false,
  isEnhancementSidebarVisible: false,
}

export default (state = uiInitialState, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.TOGGLE_THUMBNAILS_SIDEBAR:
      return {
        ...state,
        isThumbnailSidebarVisible: !state.isThumbnailSidebarVisible,
        isOutlineSidebarVisible: false,
        isEnhancementSidebarVisible: false,
        isSidebarOpen: !state.isThumbnailSidebarVisible,
      }
    case AUTH_ACTIONS.TOGGLE_OUTLINE_SIDEBAR:
      return {
        ...state,
        isOutlineSidebarVisible: !state.isOutlineSidebarVisible,
        isThumbnailSidebarVisible: false,
        isEnhancementSidebarVisible: false,
        isSidebarOpen: !state.isOutlineSidebarVisible,
      }
    default:
      return state
  }
}
