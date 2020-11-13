import uiReducer, { uiInitialState } from './ui/reducers'
import metaDataReducer, { metaDataInitialState } from './metadata/reducers'
import documentReducer, { documentInitialState } from './document/reducers'

export const initialState = {
  ui: uiInitialState,
  metadata: metaDataInitialState,
  document: documentInitialState,
}

const reducer = ({ metadata, ui, document }, action) => ({
  ui: uiReducer(ui, action),
  metadata: metaDataReducer(metadata, action),
  document: documentReducer(document, action),
})

export default reducer
