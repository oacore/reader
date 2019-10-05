import axios from 'axios'

const CORE_API = 'https://core.ac.uk:443/api-v2/articles/get'

const apiRequest = async (url, params = {}, method = 'GET') => {
  try {
    const response = await axios({
      url,
      method,
      params,
      headers: {
        'Content-Type': 'application/json',
        apiKey: CORE_API_KEY,
      },
    })
    return response.data
  } catch (e) {
    const { response, message } = e
    let customError
    if (response) {
      customError = new Error(
        `Request for ${method} ${url} failed. Response: ${response.status}, ${response.data}`
      )
    } else if (message === 'Network Error') {
      customError = new Error(
        `Request ${method} ${url} failed. You are probably in offline mode.`
      )
    } else {
      customError = new Error(
        `Request ${method} ${url} failed. The original error was: ${message}`
      )
    }

    customError.statusCode = response.status || 500
    throw customError
  }
}

const getArticleMetadata = id => {
  return apiRequest(`${CORE_API}/${id}`, {
    metadata: true,
    fulltext: false,
    citations: false,
    similar: false,
    duplicate: false,
    urls: false,
    faithfulMetadata: false,
  })
}

export default getArticleMetadata
