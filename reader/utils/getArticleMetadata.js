import axios from 'axios'

export const CORE_API = 'https://core.ac.uk:443/api-v2/articles/get'

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

    let { data } = response.data
    // TODO: These codes should return API
    // status (string) = ['OK' or 'Not found' or 'Too many queries' or
    // 'Missing parameter' or 'Invalid parameter' or 'Parameter out of bounds']
    switch (response.data.status) {
      case 'Not found':
        data = {
          statusCode: 404,
        }
        break
      case 'Missing parameter':
        data = {
          statusCode: 404,
        }
        break
      case 'Parameter out of bounds':
        data = {
          statusCode: 404,
        }
        break
      default:
        data.statusCode = response.status
    }
    return data
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
