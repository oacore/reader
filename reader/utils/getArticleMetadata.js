import axios from 'axios'

export const CORE_API = 'https://api.core.ac.uk/internal/articles'

const apiRequest = async (url, params = {}, method = 'GET') => {
  try {
    const response = await axios({
      url,
      method,
      params,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return { ...response.data, statusCode: response.status }
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
  return apiRequest(`${CORE_API}/${id}`)
}

export default getArticleMetadata
