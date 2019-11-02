import uiReducer, { uiInitialState } from './ui/reducers'
import metaDataReducer, { metaDataInitialState } from './metadata/reducers'
import documentReducer, { documentInitialState } from './document/reducers'

export const initialState = {
  ui: uiInitialState,
  metadata: metaDataInitialState,
  document: documentInitialState,
}

export default ({ metadata, ui, document }, action) => {
  return {
    ui: uiReducer(ui, action),
    metadata: metaDataReducer(metadata, action),
    document: documentReducer(document, action),
  }
}
