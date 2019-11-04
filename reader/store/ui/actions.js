export const AUTH_ACTIONS = {
  TOGGLE_THUMBNAILS_SIDEBAR: 'auth/TOGGLE_THUMBNAILS_SIDEBAR',
  TOGGLE_OUTLINE_SIDEBAR: 'auth/TOGGLE_OUTLINE_SIDEBAR',
  TOGGLE_ENHANCEMENT_SIDEBAR: 'auth/TOGGLE_ENHANCEMENT_SIDEBAR',
}

export const toggleThumbnailsSidebar = () => ({
  type: AUTH_ACTIONS.TOGGLE_THUMBNAILS_SIDEBAR,
})

export const toggleOutlineSidebar = () => ({
  type: AUTH_ACTIONS.TOGGLE_OUTLINE_SIDEBAR,
})

export const toggleEnhancementSidebar = () => ({
  type: AUTH_ACTIONS.TOGGLE_OUTLINE_SIDEBAR,
})
