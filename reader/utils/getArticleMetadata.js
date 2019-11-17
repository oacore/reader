import API from '@oacore/api'

const getArticleMetadata = id => {
  return API.getArticleMetadata(id)
}

export default getArticleMetadata
