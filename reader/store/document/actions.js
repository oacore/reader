export const DOCUMENT_ACTIONS = {
  SET_DOCUMENT: 'document/SET_DOCUMENT',
  SET_ANNOTATION: 'document/SET_ANNOTATION',
}

export const setDocument = payload => ({
  type: DOCUMENT_ACTIONS.SET_DOCUMENT,
  payload,
})

export const setAnnotation = payload => ({
  type: DOCUMENT_ACTIONS.SET_ANNOTATION,
  payload,
})
