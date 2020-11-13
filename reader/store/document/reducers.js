import { DOCUMENT_ACTIONS } from './actions'

export const documentInitialState = {
  linkService: null,
  documentProxy: null,
  renderingQueue: null,
  eventBus: null,
  viewer: null,
  pagesLoaded: false,
  annotations: {},
}

const reducer = (state = documentInitialState, { type, payload = {} }) => {
  switch (type) {
    case DOCUMENT_ACTIONS.SET_DOCUMENT:
      return {
        ...state,
        ...payload,
      }
    case DOCUMENT_ACTIONS.SET_ANNOTATION:
      if (!payload.annotationId || !payload.annotationContent) return state
      return {
        ...state,
        annotations: {
          ...state.annotations,
          [payload.annotationId]: {
            ...state.annotations[payload.annotationId],
            ...payload.annotationContent,
          },
        },
      }
    default:
      return state
  }
}

export default reducer
